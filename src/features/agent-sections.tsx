import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { useRole } from "@/lib/role-context";
import {
  bookings, agents, flightResults, agentMarkupRules, walletTxns, invoices,
  agentMonthlyRevenue, agentProfitBreakdown, topRoutes, fmtINR,
} from "@/lib/mock-data";
import {
  Wallet, BookOpen, TrendingUp, Coins, Search, Plus, Plane, MapPin,
  MoreHorizontal, Download, Hotel, ArrowRight, CheckCircle2, Edit2,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const myBookings = bookings.filter(b => b.agentId === "AGT001");
const profit = (b: { sellPrice: number; netPrice: number }) => b.sellPrice - b.netPrice;

// ---------------- DASHBOARD ----------------
export function AgentDashboard() {
  const { setSection } = useRole();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Wallet className="h-5 w-5" />} label="Wallet Balance" value={fmtINR(234500)} tone="info" />
        <StatCard icon={<BookOpen className="h-5 w-5" />} label="Bookings This Month" value="34" delta="+12%" tone="default" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Markup Earnings (MTD)" value={fmtINR(29100)} delta="+18%" tone="success" />
        <StatCard icon={<Coins className="h-5 w-5" />} label="Commission Pending" value={fmtINR(6200)} tone="warning" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Recent Bookings</CardTitle><CardDescription>Last 5 confirmed transactions</CardDescription></div>
          <Button variant="outline" size="sm" onClick={() => setSection("bookings")}>View all</Button>
        </CardHeader>
        <CardContent>
          <DataTable
            pageSize={5}
            rows={myBookings.slice(0, 5)}
            columns={[
              { key: "pnr", header: "PNR", render: r => <span className="font-mono text-xs">{r.pnr}</span> },
              { key: "route", header: "Route", render: r => r.route },
              { key: "customer", header: "Customer", render: r => r.customer },
              { key: "sell", header: "Sell", render: r => fmtINR(r.sellPrice) },
              { key: "net", header: "Net", render: r => <span className="text-muted-foreground">{fmtINR(r.netPrice)}</span> },
              { key: "profit", header: "Profit", render: r => <span className="text-success font-medium">+{fmtINR(profit(r))}</span> },
              { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-4 flex-col gap-1.5" onClick={() => setSection("search")}><Plane className="h-5 w-5" /> Search Flights</Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1.5" onClick={() => setSection("search")}><Hotel className="h-5 w-5" /> Search Hotels</Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1.5" onClick={() => setSection("sub-agents")}><Plus className="h-5 w-5" /> Add Sub-Agent</Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1.5" onClick={() => setSection("wallet")}><Wallet className="h-5 w-5" /> Top Up Wallet</Button>
      </div>
    </div>
  );
}

// ---------------- SEARCH & BOOK ----------------
export function SearchBook() {
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState<typeof flightResults[number] | null>(null);
  const [confirmed, setConfirmed] = useState<{ pnr: string; f: typeof flightResults[number] } | null>(null);
  const markupPct = 4;

  const sellFor = (net: number) => Math.round(net * (1 + markupPct / 100));

  return (
    <div className="space-y-5">
      <Tabs defaultValue="flights">
        <TabsList>
          <TabsTrigger value="flights"><Plane className="h-4 w-4 mr-1.5" />Flights</TabsTrigger>
          <TabsTrigger value="hotels"><Hotel className="h-4 w-4 mr-1.5" />Hotels</TabsTrigger>
        </TabsList>
        <TabsContent value="flights" className="mt-4 space-y-5">
          <Card><CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div><Label>From</Label><Select defaultValue="DEL"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["DEL", "BOM", "BLR", "HYD", "CCU", "MAA"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select></div>
              <div><Label>To</Label><Select defaultValue="BOM"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["DEL", "BOM", "BLR", "HYD", "CCU", "MAA"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select></div>
              <div><Label>Date</Label><Input type="date" defaultValue="2026-07-15" /></div>
              <div><Label>Passengers</Label><Input type="number" defaultValue="2" min="1" /></div>
              <div><Label>Class</Label><Select defaultValue="Economy"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Economy">Economy</SelectItem><SelectItem value="Premium">Premium Economy</SelectItem><SelectItem value="Business">Business</SelectItem></SelectContent>
              </Select></div>
            </div>
            <Button className="mt-4" onClick={() => { setSearched(true); toast("Showing 5 results from 3 suppliers"); }}>
              <Search className="h-4 w-4 mr-1.5" /> Search Flights
            </Button>
          </CardContent></Card>

          {searched && (
            <div className="space-y-3">
              {flightResults.map(f => {
                const sell = sellFor(f.net);
                return (
                  <Card key={f.id}>
                    <CardContent className="p-5 flex flex-wrap items-center gap-5">
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="h-11 w-11 rounded-md bg-accent flex items-center justify-center text-accent-foreground font-semibold text-xs">
                          {f.airline.split(" ").map(w => w[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{f.airline}</p>
                          <p className="text-xs text-muted-foreground">{f.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center"><p className="font-semibold">{f.dep}</p><p className="text-xs text-muted-foreground">{f.from}</p></div>
                        <div className="text-center min-w-[110px]"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><Plane className="h-3 w-3" /><span className="h-px flex-1 bg-border" /></div><p className="text-xs mt-1">{f.duration} · {f.stops}</p></div>
                        <div className="text-center"><p className="font-semibold">{f.arr}</p><p className="text-xs text-muted-foreground">{f.to}</p></div>
                      </div>
                      <div className="ml-auto flex items-center gap-5">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground line-through">{fmtINR(f.net)}</p>
                          <p className="text-xl font-semibold tracking-tight">{fmtINR(sell)}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-success-soft text-success text-xs font-medium">+{fmtINR(sell - f.net)} profit</span>
                        </div>
                        <Button onClick={() => setBooking(f)}>Book Now <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        <TabsContent value="hotels" className="mt-4">
          <Card><CardContent className="p-10 text-center text-muted-foreground">
            <Hotel className="h-10 w-10 mx-auto mb-3 opacity-50" />
            Hotel search uses the same flow — same markup, same instant booking. Pick a city above to explore inventory.
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!booking} onOpenChange={(o) => !o && setBooking(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Passenger Details</DialogTitle><DialogDescription>{booking?.airline} · {booking?.from} → {booking?.to} · {booking?.dep}</DialogDescription></DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><Select defaultValue="Mr"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Mr">Mr</SelectItem><SelectItem value="Ms">Ms</SelectItem><SelectItem value="Mrs">Mrs</SelectItem></SelectContent>
              </Select></div>
              <div><Label>Full Name</Label><Input defaultValue="Rohan Mehta" /></div>
              <div><Label>DOB</Label><Input type="date" defaultValue="1988-05-12" /></div>
              <div><Label>Passport / ID</Label><Input defaultValue="P9982231" /></div>
              <div><Label>Email</Label><Input defaultValue="rohan@email.com" /></div>
              <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
            </div>
            {booking && (
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>Net Price</span><span>{fmtINR(booking.net)}</span></div>
                <div className="flex justify-between"><span>Your Markup (4%)</span><span className="text-success">+{fmtINR(sellFor(booking.net) - booking.net)}</span></div>
                <div className="flex justify-between font-medium pt-1 border-t"><span>Customer Pays</span><span>{fmtINR(sellFor(booking.net))}</span></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBooking(null)}>Cancel</Button>
            <Button onClick={() => {
              const pnr = "PNR" + Math.random().toString(36).slice(2, 9).toUpperCase();
              setConfirmed({ pnr, f: booking! });
              setBooking(null);
              toast.success(`Booking confirmed · ${pnr}`);
            }}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmed} onOpenChange={(o) => !o && setConfirmed(null)}>
        <DialogContent>
          <div className="text-center py-3 space-y-2">
            <div className="mx-auto h-14 w-14 rounded-full bg-success-soft flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Booking Confirmed</h3>
            <p className="text-sm text-muted-foreground">Your PNR has been generated and the e-ticket is ready.</p>
          </div>
          {confirmed && (
            <div className="rounded-lg border p-4 space-y-2 text-sm">
              <Row label="PNR" value={confirmed.pnr} />
              <Row label="Flight" value={`${confirmed.f.airline} · ${confirmed.f.code}`} />
              <Row label="Route" value={`${confirmed.f.from} → ${confirmed.f.to}`} />
              <Row label="Departure" value={confirmed.f.dep} />
              <Row label="Customer Pays" value={fmtINR(sellFor(confirmed.f.net))} />
              <Row label="Your Profit" value={fmtINR(sellFor(confirmed.f.net) - confirmed.f.net)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmed(null)}>Close</Button>
            <Button onClick={() => { toast.success("E-ticket downloaded"); }}><Download className="h-4 w-4 mr-1.5" /> Download E-Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}

// ---------------- MY BOOKINGS ----------------
export function MyBookings() {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [cancel, setCancel] = useState<typeof myBookings[number] | null>(null);
  const rows = myBookings.filter(b =>
    (type === "all" || b.type === type) && (status === "all" || b.status === status),
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Input type="date" defaultValue="2026-06-01" className="w-44" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Flight">Flight</SelectItem><SelectItem value="Hotel">Hotel</SelectItem></SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="Confirmed">Confirmed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem><SelectItem value="Amended">Amended</SelectItem></SelectContent>
        </Select>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "pnr", header: "PNR", render: r => <span className="font-mono text-xs">{r.pnr}</span> },
          { key: "type", header: "Type", render: r => r.type },
          { key: "customer", header: "Customer", render: r => r.customer },
          { key: "date", header: "Travel Date", render: r => r.travelDate },
          { key: "sell", header: "Sell", render: r => fmtINR(r.sellPrice) },
          { key: "net", header: "Net", render: r => <span className="text-muted-foreground">{fmtINR(r.netPrice)}</span> },
          { key: "profit", header: "Profit", render: r => <span className="text-success font-medium">+{fmtINR(profit(r))}</span> },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
          { key: "act", header: "", render: r => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toast(`Opening ${r.pnr}`)}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCancel(r)}>Cancel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success(`Amendment opened · ${r.pnr}`)}>Amend</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Invoice downloaded")}>Download Invoice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )},
        ]}
      />
      <Dialog open={!!cancel} onOpenChange={(o) => !o && setCancel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel Booking</DialogTitle><DialogDescription>{cancel?.pnr} · {cancel?.route}</DialogDescription></DialogHeader>
          {cancel && (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
              <div className="flex justify-between"><span>Original Sell Price</span><span>{fmtINR(cancel.sellPrice)}</span></div>
              <div className="flex justify-between"><span>Cancellation Penalty</span><span className="text-destructive">- {fmtINR(Math.round(cancel.sellPrice * 0.25))}</span></div>
              <div className="flex justify-between font-medium pt-1 border-t"><span>Refund to Customer</span><span className="text-success">{fmtINR(Math.round(cancel.sellPrice * 0.75))}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancel(null)}>Keep Booking</Button>
            <Button variant="destructive" onClick={() => { toast.success(`${cancel?.pnr} cancelled`); setCancel(null); }}>Confirm Cancellation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------- SUB AGENTS ----------------
export function SubAgents() {
  const subs = agents.filter(a => a.parent === "AGT001");
  const [open, setOpen] = useState(false);
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
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Credit Limit (₹)</Label><Input type="number" placeholder="50000" /></div>
                <div><Label>Markup Override (%)</Label><Input type="number" placeholder="Optional" /></div>
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
          { key: "name", header: "Name", render: r => <span className="font-medium">{r.name}</span> },
          { key: "email", header: "Email", render: r => <span className="text-muted-foreground">{r.email}</span> },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
          { key: "bookings", header: "Bookings", render: r => Math.floor(Math.random() * 30 + 5) },
          { key: "wallet", header: "Wallet", render: r => fmtINR(r.walletBalance) },
          { key: "act", header: "", render: () => <Button size="sm" variant="ghost" onClick={() => toast("Opening sub-agent dashboard")}>View</Button> },
        ]}
      />
    </div>
  );
}

// ---------------- MARKUP ----------------
export function AgentMarkup() {
  const [rules, setRules] = useState(agentMarkupRules);
  const [editing, setEditing] = useState<string | null>(null);
  const [preview, setPreview] = useState(10000);
  const activeRule = rules[0];
  const customerPays = Math.round(preview * (1 + activeRule.value / 100));

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
          <Button variant="ghost" onClick={() => toast.success("New markup rule form opened")}><Plus className="h-4 w-4 mr-1.5" /> Add New Rule</Button>
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
    </div>
  );
}

// ---------------- WALLET ----------------
export function AgentWallet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
          <CardContent className="p-6">
            <p className="text-sm opacity-80">Current Wallet Balance</p>
            <p className="text-4xl font-semibold tracking-tight mt-1">{fmtINR(234500)}</p>
            <p className="text-xs opacity-80 mt-2">Credit limit: {fmtINR(500000)} · Available: {fmtINR(500000 - 234500 + 234500)}</p>
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
              <Button variant="ghost" className="text-primary-foreground hover:bg-white/10">View Statement</Button>
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
    </div>
  );
}

// ---------------- INVOICES ----------------
export function Invoices() {
  return (
    <Tabs defaultValue="received">
      <TabsList>
        <TabsTrigger value="received">Received from Platform</TabsTrigger>
        <TabsTrigger value="issued">Issued to Customers</TabsTrigger>
      </TabsList>
      <TabsContent value="received" className="mt-4">
        <DataTable
          rows={invoices}
          columns={[
            { key: "no", header: "Invoice No", render: r => <span className="font-mono text-xs">{r.no}</span> },
            { key: "pnr", header: "Booking PNR", render: r => <span className="font-mono text-xs">{r.pnr}</span> },
            { key: "date", header: "Date", render: r => r.date },
            { key: "amount", header: "Amount", render: r => fmtINR(r.amount) },
            { key: "gst", header: "GST", render: r => fmtINR(r.gst) },
            { key: "total", header: "Total", render: r => <span className="font-medium">{fmtINR(r.total)}</span> },
            { key: "act", header: "", render: () => <Button size="sm" variant="ghost" onClick={() => toast.success("Invoice downloaded")}><Download className="h-3.5 w-3.5" /></Button> },
          ]}
        />
      </TabsContent>
      <TabsContent value="issued" className="mt-4">
        <DataTable
          rows={invoices.map(i => ({ ...i, no: i.no.replace("INV", "DCT") }))}
          columns={[
            { key: "no", header: "Invoice No", render: r => <span className="font-mono text-xs">{r.no}</span> },
            { key: "pnr", header: "Booking PNR", render: r => <span className="font-mono text-xs">{r.pnr}</span> },
            { key: "date", header: "Date", render: r => r.date },
            { key: "amount", header: "Amount", render: r => fmtINR(r.amount) },
            { key: "gst", header: "GST", render: r => fmtINR(r.gst) },
            { key: "total", header: "Total", render: r => <span className="font-medium">{fmtINR(r.total)}</span> },
            { key: "act", header: "", render: () => <Button size="sm" variant="ghost" onClick={() => toast.success("Invoice downloaded")}><Download className="h-3.5 w-3.5" /></Button> },
          ]}
        />
      </TabsContent>
    </Tabs>
  );
}

// ---------------- REPORTS ----------------
export function AgentReports() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agentMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
                <Tooltip formatter={(v: number) => fmtINR(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Profit Breakdown</CardTitle><CardDescription>Markup vs Commission earnings</CardDescription></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentProfitBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
                <Tooltip formatter={(v: number) => fmtINR(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="markup" stackId="a" fill="var(--chart-1)" name="Markup" radius={[0, 0, 0, 0]} />
                <Bar dataKey="commission" stackId="a" fill="var(--chart-2)" name="Commission" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Top Routes Booked</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            rows={topRoutes}
            columns={[
              { key: "route", header: "Route", render: r => <span className="font-medium flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{r.route}</span> },
              { key: "count", header: "Bookings", render: r => r.count },
              { key: "rev", header: "Revenue", render: r => fmtINR(r.revenue) },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
