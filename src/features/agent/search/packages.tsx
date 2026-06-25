import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Row } from "@/features/shared/row";
import { fmtINR } from "@/lib/mock-data";
import { packages, type Package } from "@/lib/search-data";
import { applyMarkup, generatePNR } from "@/lib/booking-utils";
import { ArrowRight, CalendarDays, CheckCircle2, Download, Hotel, MapPin, Plane, Star, Users, X } from "lucide-react";

const MARKUP = 5;

export function PackagesSearch() {
  const [detail, setDetail] = useState<Package | null>(null);
  const [booking, setBooking] = useState<Package | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map(p => <PackageCard key={p.id} p={p} onView={() => setDetail(p)} onBook={() => setBooking(p)} />)}
      </div>

      <PackageDetailDialog pkg={detail} onClose={() => setDetail(null)} onBook={() => { setBooking(detail); setDetail(null); }} />
      <PackageBookingDialog pkg={booking} onClose={() => setBooking(null)} />
    </>
  );
}

function PackageCard({ p, onView, onBook }: { p: Package; onView: () => void; onBook: () => void }) {
  const sell = applyMarkup(p.startsFromNet, MARKUP);
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="relative h-44 bg-muted overflow-hidden">
          <img src={p.cover} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded-md bg-background/90 backdrop-blur text-[11px] font-semibold">{p.nights}N / {p.days}D</span>
            {p.flightIncluded && <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[11px] font-semibold inline-flex items-center gap-1"><Plane className="h-3 w-3" />Flights</span>}
          </div>
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-background/90 backdrop-blur text-[11px] font-semibold flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{p.rating}</div>
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="font-serif text-lg font-bold text-foreground leading-tight">{p.title}</h3>
            <p className="text-xs text-foreground/80 flex items-center gap-1"><MapPin className="h-3 w-3" />{p.destination}</p>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <ul className="text-xs text-muted-foreground space-y-1">
            {p.inclusions.slice(0, 3).map(i => <li key={i} className="flex gap-2"><span className="text-success">✓</span>{i}</li>)}
          </ul>
          <div className="flex items-end justify-between pt-2 border-t">
            <div>
              <p className="text-[10px] text-muted-foreground">Starts from · per person</p>
              <p className="font-serif text-xl font-bold">{fmtINR(sell)}</p>
              <span className="inline-block px-1.5 py-0.5 rounded-full bg-success-soft text-success text-[10px] font-medium">+{fmtINR(sell - p.startsFromNet)} profit</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Button size="sm" variant="outline" onClick={onView}>Details</Button>
              <Button size="sm" onClick={onBook}>Book <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PackageDetailDialog({ pkg, onClose, onBook }: { pkg: Package | null; onClose: () => void; onBook: () => void }) {
  if (!pkg) return null;
  const sell = applyMarkup(pkg.startsFromNet, MARKUP);
  return (
    <Dialog open={!!pkg} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="relative -m-6 mb-2 h-56 overflow-hidden rounded-t-lg">
          <img src={pkg.cover} alt={pkg.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-3 left-6 right-6">
            <h2 className="font-serif text-2xl font-bold">{pkg.title}</h2>
            <p className="text-sm text-foreground/85 flex items-center gap-3"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{pkg.destination}</span><span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{pkg.nights}N / {pkg.days}D</span><span className="flex items-center gap-1"><Hotel className="h-3 w-3" />{pkg.hotelCategory}</span></p>
          </div>
        </div>
        <Tabs defaultValue="itinerary" className="mt-4">
          <TabsList>
            <TabsTrigger value="itinerary">Day-by-Day</TabsTrigger>
            <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
          </TabsList>
          <TabsContent value="itinerary" className="mt-4 space-y-3">
            {pkg.itinerary.map(d => (
              <div key={d.day} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">{d.day}</div>
                  {d.day < pkg.itinerary.length && <div className="flex-1 w-px bg-border my-1" />}
                </div>
                <div className="pb-3">
                  <p className="font-semibold text-sm">Day {d.day} · {d.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.detail}</p>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="inclusions" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {pkg.inclusions.map(i => <div key={i} className="flex items-center gap-2 text-sm rounded-md border p-2"><span className="text-success">✓</span>{i}</div>)}
          </TabsContent>
          <TabsContent value="highlights" className="mt-4 space-y-2">
            {pkg.highlights.map(h => <div key={h} className="flex items-center gap-2 text-sm"><Star className="h-4 w-4 fill-gold text-gold" />{h}</div>)}
          </TabsContent>
        </Tabs>
        <DialogFooter className="pt-4 border-t">
          <div className="mr-auto">
            <p className="text-[10px] text-muted-foreground">Starts from · per person</p>
            <p className="font-serif text-xl font-bold">{fmtINR(sell)}</p>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onBook}>Book Package <ArrowRight className="h-4 w-4 ml-1" /></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PackageBookingDialog({ pkg, onClose }: { pkg: Package | null; onClose: () => void }) {
  const [travellers, setTravellers] = useState(2);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  if (!pkg) return null;
  const totalNet = pkg.startsFromNet * travellers;
  const sell = applyMarkup(totalNet, MARKUP);

  return (
    <Dialog open={!!pkg} onOpenChange={(o) => { if (!o) { onClose(); setConfirmed(null); } }}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        {confirmed ? (
          <>
            <div className="text-center py-3 space-y-2">
              <div className="mx-auto h-14 w-14 rounded-full bg-success-soft flex items-center justify-center"><CheckCircle2 className="h-7 w-7 text-success" /></div>
              <h3 className="font-serif text-xl font-bold">Package Booked</h3>
              <p className="text-sm text-muted-foreground">Confirmation voucher generated.</p>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <img src={pkg.cover} alt="" className="h-28 w-full object-cover" />
              <div className="p-4 space-y-2 text-sm">
                <Row label="Booking Ref" value={<span className="font-mono font-bold">{confirmed}</span>} />
                <Row label="Package" value={pkg.title} />
                <Row label="Duration" value={`${pkg.nights}N / ${pkg.days}D`} />
                <Row label="Travellers" value={travellers} />
                <Row label="Total" value={<span className="font-serif font-bold">{fmtINR(sell)}</span>} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { onClose(); setConfirmed(null); }}><X className="h-4 w-4 mr-1.5" />Close</Button>
              <Button onClick={() => toast.success("Voucher downloaded")}><Download className="h-4 w-4 mr-1.5" />Download Voucher</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif">{pkg.title}</DialogTitle>
              <DialogDescription>{pkg.destination} · {pkg.nights}N / {pkg.days}D</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Lead Traveller</Label><Input defaultValue="Rohan Mehta" /></div>
                <div><Label>Email</Label><Input defaultValue="rohan@email.com" /></div>
                <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
                <div><Label>Travellers <Users className="inline h-3 w-3 ml-1" /></Label><Input type="number" min={1} value={travellers} onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)))} /></div>
                <div><Label>Travel Date</Label><Input type="date" defaultValue="2026-09-10" /></div>
                <div><Label>Special Requests</Label><Input placeholder="Optional" /></div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>{travellers} × {fmtINR(pkg.startsFromNet)}</span><span>{fmtINR(totalNet)}</span></div>
                <div className="flex justify-between"><span>Your Markup ({MARKUP}%)</span><span className="text-success">+{fmtINR(sell - totalNet)}</span></div>
                <div className="flex justify-between font-semibold pt-1 border-t"><span>Customer Pays</span><span className="font-serif">{fmtINR(sell)}</span></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => { const pnr = generatePNR(); setConfirmed(pnr); toast.success(`Package booked · ${pnr}`); }}>Confirm & Book</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
