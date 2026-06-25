import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  icon, label, value, delta, tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const toneMap = {
    default: "bg-accent text-accent-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
    info: "bg-info-soft text-info",
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneMap[tone])}>
            {icon}
          </div>
          {delta && <span className="text-xs font-medium text-success">{delta}</span>}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
