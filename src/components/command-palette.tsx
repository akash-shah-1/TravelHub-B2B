import { useEffect, useState } from "react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator,
} from "@/components/ui/command";
import { useRole } from "@/lib/role-context";
import {
  LayoutDashboard, Users, FileCheck2, Network, Percent, Wallet, Plug, BarChart3,
  Search, BookOpen, Building2, Settings2, Receipt, PieChart, RefreshCw,
} from "lucide-react";

const adminItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "agents", label: "Agent Management", icon: Users },
  { id: "kyc", label: "KYC & Verification", icon: FileCheck2 },
  { id: "hierarchy", label: "Agent Hierarchy", icon: Network },
  { id: "markup", label: "Markup & Commission", icon: Percent },
  { id: "wallet", label: "Wallet & Ledger", icon: Wallet },
  { id: "suppliers", label: "Supplier Config", icon: Plug },
  { id: "reports", label: "Reports", icon: BarChart3 },
];

const agentItems = [
  { id: "dashboard", label: "My Dashboard", icon: LayoutDashboard },
  { id: "search", label: "Search & Book", icon: Search },
  { id: "bookings", label: "My Bookings", icon: BookOpen },
  { id: "sub-agents", label: "My Sub-Agents", icon: Building2 },
  { id: "markup", label: "Markup Settings", icon: Settings2 },
  { id: "wallet", label: "My Wallet", icon: Wallet },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "reports", label: "Reports", icon: PieChart },
];

export function CommandPalette() {
  const { role, setRole, setSection } = useRole();
  const [open, setOpen] = useState(false);
  const items = role === "admin" ? adminItems : agentItems;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search sections, agents, actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading={role === "admin" ? "Admin sections" : "Agent sections"}>
          {items.map(i => {
            const Icon = i.icon;
            return (
              <CommandItem key={i.id} onSelect={() => { setSection(i.id); setOpen(false); }}>
                <Icon className="h-4 w-4 mr-2" /> {i.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Switch role">
          <CommandItem onSelect={() => { setRole(role === "admin" ? "agent" : "admin"); setOpen(false); }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Switch to {role === "admin" ? "Agent Portal" : "Admin Console"}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
