import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/data-table";
import { Row } from "@/features/shared/row";
import { invoices, fmtINR } from "@/lib/mock-data";
import { Download, Eye, Printer } from "lucide-react";

type Invoice = (typeof invoices)[number] & { party?: string };

export function Invoices() {
  const [preview, setPreview] = useState<Invoice | null>(null);
  const issued = invoices.map(i => ({ ...i, no: i.no.replace("INV", "DCT") }));

  const cols = (party: string) => [
    { key: "no", header: "Invoice No", render: (r: Invoice) => <span className="font-mono text-xs">{r.no}</span> },
    { key: "pnr", header: "Booking PNR", render: (r: Invoice) => <span className="font-mono text-xs">{r.pnr}</span> },
    { key: "date", header: "Date", render: (r: Invoice) => r.date },
    { key: "amount", header: "Amount", render: (r: Invoice) => fmtINR(r.amount) },
    { key: "gst", header: "GST", render: (r: Invoice) => fmtINR(r.gst) },
    { key: "total", header: "Total", render: (r: Invoice) => <span className="font-medium">{fmtINR(r.total)}</span> },
    { key: "act", header: "", render: (r: Invoice) => (
      <div className="flex gap-1 justify-end">
        <Button size="sm" variant="ghost" onClick={() => setPreview({ ...r, party })}><Eye className="h-3.5 w-3.5" /></Button>
        <Button size="sm" variant="ghost" onClick={() => toast.success("Invoice downloaded")}><Download className="h-3.5 w-3.5" /></Button>
      </div>
    )},
  ];

  return (
    <>
      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">Received from Platform</TabsTrigger>
          <TabsTrigger value="issued">Issued to Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="received" className="mt-4">
          <DataTable rows={invoices} columns={cols("Travel-Hub Platform")} />
        </TabsContent>
        <TabsContent value="issued" className="mt-4">
          <DataTable rows={issued} columns={cols("Demo Co. Travels")} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">Tax Invoice</DialogTitle>
                <DialogDescription>{preview.no} · {preview.date}</DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-card p-6 space-y-5">
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <p className="font-serif text-xl font-bold">Travel-Hub</p>
                    <p className="text-xs text-muted-foreground mt-1">B2B Travel Distribution Platform</p>
                    <p className="text-xs text-muted-foreground">GST 27AAACT1234H1Z5 · Mumbai, IN</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Invoice</p>
                    <p className="font-mono text-sm font-medium">{preview.no}</p>
                    <p className="text-xs text-muted-foreground mt-1">{preview.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Billed to</p>
                    <p className="font-medium">{preview.party ?? "Demo Co. Travels"}</p>
                    <p className="text-xs text-muted-foreground">GST 27AABCD1234E1Z5</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Booking reference</p>
                    <p className="font-mono text-sm">{preview.pnr}</p>
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-7">Description</div>
                    <div className="col-span-2 text-right">HSN</div>
                    <div className="col-span-3 text-right">Amount</div>
                  </div>
                  <div className="grid grid-cols-12 px-4 py-3 text-sm border-t">
                    <div className="col-span-7">Travel booking services · {preview.pnr}</div>
                    <div className="col-span-2 text-right text-muted-foreground">998551</div>
                    <div className="col-span-3 text-right">{fmtINR(preview.amount)}</div>
                  </div>
                </div>

                <div className="ml-auto w-64 space-y-1.5 text-sm">
                  <Row label="Subtotal" value={fmtINR(preview.amount)} />
                  <Row label="GST (5%)" value={fmtINR(preview.gst)} />
                  <div className="border-t pt-2">
                    <Row label="Total payable" value={<span className="font-serif text-lg font-bold">{fmtINR(preview.total)}</span>} />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground border-t pt-3">This is a system-generated invoice and does not require a signature.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPreview(null)}>Close</Button>
                <Button variant="outline" onClick={() => toast.success("Sent to printer")}><Printer className="h-4 w-4 mr-2" /> Print</Button>
                <Button onClick={() => toast.success("Invoice downloaded")}><Download className="h-4 w-4 mr-2" /> Download PDF</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
