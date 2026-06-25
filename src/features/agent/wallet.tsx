import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { walletTxns, fmtINR } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export function AgentWallet() {
  const [open, setOpen] = useState(false);
  const [stmt, setStmt] = useState(false);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
          <CardContent className="p-6">
            <p className="text-sm opacity-80">Current Wallet Balance</p>
            <p className="text-4xl font-semibold tracking-tight mt-1">{fmtINR(234500)}</p>
            <p className="text-xs opacity-80 mt-2">Credit limit: {fmtINR(500000)} · Available: {fmtINR(500000)}</p>
            <div className="flex gap-2 mt-4">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button variant="secondary"><Plus className="h-4 w-4 mr-1.5" /> Top Up</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Top Up Wallet</DialogTitle></DialogHeader>
                  <div className="space-y-3 pt-2">
                    <div><Label>Amount (₹)</Label><Input type="number" placeholder="50000" /></div>
                    <div><Label className="mb-2 block">Payment Method</Label>
                      <RadioGroup defaultValue="upi" className="space-y-2">
                        <div className="flex items-center gap-2 rounded-md border p-3"><RadioGroupItem value="upi" id="upi" /><Label htmlFor="upi" className="cursor-pointer">UPI · Instant</Label></div>
                        <div className="flex items-center gap-2 rounded-md border p-3"><RadioGroupItem value="neft" id="neft" /><Label htmlFor="neft" className="cursor-pointer">NEFT / RTGS · 2-4 hrs</Label></div>
                      </RadioGroup>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => { toast.success("Wallet credited"); setOpen(false); }}>Pay Now</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10" onClick={() => setStmt(true)}>View Statement</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Commission Pending</p>
              <p className="text-2xl font-semibold tracking-tight text-warning-foreground">{fmtINR(6200)}</p>
              <p className="text-xs text-muted-foreground">Next settlement: 1 Jul 2026</p>
            </div>
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground">Settled YTD</p>
              <p className="text-2xl font-semibold tracking-tight text-success">{fmtINR(42800)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            rows={walletTxns}
            columns={[
              { key: "date", header: "Date", render: r => r.date },
              { key: "type", header: "Type", render: r => <StatusBadge status={r.type === "Credit" ? "Approved" : "Cancelled"} /> },
              { key: "amount", header: "Amount", render: r => <span className={r.type === "Credit" ? "text-success font-medium" : "font-medium"}>{r.type === "Credit" ? "+" : "−"} {fmtINR(r.amount)}</span> },
              { key: "desc", header: "Description", render: r => <span className="text-muted-foreground">{r.desc}</span> },
              { key: "bal", header: "Balance After", render: r => fmtINR(r.balance) },
            ]}
          />
        </CardContent>
      </Card>

      <Dialog open={stmt} onOpenChange={setStmt}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Wallet Statement</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <DataTable
              rows={walletTxns}
              pageSize={10}
              columns={[
                { key: "date", header: "Date", render: r => r.date },
                { key: "desc", header: "Description", render: r => <span className="text-muted-foreground">{r.desc}</span> },
                { key: "amt", header: "Amount", render: r => <span className={r.type === "Credit" ? "text-success" : ""}>{r.type === "Credit" ? "+" : "−"} {fmtINR(r.amount)}</span> },
                { key: "bal", header: "Balance", render: r => fmtINR(r.balance) },
              ]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStmt(false)}>Close</Button>
            <Button onClick={() => toast.success("Statement PDF downloaded")}>Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
