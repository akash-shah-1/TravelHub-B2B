import { useState } from "react";
import { toast } from "sonner";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import {
  agents, bookings, activity, adminMarkupRules, commissionRules, suppliers,
  bookingVolume, revenueBySupplier, topRoutes, fmtINR,
} from "@/lib/mock-data";
import {
  Users, Plane, Wallet, FileCheck2, UserPlus, BookOpen, CheckCircle2,
  XCircle, ArrowUpRight, ChevronRight, Download, Plus, MoreHorizontal, CreditCard,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RPieChart,
  Pie, Cell, CartesianGrid,
} from "recharts";

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

// ---------------- OVERVIEW ----------------
export function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Agents" value="142" delta="+8 this week" tone="info" />
        <StatCard icon={<Plane className="h-5 w-5" />} label="Active Bookings Today" value="87" delta="+12%" tone="default" />
        <StatCard icon={<Wallet className="h-5 w-5" />} label="Platform Revenue (MTD)" value={fmtINR(2840000)} delta="+18.4%" tone="success" />
        <StatCard icon={<FileCheck2 className="h-5 w-5" />} label="Pending KYC" value="6" tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Live feed across the platform</CardDescription></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {activity.map(a => (
                <li key={a.id} className="flex items-start gap-3 py-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-between" onClick={() => toast.success("Opening KYC queue")}>
              Approve KYC <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => toast("Agent form opened")}>
              Add Agent <UserPlus className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => toast("Ledger ready")}>
              View Ledger <BookOpen className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------- AGENT MANAGEMENT ----------------
export function AgentManagement() {
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [selected, setSelected] = useState<typeof agents[number] | null>(null);

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
        <Button className="ml-auto" onClick={() => toast("New agent form opened")}>
          <UserPlus className="h-4 w-4 mr-2" /> Add Agent
        </Button>
      </div>

      <DataTable
        rows={filtered}
        columns={[
          { key: "name", header: "Business Name", render: r => (
            <button onClick={() => setSelected(r)} className="text-left font-medium hover:text-primary">{r.name}<p className="text-xs text-muted-foreground">{r.id}</p></button>
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

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>Agent ID {selected.id} · {selected.type}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Business Info</CardTitle></CardHeader><CardContent className="text-sm space-y-1.5">
                  <Row label="GST" value={selected.gst} />
                  <Row label="PAN" value={selected.pan} />
                  <Row label="Email" value={selected.email} />
                  <Row label="Phone" value={selected.phone} />
                  <Row label="City" value={selected.city} />
                </CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm">KYC Documents</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
                  {["Trade License", "GST Certificate", "PAN Card", "Bank Details"].map(d => (
                    <div key={d} className="flex items-center justify-between">
                      <span>{d}</span>
                      <div className="flex gap-1.5">
                        <StatusBadge status={selected.status === "Pending KYC" ? "Pending" : "Approved"} />
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => toast.success(`${d} approved`)}><CheckCircle2 className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => toast.error(`${d} rejected`)}><XCircle className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Hierarchy</CardTitle></CardHeader><CardContent className="text-sm">
                  {agents.filter(a => a.parent === selected.id).length > 0 ? (
                    <ul className="space-y-1.5">
                      {agents.filter(a => a.parent === selected.id).map(s => (
                        <li key={s.id} className="flex justify-between"><span>↳ {s.name}</span><span className="text-muted-foreground">{fmtINR(s.walletBalance)}</span></li>
                      ))}
                    </ul>
                  ) : <p className="text-muted-foreground">No sub-agents</p>}
                </CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Wallet & Markup</CardTitle></CardHeader><CardContent className="text-sm space-y-1.5">
                  <Row label="Balance" value={fmtINR(selected.walletBalance)} />
                  <Row label="Credit Limit" value={fmtINR(selected.creditLimit)} />
                  <Row label="Default Markup" value="3.5% Flight · 4% Hotel" />
                  <Row label="Commission Tier" value="Standard" />
                </CardContent></Card>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button onClick={() => { toast.success("Settings updated"); setSelected(null); }}>Save Changes</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{label}</span><span className="font-medium text-right">{value}</span></div>;
}

// ---------------- KYC QUEUE ----------------
export function KycQueue() {
  const pending = agents.filter(a => a.status === "Pending KYC");
  const reviewed = agents.filter(a => a.status !== "Pending KYC").slice(0, 4);

  const KycCard = ({ a, isReviewed }: { a: typeof agents[number]; isReviewed?: boolean }) => (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{a.name}</p>
            <p className="text-xs text-muted-foreground">Submitted {a.joined} · {a.city}</p>
          </div>
          {isReviewed && <StatusBadge status={a.status === "Active" ? "Approved" : "Rejected"} />}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["Trade License", "GST Certificate", "PAN Card", "Bank Details"].map(d => (
            <div key={d} className="flex items-center justify-between rounded-md border px-3 py-2">
              <span className="text-muted-foreground text-xs">{d}</span>
              <StatusBadge status={isReviewed ? (a.status === "Active" ? "Approved" : "Rejected") : "Pending"} />
            </div>
          ))}
        </div>
        {!isReviewed && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" className="flex-1" onClick={() => toast.success(`KYC approved for ${a.name}`)}>
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Approve All
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.error(`KYC rejected for ${a.name}`)}>
              <XCircle className="h-4 w-4 mr-1.5" /> Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">Pending <span className="ml-1.5 rounded-full bg-warning-soft text-warning-foreground text-xs px-1.5">{pending.length}</span></TabsTrigger>
        <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
      </TabsList>
      <TabsContent value="pending" className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {pending.map(a => <KycCard key={a.id} a={a} />)}
      </TabsContent>
      <TabsContent value="reviewed" className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {reviewed.map(a => <KycCard key={a.id} a={a} isReviewed />)}
      </TabsContent>
    </Tabs>
  );
}

// ---------------- HIERARCHY ----------------
export function Hierarchy() {
  const masters = agents.filter(a => a.type === "Master");
  const agentBookings = (id: string) => bookings.filter(b => b.agentId === id).length;

  const Node = ({ a, level = 0 }: { a: typeof agents[number]; level?: number }) => {
    const children = agents.filter(c => c.parent === a.id);
    const [open, setOpen] = useState(true);
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
            <p className="font-medium">{agentBookings(a.id)} bookings</p>
            <p className="text-xs text-muted-foreground">{fmtINR(a.walletBalance)}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success(`Sub-agent form for ${a.name}`)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Sub-Agent
          </Button>
        </div>
        {open && children.map(c => <Node key={c.id} a={c} level={level + 1} />)}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader><CardTitle>Agent Hierarchy</CardTitle><CardDescription>Master → Agent → Sub-Agent</CardDescription></CardHeader>
      <CardContent>
        {masters.map(m => <Node key={m.id} a={m} />)}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Independent agents (no master)</p>
          {agents.filter(a => a.type === "Agent" && !a.parent).map(m => <Node key={m.id} a={m} />)}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------- MARKUP & COMMISSION ----------------
export function MarkupCommission() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Markup Rules</CardTitle><CardDescription>Platform-level markup applied on net supplier prices</CardDescription></div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" /> Add Rule</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Markup Rule</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
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

// ---------------- WALLET & LEDGER ----------------
export function WalletLedger() {
  const [open, setOpen] = useState<typeof agents[number] | null>(null);
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

// ---------------- SUPPLIERS ----------------
export function SupplierConfig() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {suppliers.map(s => (
        <Card key={s.name}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div><CardTitle>{s.name}</CardTitle><CardDescription>{s.category}</CardDescription></div>
              <StatusBadge status={s.connected ? "Connected" : "Disconnected"} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">API Key</Label>
              <Input value={s.key} readOnly className="font-mono text-xs mt-1" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Tier Access</p>
              {["Master Agents", "Agents", "Sub-Agents"].map((tier, i) => (
                <div key={tier} className="flex items-center justify-between text-sm">
                  <span>{tier}</span>
                  <Switch defaultChecked={i < 2} onCheckedChange={(v) => toast(`${tier} ${v ? "enabled" : "disabled"} for ${s.name}`)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------------- REPORTS ----------------
export function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => toast.success("CSV export started")}><Download className="h-4 w-4 mr-1.5" /> Export CSV</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Booking Volume (Last 5 Weeks)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="bookings" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue by Supplier</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie data={revenueBySupplier} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {revenueBySupplier.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmtINR(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </RPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 text-sm">
              {revenueBySupplier.map((r, i) => (
                <div key={r.name} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded" style={{ background: CHART_COLORS[i] }} />{r.name}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Top 5 Agents by Bookings</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            pageSize={5}
            rows={topRoutes}
            columns={[
              { key: "route", header: "Route", render: r => <span className="font-medium">{r.route}</span> },
              { key: "count", header: "Bookings", render: r => r.count },
              { key: "rev", header: "Revenue", render: r => fmtINR(r.revenue) },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
