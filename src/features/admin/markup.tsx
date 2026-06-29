import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { adminMarkupRules, commissionRules, fmtINR } from "@/lib/mock-data";
import { Plus, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function MarkupCommission() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Markup Rules</CardTitle><CardDescription>Platform-level markup applied on net supplier prices</CardDescription></div>
          <div className="flex items-center gap-2">
            <Link to="/flight-markup"><Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-1.5" /> Advanced Flight Markup</Button></Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" /> Add Rule</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Markup Rule</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div><Label>Rule Name</Label><Input placeholder="Monsoon Flight Special" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Product Type</Label>
                    <Select defaultValue="Flight"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Flight">Flight</SelectItem><SelectItem value="Hotel">Hotel</SelectItem><SelectItem value="All">All</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Supplier</Label>
                    <Select defaultValue="All"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="All">All</SelectItem><SelectItem value="Amadeus">Amadeus</SelectItem><SelectItem value="TBO">TBO</SelectItem><SelectItem value="HotelBeds">HotelBeds</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Markup Type</Label>
                    <Select defaultValue="Percentage"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Flat">Flat ₹</SelectItem><SelectItem value="Percentage">Percentage %</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div><Label>Value</Label><Input type="number" defaultValue="3.5" /></div>
                  <div><Label>Valid From</Label><Input type="date" defaultValue="2026-07-01" /></div>
                  <div><Label>Valid To</Label><Input type="date" defaultValue="2026-12-31" /></div>
                </div>
                <div><Label>Applies to Tier</Label>
                  <Select defaultValue="All"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="All">All Agents</SelectItem><SelectItem value="Master">Master Only</SelectItem><SelectItem value="Agent">Agents</SelectItem><SelectItem value="Sub">Sub-Agents</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => { toast.success("Markup rule created"); setOpen(false); }}>Create Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={adminMarkupRules}
            columns={[
              { key: "name", header: "Rule Name", render: r => <span className="font-medium">{r.name}</span> },
              { key: "applies", header: "Applies To", render: r => r.appliesTo },
              { key: "type", header: "Type", render: r => r.type },
              { key: "value", header: "Value", render: r => r.type === "Flat" ? fmtINR(r.value) : `${r.value}%` },
              { key: "scope", header: "Scope", render: r => r.scope },
              { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Commission Splits</CardTitle><CardDescription>Click any cell to edit inline</CardDescription></CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40"><tr>
                <th className="text-left p-3 font-medium">Supplier</th>
                <th className="text-right p-3 font-medium">Platform %</th>
                <th className="text-right p-3 font-medium">Agent %</th>
                <th className="text-right p-3 font-medium">Sub-Agent %</th>
              </tr></thead>
              <tbody>
                {commissionRules.map(c => (
                  <tr key={c.supplier} className="border-t">
                    <td className="p-3 font-medium">{c.supplier}</td>
                    <td className="p-3"><Input type="number" defaultValue={c.platform} step="0.1" className="h-8 text-right" /></td>
                    <td className="p-3"><Input type="number" defaultValue={c.agent} step="0.1" className="h-8 text-right" /></td>
                    <td className="p-3"><Input type="number" defaultValue={c.subAgent} step="0.1" className="h-8 text-right" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
