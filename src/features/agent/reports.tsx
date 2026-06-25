import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { agentMonthlyRevenue, agentProfitBreakdown, topRoutes, fmtINR } from "@/lib/mock-data";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { MapPin } from "lucide-react";

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
                <Bar dataKey="markup" stackId="a" fill="var(--chart-1)" name="Markup" />
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
