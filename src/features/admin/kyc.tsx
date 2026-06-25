import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { agents, type Agent } from "@/lib/mock-data";
import { CheckCircle2, XCircle } from "lucide-react";

function KycCard({ a, isReviewed }: { a: Agent; isReviewed?: boolean }) {
  return (
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
}

export function KycQueue() {
  const pending = agents.filter(a => a.status === "Pending KYC");
  const reviewed = agents.filter(a => a.status !== "Pending KYC").slice(0, 4);
  return (
    <Tabs defaultValue="pending">
      <TabsList>
        <TabsTrigger value="pending">
          Pending <span className="ml-1.5 rounded-full bg-warning-soft text-warning-foreground text-xs px-1.5">{pending.length}</span>
        </TabsTrigger>
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
