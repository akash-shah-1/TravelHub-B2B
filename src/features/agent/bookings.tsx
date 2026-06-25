import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { Row } from "@/features/shared/row";
import { bookings, fmtINR, type Booking } from "@/lib/mock-data";
import { profit, cancellationPenalty, refundAmount } from "@/lib/booking-utils";
import { MoreHorizontal } from "lucide-react";

export function MyBookings() {
  const myBookings = bookings.filter(b => b.agentId === "AGT001");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [cancel, setCancel] = useState<Booking | null>(null);
  const [view, setView] = useState<Booking | null>(null);

  const rows = myBookings.filter(b =>
    (type === "all" || b.type === type) && (status === "all" || b.status === status),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Input type="date" defaultValue="2026-06-01" className="w-44" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Flight">Flight</SelectItem><SelectItem value="Hotel">Hotel</SelectItem></SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="Confirmed">Confirmed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem><SelectItem value="Amended">Amended</SelectItem></SelectContent>
        </Select>
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "pnr", header: "PNR", render: r => <button onClick={() => setView(r)} className="font-mono text-xs hover:text-primary">{r.pnr}</button> },
          { key: "type", header: "Type", render: r => r.type },
          { key: "customer", header: "Customer", render: r => r.customer },
          { key: "date", header: "Travel Date", render: r => r.travelDate },
          { key: "sell", header: "Sell", render: r => fmtINR(r.sellPrice) },
          { key: "net", header: "Net", render: r => <span className="text-muted-foreground">{fmtINR(r.netPrice)}</span> },
          { key: "profit", header: "Profit", render: r => <span className="text-success font-medium">+{fmtINR(profit(r))}</span> },
          { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
          { key: "act", header: "", render: r => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setView(r)}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCancel(r)}>Cancel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success(`Amendment opened · ${r.pnr}`)}>Amend</DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Invoice downloaded")}>Download Invoice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )},
        ]}
      />

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking {view?.pnr}</DialogTitle>
            <DialogDescription>{view?.type} · {view?.route}</DialogDescription>
          </DialogHeader>
          {view && (
            <Card className="p-4 space-y-2 text-sm">
              <Row label="Customer" value={view.customer} />
              <Row label="Travel Date" value={view.travelDate} />
              <Row label="Net Price" value={fmtINR(view.netPrice)} />
              <Row label="Sell Price" value={fmtINR(view.sellPrice)} />
              <Row label="Your Profit" value={<span className="text-success">{fmtINR(profit(view))}</span>} />
              <Row label="Status" value={<StatusBadge status={view.status} />} />
            </Card>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setView(null)}>Close</Button>
            <Button onClick={() => toast.success("E-voucher downloaded")}>Download Voucher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!cancel} onOpenChange={(o) => !o && setCancel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel Booking</DialogTitle><DialogDescription>{cancel?.pnr} · {cancel?.route}</DialogDescription></DialogHeader>
          {cancel && (
            <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
              <div className="flex justify-between"><span>Original Sell Price</span><span>{fmtINR(cancel.sellPrice)}</span></div>
              <div className="flex justify-between"><span>Cancellation Penalty</span><span className="text-destructive">- {fmtINR(cancellationPenalty(cancel.sellPrice))}</span></div>
              <div className="flex justify-between font-medium pt-1 border-t"><span>Refund to Customer</span><span className="text-success">{fmtINR(refundAmount(cancel.sellPrice))}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancel(null)}>Keep Booking</Button>
            <Button variant="destructive" onClick={() => { toast.success(`${cancel?.pnr} cancelled`); setCancel(null); }}>Confirm Cancellation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
