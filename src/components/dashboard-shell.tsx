import type { ReactNode } from "react";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, FileCheck2, Network, Percent, Wallet, Plug, BarChart3,
  Search, BookOpen, Building2, Settings2, Receipt, PieChart, Plane,
} from "lucide-react";

const adminNav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "agents", label: "Agent Management", icon: Users },
  { id: "kyc", label: "KYC & Verification", icon: FileCheck2 },
  { id: "hierarchy", label: "Agent Hierarchy", icon: Network },
  { id: "markup", label: "Markup & Commission", icon: Percent },
  { id: "wallet", label: "Wallet & Ledger", icon: Wallet },
  { id: "suppliers", label: "Supplier Config", icon: Plug },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

const agentNav = [
  { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { id: "search", label: "Search & Book", icon: Search },
  { id: "bookings", label: "My Bookings", icon: BookOpen },
  { id: "sub-agents", label: "My Sub-Agents", icon: Building2 },
  { id: "markup", label: "Markup Settings", icon: Settings2 },
  { id: "wallet", label: "My Wallet", icon: Wallet },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "reports", label: "Reports", icon: PieChart },
];

export function DashboardShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const { role, section, setSection } = useRole();
  const nav = role === "admin" ? adminNav : agentNav;
  const brandLabel = role === "admin" ? "Wanderlink B2B · Admin Console" : "Demo Co. Travels · Agent Portal";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2 px-5 py-5 border-b">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Wanderlink</p>
            <p className="text-[11px] text-muted-foreground">{role === "admin" ? "Admin Console" : "Agent Portal"}</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-left",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </nav>
        <div className="border-t p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground/80">{brandLabel}</p>
          <p className="mt-1">v1.0 · Demo build</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
          <div className="flex items-center justify-between px-6 lg:px-8 py-5">
            <div className="pr-44">
              <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </header>
        <div className="p-6 lg:p-8 max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
