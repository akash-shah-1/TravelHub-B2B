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
    default: "bg-accent text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning-foreground",
    info: "bg-info-soft text-info",
  };
  return (
    <Card className="relative overflow-hidden border-border/70 shadow-none hover:shadow-sm transition-shadow">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-primary-hover to-gold opacity-90" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", toneMap[tone])}>
            {icon}
          </div>
          {delta && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-success bg-success-soft px-2 py-1 rounded-md">
              {delta}
            </span>
          )}
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <p className="mt-1.5 font-serif text-[28px] leading-tight font-bold tracking-tight text-foreground tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}
