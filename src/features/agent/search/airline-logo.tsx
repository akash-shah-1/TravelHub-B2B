import { Plane } from "lucide-react";
import type { AirlineBrand } from "@/lib/search-data";
import { cn } from "@/lib/utils";

export function AirlineLogo({ brand, size = "md" }: { brand: AirlineBrand; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "h-9 w-9 text-[10px]" : size === "lg" ? "h-14 w-14 text-sm" : "h-11 w-11 text-xs";
  return (
    <div className={cn("relative shrink-0 rounded-lg flex items-center justify-center font-bold tracking-tight shadow-sm", dim, brand.bg, brand.fg)}>
      <Plane className="absolute opacity-15 h-6 w-6 -rotate-45" />
      <span className="relative">{brand.short}</span>
    </div>
  );
}
