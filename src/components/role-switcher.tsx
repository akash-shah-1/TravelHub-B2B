import { useRole } from "@/lib/role-context";
import { ShieldCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  return (
    <div className="fixed top-4 right-6 z-50">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card/95 p-1 shadow-md backdrop-blur">
        <button
          onClick={() => setRole("admin")}
          className={cn(
            "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all",
            role === "admin"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Super Admin
        </button>
        <button
          onClick={() => setRole("agent")}
          className={cn(
            "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all",
            role === "agent"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Briefcase className="h-3.5 w-3.5" />
          Agent View
        </button>
      </div>
    </div>
  );
}
