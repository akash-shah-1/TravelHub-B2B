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

interface Props {
  stickyTopClass?: string; // e.g. "top-20" or "top-4"
}

export function MarkupWorkspace({ stickyTopClass = "top-4" }: Props) {
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
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 xl:col-span-8 space-y-6">
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
      <aside className="col-span-12 xl:col-span-4 space-y-6">
        <div className={`xl:sticky ${stickyTopClass} space-y-6`}>
          <PreviewCalculator activeRule={editingId ? draft : activeForPreview} />
          <ConflictChecker rules={rules} />
        </div>
      </aside>
    </div>
  );
}
