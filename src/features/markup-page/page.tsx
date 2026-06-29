import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MarkupWorkspace } from "./workspace";

export function FlightMarkupPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-card border-b border-border shadow-sm">
        <div className="max-w-[1480px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
            <span className="text-border">|</span>
            <div className="h-8 w-8 rounded-md bg-primary grid place-items-center text-primary-foreground text-sm font-bold">TH</div>
            <span className="text-sm font-semibold text-foreground">Super Admin Panel</span>
          </div>
          <h1 className="text-base font-semibold text-primary font-serif">Flight Markup Rules</h1>
          <div className="text-xs text-muted-foreground">admin@travel-hub.in</div>
        </div>
      </header>
      <main className="max-w-[1480px] mx-auto px-6 py-6">
        <MarkupWorkspace stickyTopClass="top-20" />
      </main>
    </div>
  );
}
