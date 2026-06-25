import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { useRole } from "@/lib/role-context";
import { bookings, fmtINR } from "@/lib/mock-data";
import { profit } from "@/lib/booking-utils";
import { Wallet, BookOpen, TrendingUp, Coins, Plane, Hotel, Plus } from "lucide-react";

export function AgentDashboard() {
  const { setSection } = useRole();
  const myBookings = bookings.filter(b => b.agentId === "AGT001");
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
