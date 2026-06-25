import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { bookingVolume, revenueBySupplier, topRoutes, fmtINR } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RPieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { Download } from "lucide-react";

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

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
        <CardHeader><CardTitle>Top Routes</CardTitle></CardHeader>
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
