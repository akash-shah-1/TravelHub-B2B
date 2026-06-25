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
import { Checkbox } from "@/components/ui/checkbox";
import { Row } from "@/features/shared/row";
import { flightResults, fmtINR, type FlightResult } from "@/lib/mock-data";
import { airports, airportByCode, airlineFromCode, fareCatalog, baggageAddons, meals, type FareOption } from "@/lib/search-data";
import { applyMarkup, generatePNR } from "@/lib/booking-utils";
import { ArrowRight, ArrowRightLeft, CheckCircle2, ChevronDown, Download, Luggage, Plane, Plus, Search, Trash2, Utensils, X } from "lucide-react";
import { AirlineLogo } from "./airline-logo";
import { SeatMap } from "./seat-map";

const MARKUP = 4;
type TripType = "oneway" | "round" | "multi";
type Leg = { from: string; to: string; date: string };

export function FlightSearch() {
  const [trip, setTrip] = useState<TripType>("oneway");
  const [legs, setLegs] = useState<Leg[]>([{ from: "DEL", to: "BOM", date: "2026-07-15" }]);
  const [returnDate, setReturnDate] = useState("2026-07-22");
  const [pax, setPax] = useState({ adt: 1, chd: 0, inf: 0 });
  const [cabin, setCabin] = useState("Economy");
  const [searched, setSearched] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [booking, setBooking] = useState<{ f: FlightResult; fare: FareOption } | null>(null);

  const totalPax = pax.adt + pax.chd + pax.inf;

  const setLeg = (i: number, patch: Partial<Leg>) =>
    setLegs(legs.map((l, idx) => idx === i ? { ...l, ...patch } : l));

  const addLeg = () => setLegs([...legs, { from: legs.at(-1)?.to ?? "BLR", to: "DEL", date: "2026-07-20" }]);
  const removeLeg = (i: number) => setLegs(legs.filter((_, idx) => idx !== i));
  const swap = (i: number) => setLeg(i, { from: legs[i].to, to: legs[i].from });

  const visibleLegs: Leg[] = trip === "multi"
    ? legs
    : trip === "round"
      ? [legs[0], { from: legs[0].to, to: legs[0].from, date: returnDate }]
      : [legs[0]];

  return (
    <>
      <Card><CardContent className="p-5 space-y-4">
        {/* Trip type selector */}
        <div className="flex flex-wrap items-center gap-2">
          {(["oneway", "round", "multi"] as const).map(t => (
            <button key={t}
              onClick={() => { setTrip(t); if (t === "multi" && legs.length === 1) addLeg(); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${trip === t ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground hover:bg-accent border-border"}`}>
              {t === "oneway" ? "One Way" : t === "round" ? "Round Trip" : "Multi-City"}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span>Travellers · {totalPax}</span><span>·</span><span>{cabin}</span>
          </div>
        </div>

        {/* Legs */}
        <div className="space-y-3">
          {trip === "multi"
            ? legs.map((l, i) => (
              <LegRow key={i} leg={l} index={i} onChange={(p) => setLeg(i, p)} onSwap={() => swap(i)} onRemove={legs.length > 1 ? () => removeLeg(i) : undefined} />
            ))
            : <LegRow leg={legs[0]} index={0} onChange={(p) => setLeg(0, p)} onSwap={() => swap(0)} />}
          {trip === "round" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-start-3"><Label>Return Date</Label><Input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} /></div>
            </div>
          )}
          {trip === "multi" && (
            <Button variant="outline" size="sm" onClick={addLeg} disabled={legs.length >= 4}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add another flight
            </Button>
          )}
        </div>

        {/* Travellers + cabin */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t">
          <PaxStepper label="Adults"   value={pax.adt} onChange={(v) => setPax({ ...pax, adt: Math.max(1, v) })} hint="12+ yrs" />
          <PaxStepper label="Children" value={pax.chd} onChange={(v) => setPax({ ...pax, chd: Math.max(0, v) })} hint="2-11 yrs" />
          <PaxStepper label="Infants"  value={pax.inf} onChange={(v) => setPax({ ...pax, inf: Math.max(0, v) })} hint="< 2 yrs" />
          <div>
            <Label>Cabin Class</Label>
            <Select value={cabin} onValueChange={setCabin}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Premium">Premium Economy</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="First">First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full md:w-auto" onClick={() => { setSearched(true); toast(`Searching ${visibleLegs.length} leg${visibleLegs.length > 1 ? "s" : ""} · ${totalPax} traveller${totalPax > 1 ? "s" : ""}`); }}>
          <Search className="h-4 w-4 mr-1.5" /> Search Flights
        </Button>
      </CardContent></Card>

      {searched && (
        <div className="space-y-5">
          {visibleLegs.map((leg, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold">{idx + 1}</span>
                <span className="font-medium">{airportByCode(leg.from).city} ({leg.from}) → {airportByCode(leg.to).city} ({leg.to})</span>
                <span className="text-muted-foreground">· {leg.date}</span>
              </div>
              {flightResults.map(f => (
                <FlightResultCard
                  key={`${idx}-${f.id}`}
                  flight={{ ...f, from: leg.from, to: leg.to }}
                  expanded={expanded === `${idx}-${f.id}`}
                  onToggle={() => setExpanded(expanded === `${idx}-${f.id}` ? null : `${idx}-${f.id}`)}
                  onBook={(fare) => setBooking({ f: { ...f, from: leg.from, to: leg.to }, fare })}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      <BookingDialog booking={booking} pax={totalPax} onClose={() => setBooking(null)} />
    </>
  );
}

function LegRow({ leg, index, onChange, onSwap, onRemove }: { leg: Leg; index: number; onChange: (p: Partial<Leg>) => void; onSwap: () => void; onRemove?: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_auto] gap-3 items-end">
      <div>
        <Label>{index === 0 ? "From" : "Flight " + (index + 1) + " · From"}</Label>
        <Select value={leg.from} onValueChange={(v) => onChange({ from: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{airports.map(a => <SelectItem key={a.code} value={a.code}>{a.city} ({a.code})</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <button onClick={onSwap} className="mb-1 mx-auto h-9 w-9 rounded-full border bg-background hover:bg-accent flex items-center justify-center" title="Swap">
        <ArrowRightLeft className="h-4 w-4" />
      </button>
      <div>
        <Label>To</Label>
        <Select value={leg.to} onValueChange={(v) => onChange({ to: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{airports.map(a => <SelectItem key={a.code} value={a.code}>{a.city} ({a.code})</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div>
        <Label>Date</Label>
        <Input type="date" value={leg.date} onChange={(e) => onChange({ date: e.target.value })} />
      </div>
      {onRemove && (
        <Button variant="ghost" size="icon" onClick={onRemove} className="mb-0.5"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      )}
    </div>
  );
}

function PaxStepper({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint: string }) {
  return (
    <div>
      <Label>{label} <span className="text-[10px] text-muted-foreground font-normal">· {hint}</span></Label>
      <div className="flex items-center border rounded-md h-9 px-1">
        <button onClick={() => onChange(value - 1)} className="h-7 w-7 rounded hover:bg-accent">−</button>
        <span className="flex-1 text-center text-sm font-medium">{value}</span>
        <button onClick={() => onChange(value + 1)} className="h-7 w-7 rounded hover:bg-accent">+</button>
      </div>
    </div>
  );
}

function FlightResultCard({ flight, expanded, onToggle, onBook }: { flight: FlightResult; expanded: boolean; onToggle: () => void; onBook: (fare: FareOption) => void }) {
  const brand = airlineFromCode(flight.code);
  const sell = applyMarkup(flight.net, MARKUP);
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center gap-3 min-w-[170px]">
            <AirlineLogo brand={brand} />
            <div>
              <p className="font-medium">{flight.airline}</p>
              <p className="text-xs text-muted-foreground">{flight.code} · {brand.code === "EK" || brand.code === "SQ" ? "Boeing 777" : "Airbus A320"}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-1 min-w-[280px]">
            <div className="text-center"><p className="font-serif text-xl font-bold">{flight.dep}</p><p className="text-xs text-muted-foreground">{flight.from} · {airportByCode(flight.from).city}</p></div>
            <div className="flex-1 text-center min-w-[120px]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /><Plane className="h-3 w-3" /><span className="h-px flex-1 bg-border" /></div>
              <p className="text-xs mt-1 font-medium">{flight.duration}</p>
              <p className="text-[10px] text-muted-foreground">{flight.stops}</p>
            </div>
            <div className="text-center"><p className="font-serif text-xl font-bold">{flight.arr}</p><p className="text-xs text-muted-foreground">{flight.to} · {airportByCode(flight.to).city}</p></div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground line-through">{fmtINR(flight.net)}</p>
              <p className="text-xl font-bold tracking-tight text-foreground">{fmtINR(sell)}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-success-soft text-success text-[10px] font-medium">+{fmtINR(sell - flight.net)} profit</span>
            </div>
            <Button variant="outline" size="sm" onClick={onToggle}>
              {expanded ? "Hide" : "Fares"} <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t grid grid-cols-1 md:grid-cols-3 gap-3">
            {fareCatalog.map(fare => {
              const fareSell = applyMarkup(flight.net + fare.priceDelta, MARKUP);
              return (
                <div key={fare.id} className="rounded-lg border p-4 hover:border-primary hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{fare.name}</p>
                    <span className="font-serif font-bold">{fmtINR(fareSell)}</span>
                  </div>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    <li className="flex items-center gap-2"><Luggage className="h-3 w-3" /> {fare.baggage} check-in · {fare.cabin} cabin</li>
                    <li className="flex items-center gap-2"><Utensils className="h-3 w-3" /> {fare.meal} meal</li>
                    <li className={fare.refundable ? "text-success" : "text-muted-foreground"}>{fare.refundable ? "✓" : "✗"} Refundable</li>
                    <li className={fare.changeable ? "text-success" : "text-muted-foreground"}>{fare.changeable ? "✓" : "✗"} Date change allowed</li>
                    <li>Seat selection: {fare.seatSelect}</li>
                  </ul>
                  <Button className="w-full mt-3" size="sm" onClick={() => onBook(fare)}>Select <ArrowRight className="h-4 w-4 ml-1" /></Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BookingDialog({ booking, pax, onClose }: { booking: { f: FlightResult; fare: FareOption } | null; pax: number; onClose: () => void }) {
  const [step, setStep] = useState<"pax" | "seats" | "addons" | "review">("pax");
  const [seats, setSeats] = useState<string[]>([]);
  const [addons, setAddons] = useState<string[]>([]);
  const [meal, setMeal] = useState<string>("");
  const [confirmed, setConfirmed] = useState<string | null>(null);

  if (!booking) return null;
  const { f, fare } = booking;
  const fareNet = f.net + fare.priceDelta;
  const seatCost = 0; // handled in seat map preview; for simplicity treat as included sell
  const addonCost = addons.reduce((s, id) => s + (baggageAddons.find(b => b.id === id)?.price ?? 0), 0)
                  + (meals.find(m => m.id === meal)?.price ?? 0);
  const totalSell = applyMarkup(fareNet * pax + addonCost + seatCost, MARKUP);

  const reset = () => { setStep("pax"); setSeats([]); setAddons([]); setMeal(""); setConfirmed(null); };

  return (
    <Dialog open={!!booking} onOpenChange={(o) => { if (!o) { onClose(); reset(); } }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {confirmed ? (
          <Confirmed pnr={confirmed} f={f} pax={pax} total={totalSell} onClose={() => { onClose(); reset(); }} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AirlineLogo brand={airlineFromCode(f.code)} size="sm" />
                {f.airline} {f.code} · {f.from} → {f.to}
              </DialogTitle>
              <DialogDescription>{fare.name} fare · {f.dep} – {f.arr} · {pax} traveller{pax > 1 ? "s" : ""}</DialogDescription>
            </DialogHeader>

            <Stepper step={step} onStep={setStep} />

            {step === "pax" && <PaxStep count={pax} />}
            {step === "seats" && <SeatMap flightId={f.id} passengers={pax} selected={seats} onChange={setSeats} />}
            {step === "addons" && <AddonsStep addons={addons} setAddons={setAddons} meal={meal} setMeal={setMeal} />}
            {step === "review" && (
              <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
                <Row label="Fare type" value={fare.name} />
                <Row label="Passengers" value={pax} />
                <Row label="Seats" value={seats.length ? seats.join(", ") : "Auto-assigned"} />
                <Row label="Add-ons" value={addons.length || meal ? `${addons.length} baggage${meal ? ", meal" : ""}` : "None"} />
                <Row label="Base net" value={fmtINR(fareNet * pax)} />
                <Row label="Add-ons net" value={fmtINR(addonCost)} />
                <Row label="Your markup" value={<span className="text-success">+{fmtINR(totalSell - (fareNet * pax + addonCost))}</span>} />
                <div className="pt-2 border-t flex justify-between font-semibold"><span>Customer Pays</span><span className="font-serif">{fmtINR(totalSell)}</span></div>
              </div>
            )}

            <DialogFooter className="flex-wrap gap-2">
              {step !== "pax" && <Button variant="outline" onClick={() => setStep(step === "seats" ? "pax" : step === "addons" ? "seats" : "addons")}>Back</Button>}
              {step !== "review" ? (
                <Button onClick={() => setStep(step === "pax" ? "seats" : step === "seats" ? "addons" : "review")}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
              ) : (
                <Button onClick={() => { const pnr = generatePNR(); setConfirmed(pnr); toast.success(`Booking confirmed · ${pnr}`); }}>Confirm & Issue Ticket</Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stepper({ step, onStep }: { step: string; onStep: (s: "pax" | "seats" | "addons" | "review") => void }) {
  const steps = [
    { id: "pax", label: "Passengers" },
    { id: "seats", label: "Seats" },
    { id: "addons", label: "Add-ons" },
    { id: "review", label: "Review" },
  ] as const;
  const idx = steps.findIndex(s => s.id === step);
  return (
    <div className="flex items-center gap-2 py-2 -mt-2">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2 flex-1">
          <button onClick={() => onStep(s.id)} className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border ${i <= idx ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-transparent"}`}>{i+1}</button>
          <span className={`text-xs ${i === idx ? "font-semibold" : "text-muted-foreground"}`}>{s.label}</span>
          {i < steps.length - 1 && <span className={`flex-1 h-px ${i < idx ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

function PaxStep({ count }: { count: number }) {
  return (
    <div className="space-y-3 pt-1">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <p className="text-sm font-semibold">Passenger {i + 1} {i === 0 && <span className="text-xs text-muted-foreground font-normal">· Lead passenger</span>}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div><Label>Title</Label><Select defaultValue="Mr"><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Mr">Mr</SelectItem><SelectItem value="Ms">Ms</SelectItem><SelectItem value="Mrs">Mrs</SelectItem><SelectItem value="Mstr">Mstr</SelectItem></SelectContent>
            </Select></div>
            <div className="col-span-2"><Label>Full Name (as per ID)</Label><Input defaultValue={i === 0 ? "Rohan Mehta" : ""} placeholder="First Last" /></div>
            <div><Label>DOB</Label><Input type="date" defaultValue="1990-01-01" /></div>
            <div><Label>Nationality</Label><Input defaultValue="Indian" /></div>
            <div><Label>Passport / ID</Label><Input placeholder="P9982231" /></div>
            <div><Label>Frequent Flyer #</Label><Input placeholder="Optional" /></div>
          </div>
        </div>
      ))}
      <div className="rounded-lg border p-4">
        <p className="text-sm font-semibold mb-3">Contact details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><Label>Email</Label><Input defaultValue="ops@democotravels.in" /></div>
          <div><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
        </div>
      </div>
    </div>
  );
}

function AddonsStep({ addons, setAddons, meal, setMeal }: { addons: string[]; setAddons: (a: string[]) => void; meal: string; setMeal: (m: string) => void }) {
  const toggle = (id: string) => setAddons(addons.includes(id) ? addons.filter(x => x !== id) : [...addons, id]);
  return (
    <Tabs defaultValue="baggage" className="pt-1">
      <TabsList>
        <TabsTrigger value="baggage"><Luggage className="h-4 w-4 mr-1.5" />Extra Baggage</TabsTrigger>
        <TabsTrigger value="meals"><Utensils className="h-4 w-4 mr-1.5" />Meals</TabsTrigger>
      </TabsList>
      <TabsContent value="baggage" className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {baggageAddons.map(b => (
          <button key={b.id} onClick={() => toggle(b.id)} className={`rounded-lg border p-4 text-left transition-all ${addons.includes(b.id) ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"}`}>
            <div className="flex items-center justify-between">
              <Checkbox checked={addons.includes(b.id)} />
              <span className="font-serif font-bold">{fmtINR(b.price)}</span>
            </div>
            <p className="font-medium mt-2 text-sm">{b.label}</p>
          </button>
        ))}
      </TabsContent>
      <TabsContent value="meals" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {meals.map(m => (
          <button key={m.id} onClick={() => setMeal(meal === m.id ? "" : m.id)} className={`rounded-lg border p-4 text-left transition-all ${meal === m.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{m.label}</span>
              <span className="font-serif font-bold">{fmtINR(m.price)}</span>
            </div>
          </button>
        ))}
      </TabsContent>
    </Tabs>
  );
}

function Confirmed({ pnr, f, pax, total, onClose }: { pnr: string; f: FlightResult; pax: number; total: number; onClose: () => void }) {
  return (
    <>
      <div className="text-center py-3 space-y-2">
        <div className="mx-auto h-14 w-14 rounded-full bg-success-soft flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-success" />
        </div>
        <h3 className="font-serif text-xl font-bold">Ticket Issued</h3>
        <p className="text-sm text-muted-foreground">Your PNR is ready and the e-ticket has been emailed.</p>
      </div>
      <div className="rounded-lg border p-4 space-y-2 text-sm">
        <Row label="PNR" value={<span className="font-mono font-bold">{pnr}</span>} />
        <Row label="Flight" value={`${f.airline} · ${f.code}`} />
        <Row label="Route" value={`${airportByCode(f.from).city} → ${airportByCode(f.to).city}`} />
        <Row label="Departure" value={f.dep} />
        <Row label="Passengers" value={pax} />
        <Row label="Total" value={<span className="font-serif font-bold">{fmtINR(total)}</span>} />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}><X className="h-4 w-4 mr-1.5" />Close</Button>
        <Button onClick={() => toast.success("E-ticket downloaded")}><Download className="h-4 w-4 mr-1.5" />Download E-Ticket</Button>
      </DialogFooter>
    </>
  );
}
