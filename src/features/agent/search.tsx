import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Row } from "@/features/shared/row";
import { airportCodes, flightResults, hotelCities, hotelResults, fmtINR, type FlightResult, type HotelResult } from "@/lib/mock-data";
import { applyMarkup, generatePNR, nightsBetween } from "@/lib/booking-utils";
import { Plane, Hotel, Search, ArrowRight, CheckCircle2, Download, Star } from "lucide-react";

const MARKUP = 4;

export function SearchBook() {
  return (
    <Tabs defaultValue="flights">
      <TabsList>
        <TabsTrigger value="flights"><Plane className="h-4 w-4 mr-1.5" />Flights</TabsTrigger>
        <TabsTrigger value="hotels"><Hotel className="h-4 w-4 mr-1.5" />Hotels</TabsTrigger>
      </TabsList>
      <TabsContent value="flights" className="mt-4 space-y-5"><FlightSearch /></TabsContent>
      <TabsContent value="hotels" className="mt-4 space-y-5"><HotelSearch /></TabsContent>
    </Tabs>
  );
}

function FlightSearch() {
  const [searched, setSearched] = useState(false);
  const [booking, setBooking] = useState<FlightResult | null>(null);
  const [confirmed, setConfirmed] = useState<{ pnr: string; f: FlightResult } | null>(null);

  return (
    <>
      <Card><CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div><Label>From</Label><Select defaultValue="DEL"><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{airportCodes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select></div>
          <div><Label>To</Label><Select defaultValue="BOM"><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{airportCodes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select></div>
          <div><Label>Date</Label><Input type="date" defaultValue="2026-07-15" /></div>
          <div><Label>Passengers</Label><Input type="number" defaultValue="2" min="1" /></div>
          <div><Label>Class</Label><Select defaultValue="Economy"><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Economy">Economy</SelectItem><SelectItem value="Premium">Premium Economy</SelectItem><SelectItem value="Business">Business</SelectItem></SelectContent>
          </Select></div>
        </div>
        <Button className="mt-4" onClick={() => { setSearched(true); toast("Showing 5 results from 3 suppliers"); }}>
          <Search className="h-4 w-4 mr-1.5" /> Search Flights
        </Button>
      </CardContent></Card>

      {searched && (
        <div className="space-y-3">
          {flightResults.map(f => {
            const sell = applyMarkup(f.net, MARKUP);
            return (
              <Card key={f.id}>
                <CardContent className="p-5 flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="h-11 w-11 rounded-md bg-accent flex items-center justify-center text-accent-foreground font-semibold text-xs">
                      {f.airline.split(" ").map(w => w[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{f.airline}</p>
                      <p className="text-xs text-muted-foreground">{f.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center"><p className="font-semibold">{f.dep}</p><p className="text-xs text-muted-foreground">{f.from}</p></div>
                    <div className="text-center min-w-[110px]"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><Plane className="h-3 w-3" /><span className="h-px flex-1 bg-border" /></div><p className="text-xs mt-1">{f.duration} · {f.stops}</p></div>
                    <div className="text-center"><p className="font-semibold">{f.arr}</p><p className="text-xs text-muted-foreground">{f.to}</p></div>
                  </div>
                  <div className="ml-auto flex items-center gap-5">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground line-through">{fmtINR(f.net)}</p>
                      <p className="text-xl font-semibold tracking-tight">{fmtINR(sell)}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-success-soft text-success text-xs font-medium">+{fmtINR(sell - f.net)} profit</span>
                    </div>
                    <Button onClick={() => setBooking(f)}>Book Now <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!booking} onOpenChange={(o) => !o && setBooking(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Passenger Details</DialogTitle><DialogDescription>{booking?.airline} · {booking?.from} → {booking?.to} · {booking?.dep}</DialogDescription></DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title</Label><Select defaultValue="Mr"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Mr">Mr</SelectItem><SelectItem value="Ms">Ms</SelectItem><SelectItem value="Mrs">Mrs</SelectItem></SelectContent>
              </Select></div>
              <div><Label>Full Name</Label><Input defaultValue="Rohan Mehta" /></div>
              <div><Label>DOB</Label><Input type="date" defaultValue="1988-05-12" /></div>
              <div><Label>Passport / ID</Label><Input defaultValue="P9982231" /></div>
              <div><Label>Email</Label><Input defaultValue="rohan@email.com" /></div>
              <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
            </div>
            {booking && (
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>Net Price</span><span>{fmtINR(booking.net)}</span></div>
                <div className="flex justify-between"><span>Your Markup ({MARKUP}%)</span><span className="text-success">+{fmtINR(applyMarkup(booking.net, MARKUP) - booking.net)}</span></div>
                <div className="flex justify-between font-medium pt-1 border-t"><span>Customer Pays</span><span>{fmtINR(applyMarkup(booking.net, MARKUP))}</span></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBooking(null)}>Cancel</Button>
            <Button onClick={() => {
              const pnr = generatePNR();
              setConfirmed({ pnr, f: booking! });
              setBooking(null);
              toast.success(`Booking confirmed · ${pnr}`);
            }}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmed} onOpenChange={(o) => !o && setConfirmed(null)}>
        <DialogContent>
          <div className="text-center py-3 space-y-2">
            <div className="mx-auto h-14 w-14 rounded-full bg-success-soft flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Booking Confirmed</h3>
            <p className="text-sm text-muted-foreground">Your PNR has been generated and the e-ticket is ready.</p>
          </div>
          {confirmed && (
            <div className="rounded-lg border p-4 space-y-2 text-sm">
              <Row label="PNR" value={confirmed.pnr} />
              <Row label="Flight" value={`${confirmed.f.airline} · ${confirmed.f.code}`} />
              <Row label="Route" value={`${confirmed.f.from} → ${confirmed.f.to}`} />
              <Row label="Departure" value={confirmed.f.dep} />
              <Row label="Customer Pays" value={fmtINR(applyMarkup(confirmed.f.net, MARKUP))} />
              <Row label="Your Profit" value={fmtINR(applyMarkup(confirmed.f.net, MARKUP) - confirmed.f.net)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmed(null)}>Close</Button>
            <Button onClick={() => toast.success("E-ticket downloaded")}><Download className="h-4 w-4 mr-1.5" /> Download E-Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HotelSearch() {
  const [searched, setSearched] = useState(false);
  const [city, setCity] = useState("Goa");
  const [checkIn, setCheckIn] = useState("2026-07-12");
  const [checkOut, setCheckOut] = useState("2026-07-15");
  const [booking, setBooking] = useState<HotelResult | null>(null);
  const [confirmed, setConfirmed] = useState<{ pnr: string; h: HotelResult; nights: number } | null>(null);

  const nights = nightsBetween(checkIn, checkOut);

  return (
    <>
      <Card><CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2"><Label>City</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{hotelCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Check-in</Label><Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></div>
          <div><Label>Check-out</Label><Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></div>
          <div><Label>Guests</Label><Input type="number" defaultValue="2" min="1" /></div>
        </div>
        <Button className="mt-4" onClick={() => { setSearched(true); toast(`Showing ${hotelResults.length} hotels in ${city}`); }}>
          <Search className="h-4 w-4 mr-1.5" /> Search Hotels
        </Button>
      </CardContent></Card>

      {searched && (
        <div className="space-y-3">
          {hotelResults.map(h => {
            const totalNet = h.perNightNet * nights;
            const sell = applyMarkup(totalNet, MARKUP);
            return (
              <Card key={h.id}>
                <CardContent className="p-5 flex flex-wrap items-center gap-5">
                  <div className="h-20 w-28 rounded-md bg-accent flex items-center justify-center text-accent-foreground">
                    <Hotel className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{h.name}</p>
                      <div className="flex">{Array.from({ length: h.stars }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{h.area}, {h.city} · {h.roomType}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {h.amenities.map(a => <span key={a} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">{a}</span>)}
                    </div>
                    <p className="text-xs text-success mt-2">⭐ {h.rating} guest rating</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">{nights} night{nights > 1 ? "s" : ""} · total</p>
                    <p className="text-xs text-muted-foreground line-through">{fmtINR(totalNet)}</p>
                    <p className="text-xl font-semibold tracking-tight">{fmtINR(sell)}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-success-soft text-success text-xs font-medium">+{fmtINR(sell - totalNet)} profit</span>
                    <div className="mt-2"><Button size="sm" onClick={() => setBooking(h)}>Book Now <ArrowRight className="h-4 w-4 ml-1.5" /></Button></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!booking} onOpenChange={(o) => !o && setBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guest Details</DialogTitle>
            <DialogDescription>{booking?.name} · {booking?.area}, {booking?.city}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Lead Guest Name</Label><Input defaultValue="Aman Verma" /></div>
              <div><Label>Email</Label><Input defaultValue="aman@email.com" /></div>
              <div><Label>Phone</Label><Input defaultValue="+91 98765 12345" /></div>
              <div><Label>ID Proof</Label><Input defaultValue="Aadhaar XXXX-1234" /></div>
              <div><Label>Check-in</Label><Input type="date" value={checkIn} readOnly /></div>
              <div><Label>Check-out</Label><Input type="date" value={checkOut} readOnly /></div>
            </div>
            {booking && (
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>{nights} × {fmtINR(booking.perNightNet)}</span><span>{fmtINR(booking.perNightNet * nights)}</span></div>
                <div className="flex justify-between"><span>Your Markup ({MARKUP}%)</span><span className="text-success">+{fmtINR(applyMarkup(booking.perNightNet * nights, MARKUP) - booking.perNightNet * nights)}</span></div>
                <div className="flex justify-between font-medium pt-1 border-t"><span>Customer Pays</span><span>{fmtINR(applyMarkup(booking.perNightNet * nights, MARKUP))}</span></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBooking(null)}>Cancel</Button>
            <Button onClick={() => {
              const pnr = generatePNR();
              setConfirmed({ pnr, h: booking!, nights });
              setBooking(null);
              toast.success(`Hotel confirmed · ${pnr}`);
            }}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmed} onOpenChange={(o) => !o && setConfirmed(null)}>
        <DialogContent>
          <div className="text-center py-3 space-y-2">
            <div className="mx-auto h-14 w-14 rounded-full bg-success-soft flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Hotel Confirmed</h3>
            <p className="text-sm text-muted-foreground">Your booking voucher is ready.</p>
          </div>
          {confirmed && (
            <div className="rounded-lg border p-4 space-y-2 text-sm">
              <Row label="Voucher PNR" value={confirmed.pnr} />
              <Row label="Hotel" value={confirmed.h.name} />
              <Row label="Location" value={`${confirmed.h.area}, ${confirmed.h.city}`} />
              <Row label="Nights" value={confirmed.nights} />
              <Row label="Customer Pays" value={fmtINR(applyMarkup(confirmed.h.perNightNet * confirmed.nights, MARKUP))} />
              <Row label="Your Profit" value={fmtINR(applyMarkup(confirmed.h.perNightNet * confirmed.nights, MARKUP) - confirmed.h.perNightNet * confirmed.nights)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmed(null)}>Close</Button>
            <Button onClick={() => toast.success("Voucher downloaded")}><Download className="h-4 w-4 mr-1.5" /> Download Voucher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
