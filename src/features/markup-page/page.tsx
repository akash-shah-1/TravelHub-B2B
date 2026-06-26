import { useState } from "react";
import { toast } from "sonner";
import { RulesTable } from "./rules-table";
import { RuleForm } from "./rule-form";
import { PreviewCalculator } from "./preview";
import { ConflictChecker } from "./conflict-checker";
import { initialRules, emptyDraft, type FlightMarkupRule } from "./data";

function makeValueLabel(r: FlightMarkupRule): string {
  const per = r.applyMode === "sector" ? "/sector" : "/booking";
  switch (r.markupType) {
    case "Flat": return `₹${r.flatAmount ?? 0} flat${per}`;
    case "Percentage": return `${r.pctAmount ?? 0}% of net fare`;
    case "FlatPct": return `₹${r.flatAmount ?? 0} flat + ${r.pctAmount ?? 0}%`;
    case "PerPax": return `Per-pax markup`;
  }
}

export function FlightMarkupPage() {
  const [rules, setRules] = useState<FlightMarkupRule[]>(initialRules);
  const [draft, setDraft] = useState<FlightMarkupRule>({ ...emptyDraft, id: "new" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (r: FlightMarkupRule) => {
    setEditingId(r.id);
    setDraft({ ...r });
    document.getElementById("rule-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDuplicate = (r: FlightMarkupRule) => {
    const copy: FlightMarkupRule = { ...r, id: `R${Date.now()}`, name: `${r.name} (copy)`, priority: rules.length + 1 };
    setRules([...rules, copy]);
    toast.success("Rule duplicated");
  };

  const handleToggle = (id: string) => {
    setRules(rs => rs.map(r => r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r));
    toast.success("Status updated");
  };

  const handleAdd = () => {
    setEditingId(null);
    setDraft({ ...emptyDraft, id: "new", priority: rules.length + 1 });
    document.getElementById("rule-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSave = (mode: "Active" | "Draft") => {
    if (!draft.name.trim()) { toast.error("Rule name is required"); return; }
    const finalRule: FlightMarkupRule = {
      ...draft,
      valueLabel: makeValueLabel(draft),
      status: mode === "Draft" ? "Inactive" : draft.status,
    };
    if (editingId) {
      setRules(rs => rs.map(r => r.id === editingId ? { ...finalRule, id: editingId } : r));
      toast.success(mode === "Draft" ? "Saved as draft" : "Rule updated & activated");
    } else {
      setRules([...rules, { ...finalRule, id: `R${Date.now()}` }]);
      toast.success(mode === "Draft" ? "Draft created" : "Rule created & activated");
    }
    setEditingId(null);
    setDraft({ ...emptyDraft, id: "new", priority: rules.length + 2 });
  };

  const handleCancel = () => {
    setEditingId(null);
    setDraft({ ...emptyDraft, id: "new", priority: rules.length + 1 });
  };

  const activeForPreview = rules.find(r => r.status === "Active") ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top navbar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[1480px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-[#1E3A8A] grid place-items-center text-white text-sm font-bold">TH</div>
            <span className="text-sm font-semibold text-slate-700">Super Admin Panel</span>
          </div>
          <h1 className="text-base font-semibold text-[#1E3A8A]">Flight Markup Rules</h1>
          <div className="text-xs text-slate-500">admin@travel-hub.in</div>
        </div>
      </header>

      <main className="max-w-[1480px] mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {/* Left column 65% */}
        <div className="col-span-8 space-y-6">
          <RulesTable
            rules={rules}
            onReorder={setRules}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onToggle={handleToggle}
            onAdd={handleAdd}
          />
          <div id="rule-form-anchor" />
          <RuleForm
            draft={draft}
            isEdit={!!editingId}
            onChange={setDraft}
            onSave={handleSave}
            onCancel={handleCancel}
            onReset={() => setDraft({ ...emptyDraft, id: "new", priority: rules.length + 1 })}
          />
        </div>

        {/* Right column 35% — sticky */}
        <aside className="col-span-4 space-y-6">
          <div className="sticky top-20 space-y-6">
            <PreviewCalculator activeRule={editingId ? draft : activeForPreview} />
            <ConflictChecker rules={rules} />
          </div>
        </aside>
      </main>
    </div>
  );
}
