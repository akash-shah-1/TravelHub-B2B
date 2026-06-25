import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { useRole } from "@/lib/role-context";
import { activity, fmtINR } from "@/lib/mock-data";
import { Users, Plane, Wallet, FileCheck2, UserPlus, BookOpen, ChevronRight } from "lucide-react";

export function AdminOverview() {
  const { setSection } = useRole();
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
            <Button className="w-full justify-between" onClick={() => { setSection("kyc"); toast.success("Opened KYC queue"); }}>
              Approve KYC <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => setSection("agents")}>
              Add Agent <UserPlus className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => setSection("wallet")}>
              View Ledger <BookOpen className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
