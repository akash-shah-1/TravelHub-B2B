import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/stat-card";
import { DataTable } from "@/components/data-table";
import { agents, fmtINR, type Agent } from "@/lib/mock-data";
import { Wallet, ArrowUpRight, CreditCard, Plus } from "lucide-react";

export function WalletLedger() {
  const [open, setOpen] = useState<Agent | null>(null);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Wallet className="h-5 w-5" />} label="Total Collected" value={fmtINR(48420000)} tone="info" />
        <StatCard icon={<ArrowUpRight className="h-5 w-5" />} label="Commissions Owed" value={fmtINR(3210000)} tone="warning" />
        <StatCard icon={<CreditCard className="h-5 w-5" />} label="Net Revenue (MTD)" value={fmtINR(2840000)} tone="success" />
        <Card><CardContent className="p-5 space-y-3">
          <p className="text-sm text-muted-foreground">Settlement Cycle</p>
          <div className="flex items-center gap-3">
            <span className="text-sm">Weekly</span>
            <Switch defaultChecked onCheckedChange={(v) => toast(`Switched to ${v ? "Monthly" : "Weekly"}`)} />
            <span className="text-sm">Monthly</span>
          </div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Agent Wallets</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            rows={agents.filter(a => a.status !== "Pending KYC")}
            columns={[
              { key: "name", header: "Agent", render: r => <span className="font-medium">{r.name}</span> },
              { key: "balance", header: "Balance", render: r => fmtINR(r.walletBalance) },
              { key: "credit", header: "Credit Limit", render: r => fmtINR(r.creditLimit) },
              { key: "actions", header: "", render: r => (
                <Button size="sm" variant="outline" onClick={() => setOpen(r)}><Plus className="h-3.5 w-3.5 mr-1" /> Add Credit</Button>
              )},
            ]}
          />
        </CardContent>
      </Card>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Credit · {open?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <div><Label>Amount (INR)</Label><Input type="number" placeholder="50000" /></div>
            <div><Label>Note</Label><Textarea placeholder="Manual top-up against bank transfer ref ICICI/2026/..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Cancel</Button>
            <Button onClick={() => { toast.success(`Credit added to ${open?.name}`); setOpen(null); }}>Credit Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
