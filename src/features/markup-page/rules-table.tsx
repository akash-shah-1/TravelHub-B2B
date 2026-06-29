import { useState, type DragEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GripVertical, Plus, Pencil, Copy, Power, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlightMarkupRule, RuleStatus } from "./data";

function StatusPill({ status }: { status: RuleStatus }) {
  const map: Record<RuleStatus, string> = {
    Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    Scheduled: "bg-primary/15 text-primary border-primary/20",
  };
  return <Badge variant="outline" className={cn("rounded-full font-medium", map[status])}>{status}</Badge>;
}

interface Props {
  rules: FlightMarkupRule[];
  onReorder: (next: FlightMarkupRule[]) => void;
  onEdit: (r: FlightMarkupRule) => void;
  onDuplicate: (r: FlightMarkupRule) => void;
  onToggle: (id: string) => void;
  onAdd: () => void;
}

export function RulesTable({ rules, onReorder, onEdit, onDuplicate, onToggle, onAdd }: Props) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [trip, setTrip] = useState("all");
  const [applies, setApplies] = useState("all");
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const filtered = rules.filter((r) => {
    if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (status !== "all" && r.status !== status) return false;
    if (trip !== "all" && !r.tripTypes.includes(trip as never)) return false;
    if (applies !== "all" && r.appliesToKind !== applies) return false;
    return true;
  });

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: DragEvent) => e.preventDefault();
  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    const next = [...rules];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    next.forEach((r, idx) => (r.priority = idx + 1));
    onReorder(next);
    setDragIdx(null);
    toast.success("Priority updated");
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-primary">Active Markup Rules</h2>
          <p className="text-xs text-slate-500 mt-0.5">{rules.length} rules · drag to reorder priority</p>
        </div>
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-1.5" /> Add New Rule
        </Button>
      </div>

      <div className="px-5 pt-4 pb-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name…" className="pl-8 h-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={trip} onValueChange={setTrip}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Trip type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All trips</SelectItem>
            <SelectItem value="One-way">One-way</SelectItem>
            <SelectItem value="Round-trip">Round-trip</SelectItem>
            <SelectItem value="Multi-city">Multi-city</SelectItem>
            <SelectItem value="All">All</SelectItem>
          </SelectContent>
        </Select>
        <Select value={applies} onValueChange={setApplies}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Applies to" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All scopes</SelectItem>
            <SelectItem value="All">All Agents</SelectItem>
            <SelectItem value="Specific">Specific Agent</SelectItem>
            <SelectItem value="Tier">Agent Tier</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mx-5 mb-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 px-3 py-2 text-xs flex gap-2 items-start">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>
          Rules are evaluated top to bottom by priority. Most specific matching rule wins. Drag rows to reorder priority.
        </span>
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
              <TableHead className="w-8" />
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Pri</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Rule Name</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Applies To</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Trip</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Route</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Markup</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow
                key={r.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(i)}
                className="group hover:bg-primary/5 transition-colors cursor-move"
              >
                <TableCell className="text-slate-300 group-hover:text-slate-500"><GripVertical className="h-4 w-4" /></TableCell>
                <TableCell className="font-semibold text-slate-700">{r.priority}</TableCell>
                <TableCell className="font-medium text-slate-900">{r.name}
                  {r.status === "Scheduled" && r.scheduledStart && (
                    <div className="text-[11px] text-primary font-normal mt-0.5">starts {r.scheduledStart}</div>
                  )}
                </TableCell>
                <TableCell className="text-sm text-slate-600">{r.appliesToLabel}</TableCell>
                <TableCell className="text-sm text-slate-600">{r.tripTypes.join(", ")}</TableCell>
                <TableCell className="text-sm text-slate-600">{r.routeLabel}</TableCell>
                <TableCell className="text-sm font-medium text-slate-800">{r.valueLabel}</TableCell>
                <TableCell><StatusPill status={r.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(r)} title="Edit"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDuplicate(r)} title="Duplicate"><Copy className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onToggle(r.id)} title="Toggle status"><Power className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center text-slate-400 py-10">No rules match filters</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
