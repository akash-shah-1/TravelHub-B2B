import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-success-soft text-success border-success/20",
    Confirmed: "bg-success-soft text-success border-success/20",
    Approved: "bg-success-soft text-success border-success/20",
    Connected: "bg-success-soft text-success border-success/20",
    Pending: "bg-warning-soft text-warning-foreground border-warning/30",
    "Pending KYC": "bg-warning-soft text-warning-foreground border-warning/30",
    Paused: "bg-muted text-muted-foreground border-border",
    Amended: "bg-info-soft text-info border-info/20",
    Suspended: "bg-destructive/10 text-destructive border-destructive/20",
    Rejected: "bg-destructive/10 text-destructive border-destructive/20",
    Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    Disconnected: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={cn("font-medium", map[status] ?? "bg-muted")}>
      {status}
    </Badge>
  );
}
