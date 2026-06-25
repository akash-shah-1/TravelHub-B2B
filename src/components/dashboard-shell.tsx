import type { ReactNode } from "react";
import { useRole } from "@/lib/role-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, FileCheck2, Network, Percent, Wallet, Plug, BarChart3,
  Search, BookOpen, Building2, Settings2, Receipt, PieChart, Compass,
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
  const roleLabel = role === "admin" ? "Admin Console" : "Agent Portal";
  const workspace = role === "admin" ? "Travel-Hub HQ" : "Demo Co. Travels";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold text-sidebar shadow-sm">
            <Compass className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-base font-bold leading-tight tracking-tight">Travel-Hub</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/60 mt-0.5">{roleLabel}</p>
          </div>
        </div>

        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">Workspace</p>
          <p className="mt-1 text-sm font-medium text-sidebar-foreground/90 truncate">{workspace}</p>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "group relative w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors text-left",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <span className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r-full transition-all",
                  active ? "bg-gold" : "bg-transparent",
                )} />
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-[11px] text-sidebar-foreground/55">Travel-Hub B2B · v1.0</p>
          <p className="text-[11px] text-sidebar-foreground/40 mt-0.5">Demo environment</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
          <div className="flex items-center justify-between gap-6 px-8 lg:px-10 py-6 pr-56">
            <div className="min-w-0">
              <h1 className="font-serif text-2xl lg:text-[26px] font-bold tracking-tight text-foreground truncate">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
        </header>
        <div className="flex-1 px-8 lg:px-10 py-8 max-w-[1440px] w-full">{children}</div>
      </main>
    </div>
  );
}
