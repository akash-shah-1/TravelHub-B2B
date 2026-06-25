import { useRole } from "@/lib/role-context";
import { ShieldCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-1 rounded-full border bg-card/95 p-1 shadow-lg backdrop-blur">
        <button
          onClick={() => setRole("admin")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
            role === "admin"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ShieldCheck className="h-4 w-4" />
          Super Admin
        </button>
        <button
          onClick={() => setRole("agent")}
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
            role === "agent"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Briefcase className="h-4 w-4" />
          Agent (Demo Co.)
        </button>
      </div>
    </div>
  );
}
