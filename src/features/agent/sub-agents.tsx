import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { Row } from "@/features/shared/row";
import { agents, fmtINR, type Agent } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export function SubAgents() {
  const subs = agents.filter(a => a.parent === "AGT001");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Agent | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{subs.length} sub-agents under Demo Co. Travels</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" /> Add Sub-Agent</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Sub-Agent</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div><Label>Business Name</Label><Input placeholder="Sunshine Travels" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Email</Label><Input type="email" placeholder="contact@business.in" /></div>
                <div><Label>Phone</Label><Input placeholder="+91 ..." /></div>
                <div><Label>City</Label><Input placeholder="Pune" /></div>
                <div><Label>Credit Limit (₹)</Label><Input type="number" placeholder="50000" /></div>
                <div><Label>Markup Override (%)</Label><Input type="number" placeholder="Optional" /></div>
                <div><Label>GST</Label><Input placeholder="Optional" /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => { toast.success("Sub-agent invited"); setOpen(false); }}>Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        rows={subs}
        columns={[
          { key: "name", header: "Name", render: r => <button onClick={() => setView(r)} className="font-medium hover:text-primary">{r.name}</button> },
          { key: "email", header: "Email", render: r => <span className="text-muted-foreground">{r.email}</span> },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
          { key: "wallet", header: "Wallet", render: r => fmtINR(r.walletBalance) },
          { key: "credit", header: "Credit", render: r => fmtINR(r.creditLimit) },
          { key: "act", header: "", render: r => <Button size="sm" variant="ghost" onClick={() => setView(r)}>View</Button> },
        ]}
      />

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{view?.name}</DialogTitle>
            <DialogDescription>Sub-Agent · {view?.id}</DialogDescription>
          </DialogHeader>
          {view && (
            <Card className="p-4 space-y-2 text-sm">
              <Row label="Email" value={view.email} />
              <Row label="Phone" value={view.phone} />
              <Row label="City" value={view.city} />
              <Row label="GST" value={view.gst} />
              <Row label="Wallet" value={fmtINR(view.walletBalance)} />
              <Row label="Credit Limit" value={fmtINR(view.creditLimit)} />
              <Row label="Status" value={<StatusBadge status={view.status} />} />
            </Card>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setView(null)}>Close</Button>
            <Button onClick={() => { toast.success(`Credit added to ${view?.name}`); setView(null); }}>Add Credit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
