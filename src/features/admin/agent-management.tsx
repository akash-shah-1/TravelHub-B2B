import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { Row } from "@/features/shared/row";
import { agents, fmtINR, type Agent } from "@/lib/mock-data";
import { UserPlus, MoreHorizontal, CheckCircle2, XCircle } from "lucide-react";

export function AgentManagement() {
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [selected, setSelected] = useState<Agent | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = agents.filter(a =>
    (status === "all" || a.status === status) &&
    (type === "all" || a.type === type),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending KYC">Pending KYC</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Master">Master</SelectItem>
            <SelectItem value="Agent">Agent</SelectItem>
            <SelectItem value="Sub-Agent">Sub-Agent</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-44" defaultValue="2026-01-01" />
        <Button className="ml-auto" onClick={() => setAddOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Add Agent
        </Button>
      </div>

      <DataTable
        rows={filtered}
        columns={[
          { key: "name", header: "Business Name", render: r => (
            <button onClick={() => setSelected(r)} className="text-left font-medium hover:text-primary">
              {r.name}<p className="text-xs text-muted-foreground">{r.id}</p>
            </button>
          )},
          { key: "type", header: "Type", render: r => <StatusBadge status={r.type === "Master" ? "Active" : r.type === "Sub-Agent" ? "Amended" : "Confirmed"} /> },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
          { key: "credit", header: "Credit Limit", render: r => fmtINR(r.creditLimit) },
          { key: "wallet", header: "Wallet", render: r => <span className="font-medium">{fmtINR(r.walletBalance)}</span> },
          { key: "joined", header: "Joined", render: r => r.joined },
          { key: "actions", header: "", render: r => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelected(r)}>View Details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success(`${r.name} suspended`)}>Suspend</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success(`Credit added to ${r.name}`)}>Add Credit</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )},
        ]}
      />

      <AgentDetailDialog agent={selected} onClose={() => setSelected(null)} />
      <AddAgentDialog open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

function AgentDetailDialog({ agent, onClose }: { agent: Agent | null; onClose: () => void }) {
  return (
    <Dialog open={!!agent} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {agent && (
          <>
            <DialogHeader>
              <DialogTitle>{agent.name}</DialogTitle>
              <DialogDescription>Agent ID {agent.id} · {agent.type}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Business Info</CardTitle></CardHeader><CardContent className="text-sm space-y-1.5">
                <Row label="GST" value={agent.gst} />
                <Row label="PAN" value={agent.pan} />
                <Row label="Email" value={agent.email} />
                <Row label="Phone" value={agent.phone} />
                <Row label="City" value={agent.city} />
              </CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">KYC Documents</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
                {["Trade License", "GST Certificate", "PAN Card", "Bank Details"].map(d => (
                  <div key={d} className="flex items-center justify-between">
                    <span>{d}</span>
                    <div className="flex gap-1.5">
                      <StatusBadge status={agent.status === "Pending KYC" ? "Pending" : "Approved"} />
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => toast.success(`${d} approved`)}><CheckCircle2 className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => toast.error(`${d} rejected`)}><XCircle className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Hierarchy</CardTitle></CardHeader><CardContent className="text-sm">
                {agents.filter(a => a.parent === agent.id).length > 0 ? (
                  <ul className="space-y-1.5">
                    {agents.filter(a => a.parent === agent.id).map(s => (
                      <li key={s.id} className="flex justify-between"><span>↳ {s.name}</span><span className="text-muted-foreground">{fmtINR(s.walletBalance)}</span></li>
                    ))}
                  </ul>
                ) : <p className="text-muted-foreground">No sub-agents</p>}
              </CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Wallet & Markup</CardTitle></CardHeader><CardContent className="text-sm space-y-1.5">
                <Row label="Balance" value={fmtINR(agent.walletBalance)} />
                <Row label="Credit Limit" value={fmtINR(agent.creditLimit)} />
                <Row label="Default Markup" value="3.5% Flight · 4% Hotel" />
                <Row label="Commission Tier" value="Standard" />
              </CardContent></Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={() => { toast.success("Settings updated"); onClose(); }}>Save Changes</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddAgentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Onboard New Agent</DialogTitle>
          <DialogDescription>Send an invitation with KYC requirements</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div><Label>Business Name</Label><Input placeholder="Skyway Tours Pvt Ltd" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Type</Label>
              <Select defaultValue="Agent"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Master">Master</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Sub-Agent">Sub-Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>City</Label><Input placeholder="Mumbai" /></div>
            <div><Label>Email</Label><Input type="email" placeholder="contact@business.in" /></div>
            <div><Label>Phone</Label><Input placeholder="+91 98XXX XXXXX" /></div>
            <div><Label>GST Number</Label><Input placeholder="27AABCD1234E1Z5" /></div>
            <div><Label>PAN</Label><Input placeholder="AABCD1234E" /></div>
            <div><Label>Credit Limit (₹)</Label><Input type="number" placeholder="100000" /></div>
            <div><Label>Default Markup (%)</Label><Input type="number" placeholder="3.5" step="0.1" /></div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { toast.success("Invitation sent · KYC link emailed"); onClose(); }}>Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
