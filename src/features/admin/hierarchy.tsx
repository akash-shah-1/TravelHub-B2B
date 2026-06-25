import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { agents, bookings, fmtINR, type Agent } from "@/lib/mock-data";
import { ChevronRight, Plus } from "lucide-react";

function Node({ a, level = 0, onAddSub }: { a: Agent; level?: number; onAddSub: (parent: Agent) => void }) {
  const children = agents.filter(c => c.parent === a.id);
  const [open, setOpen] = useState(true);
  const agentBookings = bookings.filter(b => b.agentId === a.id).length;
  return (
    <div style={{ marginLeft: level * 24 }}>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3 my-2">
        {children.length > 0 && (
          <button onClick={() => setOpen(o => !o)} className="text-muted-foreground hover:text-foreground">
            <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
        )}
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground text-xs font-semibold">
          {a.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{a.name}</p>
          <p className="text-xs text-muted-foreground">{a.type} · {a.city}</p>
        </div>
        <div className="text-right text-sm hidden sm:block">
          <p className="font-medium">{agentBookings} bookings</p>
          <p className="text-xs text-muted-foreground">{fmtINR(a.walletBalance)}</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => onAddSub(a)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Sub-Agent
        </Button>
      </div>
      {open && children.map(c => <Node key={c.id} a={c} level={level + 1} onAddSub={onAddSub} />)}
    </div>
  );
}

export function Hierarchy() {
  const masters = agents.filter(a => a.type === "Master");
  const [parent, setParent] = useState<Agent | null>(null);
  return (
    <Card>
      <CardHeader><CardTitle>Agent Hierarchy</CardTitle><CardDescription>Master → Agent → Sub-Agent</CardDescription></CardHeader>
      <CardContent>
        {masters.map(m => <Node key={m.id} a={m} onAddSub={setParent} />)}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Independent agents (no master)</p>
          {agents.filter(a => a.type === "Agent" && !a.parent).map(m => <Node key={m.id} a={m} onAddSub={setParent} />)}
        </div>
      </CardContent>

      <Dialog open={!!parent} onOpenChange={(o) => !o && setParent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sub-Agent under {parent?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div><Label>Business Name</Label><Input placeholder="Sunshine Sub Agency" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Email</Label><Input type="email" placeholder="contact@sub.in" /></div>
              <div><Label>Phone</Label><Input placeholder="+91 ..." /></div>
              <div><Label>City</Label><Input placeholder="Pune" /></div>
              <div><Label>Credit Limit (₹)</Label><Input type="number" placeholder="50000" /></div>
              <div><Label>Markup Tier</Label>
                <Select defaultValue="standard"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="lite">Lite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Status</Label>
                <Select defaultValue="Pending KYC"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending KYC">Pending KYC</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setParent(null)}>Cancel</Button>
            <Button onClick={() => { toast.success(`Sub-agent invited under ${parent?.name}`); setParent(null); }}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
