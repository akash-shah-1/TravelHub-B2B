import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Row } from "@/features/shared/row";
import { hotelCities, fmtINR } from "@/lib/mock-data";
import { richHotels, type RichHotel, type HotelRoom } from "@/lib/search-data";
import { applyMarkup, generatePNR, nightsBetween } from "@/lib/booking-utils";
import { ArrowRight, BedDouble, CheckCircle2, Coffee, Download, Heart, MapPin, Search, Star, Users, Utensils, Waves, Wifi, X } from "lucide-react";

const MARKUP = 4;
const MAX_PRICE = 12000;

export function HotelSearch() {
  const [city, setCity] = useState("Goa");
  const [checkIn, setCheckIn] = useState("2026-07-12");
  const [checkOut, setCheckOut] = useState("2026-07-15");
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 });
  const [searched, setSearched] = useState(false);
  const [detail, setDetail] = useState<RichHotel | null>(null);
  const [booking, setBooking] = useState<{ h: RichHotel; room: HotelRoom } | null>(null);
  const [stars, setStars] = useState<number[]>([]);
  const [priceCap, setPriceCap] = useState(MAX_PRICE);
  const [sortBy, setSortBy] = useState<"recommended" | "price-asc" | "price-desc" | "rating">("recommended");

  const nights = nightsBetween(checkIn, checkOut);

  let results = richHotels.filter(h =>
    (stars.length === 0 || stars.includes(h.stars)) &&
    h.rooms[0].netPrice <= priceCap,
  );
  if (sortBy === "price-asc") results = [...results].sort((a, b) => a.rooms[0].netPrice - b.rooms[0].netPrice);
  if (sortBy === "price-desc") results = [...results].sort((a, b) => b.rooms[0].netPrice - a.rooms[0].netPrice);
  if (sortBy === "rating") results = [...results].sort((a, b) => b.rating - a.rating);

  const toggleStar = (s: number) => setStars(stars.includes(s) ? stars.filter(x => x !== s) : [...stars, s]);

  return (
    <>
      <Card><CardContent className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <Label>City / Destination</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{hotelCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Check-in</Label><Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></div>
          <div><Label>Check-out</Label><Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></div>
          <div><Label>Rooms · Guests</Label>
            <Select value={`${guests.rooms}-${guests.adults}`} onValueChange={(v) => {
              const [r, a] = v.split("-").map(Number);
              setGuests({ ...guests, rooms: r, adults: a });
            }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1-1">1 Room · 1 Adult</SelectItem>
                <SelectItem value="1-2">1 Room · 2 Adults</SelectItem>
                <SelectItem value="2-3">2 Rooms · 3 Adults</SelectItem>
                <SelectItem value="2-4">2 Rooms · 4 Adults</SelectItem>
                <SelectItem value="3-6">3 Rooms · 6 Adults</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => { setSearched(true); toast(`Showing ${results.length} hotels in ${city}`); }}>
          <Search className="h-4 w-4 mr-1.5" /> Search Hotels
        </Button>
      </CardContent></Card>

      {searched && (
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
          {/* Filters sidebar */}
          <Card className="h-fit lg:sticky lg:top-24"><CardContent className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">Sort By</p>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-asc">Price · Low to High</SelectItem>
                  <SelectItem value="price-desc">Price · High to Low</SelectItem>
                  <SelectItem value="rating">Guest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">Star Rating</p>
              <div className="space-y-1.5">
                {[5, 4, 3].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={stars.includes(s)} onChange={() => toggleStar(s)} className="rounded" />
                    <div className="flex">{Array.from({ length: s }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}</div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2">Max per night</p>
              <input type="range" min={2000} max={MAX_PRICE} step={500} value={priceCap} onChange={(e) => setPriceCap(Number(e.target.value))} className="w-full accent-primary" />
              <p className="text-sm font-medium mt-1">Up to {fmtINR(priceCap)}</p>
            </div>
          </CardContent></Card>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{results.length} properties in {city} · {nights} night{nights > 1 ? "s" : ""}</p>
            {results.map(h => <HotelCard key={h.id} h={h} nights={nights} onView={() => setDetail(h)} onBook={(room) => setBooking({ h, room })} />)}
          </div>
        </div>
      )}

      <HotelDetailDialog
        hotel={detail}
        nights={nights}
        onClose={() => setDetail(null)}
        onBook={(room) => { setBooking({ h: detail!, room }); setDetail(null); }}
      />
      <HotelBookingDialog
        booking={booking}
        nights={nights}
        checkIn={checkIn}
        checkOut={checkOut}
        onClose={() => setBooking(null)}
      />
    </>
  );
}

function HotelCard({ h, nights, onView, onBook }: { h: RichHotel; nights: number; onView: () => void; onBook: (r: HotelRoom) => void }) {
  const cheapest = h.rooms[0];
  const totalNet = cheapest.netPrice * nights;
  const sell = applyMarkup(totalNet, MARKUP);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
          <div className="relative h-48 md:h-full bg-muted">
            <img src={h.images[0]} alt={h.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/85 backdrop-blur text-[11px] font-semibold flex items-center gap-1">
              <Star className="h-3 w-3 fill-gold text-gold" /> {h.rating}
              <span className="text-muted-foreground font-normal">({h.reviews})</span>
            </div>
            <button className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/85 backdrop-blur flex items-center justify-center hover:bg-background">
              <Heart className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg font-bold leading-tight">{h.name}</h3>
                  <div className="flex">{Array.from({ length: h.stars }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.area}, {h.city}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Total · {nights} night{nights > 1 ? "s" : ""}</p>
                <p className="text-[11px] text-muted-foreground line-through">{fmtINR(totalNet)}</p>
                <p className="font-serif text-xl font-bold">{fmtINR(sell)}</p>
                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-full bg-success-soft text-success text-[10px] font-medium">+{fmtINR(sell - totalNet)} profit</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {h.amenities.slice(0, 5).map(a => (
                <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-muted text-muted-foreground">
                  <AmenityIcon name={a} /> {a}
                </span>
              ))}
              {h.amenities.length > 5 && <span className="text-[11px] text-muted-foreground">+{h.amenities.length - 5} more</span>}
            </div>
            <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside">
              {h.highlights.slice(0, 2).map(x => <li key={x}>{x}</li>)}
            </ul>
            <div className="mt-auto pt-3 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onView}>View Details</Button>
              <Button size="sm" onClick={() => onBook(cheapest)}>Book Now <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AmenityIcon({ name }: { name: string }) {
  if (/wifi/i.test(name)) return <Wifi className="h-3 w-3" />;
  if (/pool|beach/i.test(name)) return <Waves className="h-3 w-3" />;
  if (/break|restaurant|bar/i.test(name)) return <Utensils className="h-3 w-3" />;
  if (/spa|gym|yoga/i.test(name)) return <Heart className="h-3 w-3" />;
  return <Coffee className="h-3 w-3" />;
}

function HotelDetailDialog({ hotel, nights, onClose, onBook }: { hotel: RichHotel | null; nights: number; onClose: () => void; onBook: (r: HotelRoom) => void }) {
  const [activeImg, setActiveImg] = useState(0);
  if (!hotel) return null;
  return (
    <Dialog open={!!hotel} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl flex items-center gap-2">
            {hotel.name}
            <div className="flex">{Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" />)}</div>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {hotel.area}, {hotel.city} · {hotel.rating} ★ ({hotel.reviews} reviews)</DialogDescription>
        </DialogHeader>

        {/* Gallery */}
        <div className="space-y-2">
          <div className="aspect-[16/8] rounded-lg overflow-hidden bg-muted">
            <img src={hotel.images[activeImg]} alt={hotel.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {hotel.images.map((src, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition-all ${activeImg === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="rooms">
          <TabsList>
            <TabsTrigger value="rooms"><BedDouble className="h-4 w-4 mr-1.5" />Rooms</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>
          <TabsContent value="rooms" className="space-y-3 mt-4">
            {hotel.rooms.map(r => {
              const totalNet = r.netPrice * nights;
              const sell = applyMarkup(totalNet, MARKUP);
              return (
                <div key={r.id} className="rounded-lg border p-4 flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3"><span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{r.bed}</span><span className="flex items-center gap-1"><Users className="h-3 w-3" />{r.occupancy}</span></p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {r.inclusions.map(i => <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-success-soft text-success">{i}</span>)}
                    </div>
                    <p className="text-xs mt-2 text-muted-foreground">{r.cancellation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</p>
                    <p className="font-serif text-lg font-bold">{fmtINR(sell)}</p>
                    <Button size="sm" className="mt-1" onClick={() => onBook(r)}>Book <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
                  </div>
                </div>
              );
            })}
          </TabsContent>
          <TabsContent value="about" className="mt-4 text-sm text-muted-foreground space-y-3">
            <p>{hotel.about}</p>
            <ul className="list-disc list-inside space-y-1">{hotel.highlights.map(h => <li key={h}>{h}</li>)}</ul>
          </TabsContent>
          <TabsContent value="amenities" className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {hotel.amenities.map(a => (
              <div key={a} className="flex items-center gap-2 text-sm rounded-md border p-2">
                <AmenityIcon name={a} /> {a}
              </div>
            ))}
          </TabsContent>
          <TabsContent value="policies" className="mt-4">
            <ul className="text-sm space-y-1.5">{hotel.policies.map(p => <li key={p} className="flex gap-2"><span className="text-primary">·</span>{p}</li>)}</ul>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function HotelBookingDialog({ booking, nights, checkIn, checkOut, onClose }: { booking: { h: RichHotel; room: HotelRoom } | null; nights: number; checkIn: string; checkOut: string; onClose: () => void }) {
  const [confirmed, setConfirmed] = useState<string | null>(null);
  if (!booking) return null;
  const { h, room } = booking;
  const totalNet = room.netPrice * nights;
  const sell = applyMarkup(totalNet, MARKUP);

  return (
    <Dialog open={!!booking} onOpenChange={(o) => { if (!o) { onClose(); setConfirmed(null); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {confirmed ? (
          <>
            <div className="text-center py-3 space-y-2">
              <div className="mx-auto h-14 w-14 rounded-full bg-success-soft flex items-center justify-center"><CheckCircle2 className="h-7 w-7 text-success" /></div>
              <h3 className="font-serif text-xl font-bold">Hotel Confirmed</h3>
              <p className="text-sm text-muted-foreground">Your booking voucher is ready.</p>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <img src={h.images[0]} alt={h.name} className="h-32 w-full object-cover" />
              <div className="p-4 space-y-2 text-sm">
                <Row label="Voucher PNR" value={<span className="font-mono font-bold">{confirmed}</span>} />
                <Row label="Hotel" value={h.name} />
                <Row label="Room" value={room.name} />
                <Row label="Stay" value={`${checkIn} → ${checkOut} · ${nights} night${nights > 1 ? "s" : ""}`} />
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
              <DialogTitle className="font-serif">{h.name} · {room.name}</DialogTitle>
              <DialogDescription>{h.area}, {h.city} · {checkIn} → {checkOut} · {nights} night{nights > 1 ? "s" : ""}</DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 items-center pt-1">
              <img src={h.images[0]} alt="" className="h-20 w-28 rounded-md object-cover" />
              <div className="text-xs space-y-1 flex-1">
                <p className="font-medium text-sm">{room.bed} · {room.occupancy}</p>
                <div className="flex flex-wrap gap-1">{room.inclusions.map(i => <span key={i} className="px-1.5 py-0.5 rounded bg-success-soft text-success text-[10px]">{i}</span>)}</div>
                <p className="text-muted-foreground">{room.cancellation}</p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-sm font-semibold">Lead Guest</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Full Name</Label><Input defaultValue="Aman Verma" /></div>
                <div><Label>Email</Label><Input defaultValue="aman@email.com" /></div>
                <div><Label>Phone</Label><Input defaultValue="+91 98765 12345" /></div>
                <div><Label>ID Proof</Label><Input defaultValue="Aadhaar XXXX-1234" /></div>
              </div>
              <div><Label>Special Requests</Label><Input placeholder="Late check-in, high floor, etc. (optional)" /></div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                <div className="flex justify-between"><span>{nights} × {fmtINR(room.netPrice)}</span><span>{fmtINR(totalNet)}</span></div>
                <div className="flex justify-between"><span>Your Markup ({MARKUP}%)</span><span className="text-success">+{fmtINR(sell - totalNet)}</span></div>
                <div className="flex justify-between font-semibold pt-1 border-t"><span>Customer Pays</span><span className="font-serif">{fmtINR(sell)}</span></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => { const pnr = generatePNR(); setConfirmed(pnr); toast.success(`Hotel confirmed · ${pnr}`); }}>Confirm Booking</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
