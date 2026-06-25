import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { agentMarkupRules, fmtINR, type MarkupRule } from "@/lib/mock-data";
import { applyMarkup } from "@/lib/booking-utils";
import { Edit2, Plus } from "lucide-react";

export function AgentMarkup() {
  const [rules, setRules] = useState<MarkupRule[]>(agentMarkupRules);
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState(10000);
  const [addOpen, setAddOpen] = useState(false);
  const activeRule = rules[0];
  const customerPays = applyMarkup(preview, activeRule.value);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rules.map(r => (
          <Card key={r.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.appliesTo} · {r.scope}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              {editing === r.id ? (
                <div className="space-y-2">
                  <Input type="number" defaultValue={r.value} onChange={(e) => setRules(rs => rs.map(x => x.id === r.id ? { ...x, value: Number(e.target.value) } : x))} />
                  <Button size="sm" className="w-full" onClick={() => { setEditing(null); toast.success("Rule updated"); }}>Save</Button>
                </div>
              ) : (
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold tracking-tight">{r.type === "Flat" ? fmtINR(r.value) : `${r.value}%`}</p>
                  <Button size="sm" variant="outline" onClick={() => setEditing(r.id)}><Edit2 className="h-3.5 w-3.5 mr-1.5" />Edit</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <Card className="border-dashed flex items-center justify-center min-h-[150px]">
          <Button variant="ghost" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1.5" /> Add New Rule</Button>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Live Preview</CardTitle><CardDescription>Test how your default markup affects sell price</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label>Net Supplier Price (₹)</Label>
            <Input type="number" value={preview} onChange={(e) => setPreview(Number(e.target.value) || 0)} />
          </div>
          <div className="rounded-lg bg-accent/60 px-5 py-3">
            <p className="text-xs text-muted-foreground">Customer Pays (applying {activeRule.name})</p>
            <p className="text-2xl font-semibold tracking-tight">{fmtINR(customerPays)} <span className="text-sm text-success font-normal">+{fmtINR(customerPays - preview)}</span></p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Markup Rule</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div><Label>Rule Name</Label><Input placeholder="My Festive Hotels" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Applies To</Label>
                <Select defaultValue="Flight"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flight">Flight</SelectItem>
                    <SelectItem value="Hotel">Hotel</SelectItem>
                    <SelectItem value="All">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Type</Label>
                <Select defaultValue="Percentage"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Flat">Flat ₹</SelectItem>
                    <SelectItem value="Percentage">Percentage %</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Value</Label><Input type="number" defaultValue="4" /></div>
              <div><Label>Scope</Label><Input placeholder="All Customers" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const id = `AMR${rules.length + 1}`;
              setRules([...rules, { id, name: "New Rule", appliesTo: "Flight", type: "Percentage", value: 4, scope: "All Customers", status: "Active" }]);
              toast.success("Markup rule added");
              setAddOpen(false);
            }}>Create Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
