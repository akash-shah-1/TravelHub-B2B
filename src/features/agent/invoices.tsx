import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { invoices, fmtINR } from "@/lib/mock-data";
import { Download } from "lucide-react";

export function Invoices() {
  return (
    <Tabs defaultValue="received">
      <TabsList>
        <TabsTrigger value="received">Received from Platform</TabsTrigger>
        <TabsTrigger value="issued">Issued to Customers</TabsTrigger>
      </TabsList>
      <TabsContent value="received" className="mt-4">
        <DataTable
          rows={invoices}
          columns={[
            { key: "no", header: "Invoice No", render: r => <span className="font-mono text-xs">{r.no}</span> },
            { key: "pnr", header: "Booking PNR", render: r => <span className="font-mono text-xs">{r.pnr}</span> },
            { key: "date", header: "Date", render: r => r.date },
            { key: "amount", header: "Amount", render: r => fmtINR(r.amount) },
            { key: "gst", header: "GST", render: r => fmtINR(r.gst) },
            { key: "total", header: "Total", render: r => <span className="font-medium">{fmtINR(r.total)}</span> },
            { key: "act", header: "", render: () => <Button size="sm" variant="ghost" onClick={() => toast.success("Invoice downloaded")}><Download className="h-3.5 w-3.5" /></Button> },
          ]}
        />
      </TabsContent>
      <TabsContent value="issued" className="mt-4">
        <DataTable
          rows={invoices.map(i => ({ ...i, no: i.no.replace("INV", "DCT") }))}
          columns={[
            { key: "no", header: "Invoice No", render: r => <span className="font-mono text-xs">{r.no}</span> },
            { key: "pnr", header: "Booking PNR", render: r => <span className="font-mono text-xs">{r.pnr}</span> },
            { key: "date", header: "Date", render: r => r.date },
            { key: "amount", header: "Amount", render: r => fmtINR(r.amount) },
            { key: "gst", header: "GST", render: r => fmtINR(r.gst) },
            { key: "total", header: "Total", render: r => <span className="font-medium">{fmtINR(r.total)}</span> },
            { key: "act", header: "", render: () => <Button size="sm" variant="ghost" onClick={() => toast.success("Invoice downloaded")}><Download className="h-3.5 w-3.5" /></Button> },
          ]}
        />
      </TabsContent>
    </Tabs>
  );
}
