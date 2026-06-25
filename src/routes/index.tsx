import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RoleProvider, useRole } from "@/lib/role-context";
import { RoleSwitcher } from "@/components/role-switcher";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  AdminOverview, AgentManagement, KycQueue, Hierarchy,
  MarkupCommission, WalletLedger, SupplierConfig, AdminReports,
} from "@/features/admin-sections";
import {
  AgentDashboard, SearchBook, MyBookings, SubAgents,
  AgentMarkup, AgentWallet, Invoices, AgentReports,
} from "@/features/agent-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wanderlink B2B · Travel Platform" },
      { name: "description", content: "B2B travel distribution platform with super admin and agent dashboards." },
      { property: "og:title", content: "Wanderlink B2B · Travel Platform" },
      { property: "og:description", content: "B2B travel distribution platform with super admin and agent dashboards." },
    ],
  }),
  component: Index,
});

const adminMap: Record<string, { title: string; subtitle: string; render: () => ReactNode }> = {
  overview: { title: "Platform Overview", subtitle: "Live snapshot of agents, bookings and revenue", render: () => <AdminOverview /> },
  agents: { title: "Agent Management", subtitle: "All registered businesses on the platform", render: () => <AgentManagement /> },
  kyc: { title: "KYC & Verification Queue", subtitle: "Review and approve submitted documents", render: () => <KycQueue /> },
  hierarchy: { title: "Agent Hierarchy", subtitle: "Master · Agent · Sub-Agent relationships", render: () => <Hierarchy /> },
  markup: { title: "Markup & Commission Engine", subtitle: "Pricing rules and supplier splits", render: () => <MarkupCommission /> },
  wallet: { title: "Wallet & Ledger", subtitle: "Per-agent wallets and platform-level settlement", render: () => <WalletLedger /> },
  suppliers: { title: "Supplier Configuration", subtitle: "Connected GDS and inventory providers", render: () => <SupplierConfig /> },
  reports: { title: "Reports", subtitle: "Booking volume, revenue and route insights", render: () => <AdminReports /> },
};

const agentMap: Record<string, { title: string; subtitle: string; render: () => ReactNode }> = {
  dashboard: { title: "My Dashboard", subtitle: "Welcome back, Demo Co. Travels", render: () => <AgentDashboard /> },
  search: { title: "Search & Book", subtitle: "Live inventory from connected suppliers", render: () => <SearchBook /> },
  bookings: { title: "My Bookings", subtitle: "All PNRs issued under your account", render: () => <MyBookings /> },
  "sub-agents": { title: "My Sub-Agents", subtitle: "Businesses operating under you", render: () => <SubAgents /> },
  markup: { title: "Markup Settings", subtitle: "Your customer-facing pricing rules", render: () => <AgentMarkup /> },
  wallet: { title: "My Wallet", subtitle: "Balance, top-ups and commission earnings", render: () => <AgentWallet /> },
  invoices: { title: "Invoices", subtitle: "Platform invoices and your customer billing", render: () => <Invoices /> },
  reports: { title: "Reports", subtitle: "Revenue trends, profit mix and top routes", render: () => <AgentReports /> },
};

function Inner() {
  const { role, section } = useRole();
  const map = role === "admin" ? adminMap : agentMap;
  const entry = map[section] ?? Object.values(map)[0];
  return (
    <DashboardShell title={entry.title} subtitle={entry.subtitle}>
      <div key={`${role}-${section}`} className="animate-in fade-in duration-200">
        {entry.render()}
      </div>
    </DashboardShell>
  );
}

function Index() {
  return (
    <RoleProvider>
      <RoleSwitcher />
      <Inner />
    </RoleProvider>
  );
}
