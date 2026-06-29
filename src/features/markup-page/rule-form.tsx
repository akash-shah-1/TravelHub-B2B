import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AGENTS, AIRLINES, ALL_CITIES, DOMESTIC_CITIES, INTL_CITIES,
  emptyDraft, type FlightMarkupRule, type MarkupType, type TripType,
} from "./data";

const TRIP_OPTIONS: TripType[] = ["One-way", "Round-trip", "Multi-city", "All"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function SectionHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-4 w-1 rounded-full bg-primary" />
      <h3 className="text-[15px] font-bold text-primary">{title}</h3>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">{hint}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function Section({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-5">{children}</div>;
}

interface Props {
  draft: FlightMarkupRule;
  isEdit: boolean;
  onChange: (next: FlightMarkupRule) => void;
  onSave: (status: "Active" | "Draft") => void;
  onCancel: () => void;
  onReset: () => void;
}

export function RuleForm({ draft, isEdit, onChange, onSave, onCancel, onReset }: Props) {
  const [lastSaved, setLastSaved] = useState("just now");
  const [days, setDays] = useState<string[]>([]);
  const [restrictBooking, setRestrictBooking] = useState(false);
  const [restrictTravel, setRestrictTravel] = useState(false);
  const [pairs, setPairs] = useState(draft.pairs ?? [{ from: "DEL", to: "BOM" }]);

  useEffect(() => {
    const t = setInterval(() => setLastSaved("2 mins ago"), 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { setPairs(draft.pairs ?? [{ from: "DEL", to: "BOM" }]); }, [draft.id]);

  const set = (patch: Partial<FlightMarkupRule>) => onChange({ ...draft, ...patch });

  const toggleTrip = (t: TripType) => {
    const has = draft.tripTypes.includes(t);
    set({ tripTypes: has ? draft.tripTypes.filter(x => x !== t) : [...draft.tripTypes, t] });
  };

  const toggleAirline = (code: string) => {
    if (code === "ALL") { set({ airlines: ["ALL"] }); return; }
    const cleaned = draft.airlines.filter(a => a !== "ALL");
    const has = cleaned.includes(code);
    const next = has ? cleaned.filter(a => a !== code) : [...cleaned, code];
    set({ airlines: next.length ? next : ["ALL"] });
  };

  const toggleCity = (key: "origins" | "destinations", city: string) => {
    const list = draft[key] ?? [];
    const has = list.includes(city);
    set({ [key]: has ? list.filter(c => c !== city) : [...list, city] } as Partial<FlightMarkupRule>);
  };

  const isRT = draft.tripTypes.includes("Round-trip");
  const isMC = draft.tripTypes.includes("Multi-city");

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-5 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-semibold text-primary">
            {isEdit ? `Edit Rule: ${draft.name || "(unnamed)"}` : "Add New Rule"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure all parameters below, then save</p>
        </div>
        <span className="text-xs text-slate-500">Last saved: {lastSaved}</span>
      </div>

      <div className="p-5 space-y-5">
        {/* SECTION 1 */}
        <Section>
          <SectionHeader title="1. Rule Identity" hint="Name, priority and lifecycle state" />
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Rule Name</Label>
              <Input value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. DEL–BOM IndiGo One-way" />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Input type="number" value={draft.priority} onChange={(e) => set({ priority: Number(e.target.value) })} />
              <p className="text-[11px] text-slate-500">Lower number = evaluated first</p>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="inline-flex rounded-md border border-slate-200 overflow-hidden">
                {(["Active", "Inactive", "Scheduled"] as const).map(s => (
                  <button key={s} type="button"
                    onClick={() => set({ status: s })}
                    className={cn("px-3 py-2 text-xs font-medium transition-colors",
                      draft.status === s ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {draft.status === "Scheduled" && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div><Label>Start date</Label><Input type="datetime-local" defaultValue={draft.scheduledStart} onChange={(e) => set({ scheduledStart: e.target.value })} /></div>
              <div><Label>End date</Label><Input type="datetime-local" defaultValue={draft.scheduledEnd} onChange={(e) => set({ scheduledEnd: e.target.value })} /></div>
            </div>
          )}
        </Section>
        <Separator />

        {/* SECTION 2 */}
        <Section>
          <SectionHeader title="2. Applies To" hint="Limit which agents receive this markup" />
          <p className="text-sm text-slate-600 mb-2">Which agents does this rule apply to?</p>
          <RadioGroup value={draft.appliesToKind} onValueChange={(v) => set({ appliesToKind: v as never })} className="space-y-2">
            <div className="flex items-center gap-2"><RadioGroupItem value="All" id="a-all" /><Label htmlFor="a-all" className="font-normal">All agents (default)</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="Specific" id="a-spec" /><Label htmlFor="a-spec" className="font-normal">Specific agent</Label></div>
            {draft.appliesToKind === "Specific" && (
              <div className="pl-6 max-w-sm">
                <Select value={draft.specificAgent} onValueChange={(v) => set({ specificAgent: v })}>
                  <SelectTrigger><SelectValue placeholder="Choose agent" /></SelectTrigger>
                  <SelectContent>{AGENTS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2"><RadioGroupItem value="Tier" id="a-tier" /><Label htmlFor="a-tier" className="font-normal">Agent tier</Label></div>
            {draft.appliesToKind === "Tier" && (
              <div className="pl-6 flex gap-4">
                {["Master Agent", "Agent", "Sub-Agent"].map(t => (
                  <label key={t} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={draft.tiers?.includes(t)}
                      onCheckedChange={(c) => {
                        const cur = draft.tiers ?? [];
                        set({ tiers: c ? [...cur, t] : cur.filter(x => x !== t) });
                      }}
                    /> {t}
                  </label>
                ))}
              </div>
            )}
          </RadioGroup>
        </Section>
        <Separator />

        {/* SECTION 3 */}
        <Section>
          <SectionHeader title="3. Flight Type Filters" hint="Trip type, sector, cabin and airline filters" />
          <p className="text-sm text-slate-600 mb-2">What type of flights does this rule target?</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TRIP_OPTIONS.map(t => {
              const on = draft.tripTypes.includes(t);
              return (
                <button key={t} type="button" onClick={() => toggleTrip(t)}
                  className={cn("px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
                    on ? "bg-primary border-primary text-primary-foreground" : "bg-white border-slate-300 text-slate-700 hover:border-primary/50")}>
                  {t}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Sector type</Label>
              <Select value={draft.sector} onValueChange={(v) => set({ sector: v as never })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Domestic">Domestic</SelectItem><SelectItem value="International">International</SelectItem><SelectItem value="Both">Both</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cabin class</Label>
              <Select value={draft.cabin} onValueChange={(v) => set({ cabin: v as never })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Economy">Economy</SelectItem><SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="First Class">First Class</SelectItem><SelectItem value="All">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Airline</Label>
              <Select value={draft.airlines[0]} onValueChange={(v) => toggleAirline(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AIRLINES.map(a => <SelectItem key={a.code} value={a.code}>{a.name} {a.code !== "ALL" && `(${a.code})`}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-slate-500 mt-1">Selected: {draft.airlines.join(", ")}</p>
            </div>
          </div>
        </Section>
        <Separator />

        {/* SECTION 4 */}
        <Section>
          <SectionHeader title="4. Route Configuration" hint="Limit by origin, destination or specific city pair" />
          <p className="text-sm text-slate-600 mb-2">Define the route scope</p>
          <RadioGroup value={draft.routeMode} onValueChange={(v) => set({ routeMode: v as never })} className="space-y-3">
            <div className="flex items-center gap-2"><RadioGroupItem value="any" id="r-any" /><Label htmlFor="r-any" className="font-normal">Any route (no filter)</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="origin" id="r-or" /><Label htmlFor="r-or" className="font-normal">Origin-based</Label></div>
            {draft.routeMode === "origin" && (
              <div className="pl-6 flex flex-wrap gap-1.5">
                {DOMESTIC_CITIES.map(c => (
                  <button key={c} type="button" onClick={() => toggleCity("origins", c)}
                    className={cn("px-2.5 py-1 text-xs rounded border",
                      draft.origins?.includes(c) ? "bg-primary border-primary text-primary-foreground" : "bg-white border-slate-300 text-slate-700")}>{c}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2"><RadioGroupItem value="destination" id="r-dest" /><Label htmlFor="r-dest" className="font-normal">Destination-based</Label></div>
            {draft.routeMode === "destination" && (
              <div className="pl-6 flex flex-wrap gap-1.5">
                {[...DOMESTIC_CITIES, ...INTL_CITIES].map(c => (
                  <button key={c} type="button" onClick={() => toggleCity("destinations", c)}
                    className={cn("px-2.5 py-1 text-xs rounded border",
                      draft.destinations?.includes(c) ? "bg-primary border-primary text-primary-foreground" : "bg-white border-slate-300 text-slate-700")}>{c}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2"><RadioGroupItem value="pair" id="r-pair" /><Label htmlFor="r-pair" className="font-normal">Specific route pair</Label></div>
            {draft.routeMode === "pair" && (
              <div className="pl-6 space-y-2">
                {pairs.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Select value={p.from} onValueChange={(v) => { const n = [...pairs]; n[i] = { ...n[i], from: v }; setPairs(n); set({ pairs: n }); }}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{ALL_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <span className="text-slate-400">→</span>
                    <Select value={p.to} onValueChange={(v) => { const n = [...pairs]; n[i] = { ...n[i], to: v }; setPairs(n); set({ pairs: n }); }}>
                      <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{ALL_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    {pairs.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { const n = pairs.filter((_, j) => j !== i); setPairs(n); set({ pairs: n }); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
                {pairs.length < 5 && (
                  <button type="button" onClick={() => { const n = [...pairs, { from: "DEL", to: "BOM" }]; setPairs(n); set({ pairs: n }); }}
                    className="text-xs text-primary hover:underline">+ Add another route pair</button>
                )}
              </div>
            )}
          </RadioGroup>
        </Section>
        <Separator />

        {/* SECTION 5 */}
        <Section>
          <SectionHeader title="5. Date & Time Filters" hint="Restrict by booking date, travel date, and weekdays" />
          <p className="text-sm text-slate-600 mb-3">When is this rule active?</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Switch checked={restrictBooking} onCheckedChange={setRestrictBooking} />
              <Label className="font-normal">Restrict by booking date</Label>
            </div>
            {restrictBooking && (
              <div className="pl-10 flex items-center gap-2 text-sm">
                Bookings made between <Input type="date" className="w-40" /> and <Input type="date" className="w-40" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Switch checked={restrictTravel} onCheckedChange={setRestrictTravel} />
              <Label className="font-normal">Restrict by travel date</Label>
            </div>
            {restrictTravel && (
              <div className="pl-10 flex items-center gap-2 text-sm">
                For travel between <Input type="date" className="w-40" /> and <Input type="date" className="w-40" />
              </div>
            )}
            <div>
              <Label>Days of week</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {DAYS.map(d => {
                  const on = days.includes(d);
                  return (
                    <button key={d} type="button" onClick={() => setDays(on ? days.filter(x => x !== d) : [...days, d])}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border",
                        on ? "bg-primary border-primary text-primary-foreground" : "bg-white border-slate-300 text-slate-700")}>{d}</button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Leave all unchecked to apply on all days</p>
            </div>
          </div>
        </Section>
        <Separator />

        {/* SECTION 6 */}
        <Section>
          <SectionHeader title="6. Markup Value" hint="How much to add on top of the supplier net fare" />
          <p className="text-sm text-slate-600 mb-3">Define the markup amount</p>
          <div className="inline-flex rounded-md border border-slate-200 overflow-hidden mb-4">
            {([
              ["Flat", "Flat Amount"], ["Percentage", "Percentage"], ["PerPax", "Per Passenger"], ["FlatPct", "Flat + Percentage"],
            ] as [MarkupType, string][]).map(([k, l]) => (
              <button key={k} type="button" onClick={() => set({ markupType: k })}
                className={cn("px-3 py-2 text-xs font-medium transition-colors border-r border-slate-200 last:border-r-0",
                  draft.markupType === k ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50")}>
                {l}
              </button>
            ))}
          </div>

          {draft.markupType === "Flat" && (
            <div className="space-y-3">
              <div className="max-w-xs"><Label>Amount</Label>
                <div className="flex items-center gap-2"><span className="text-slate-500">₹</span>
                  <Input type="number" value={draft.flatAmount ?? 0} onChange={(e) => set({ flatAmount: Number(e.target.value) })} />
                </div>
              </div>
              <ApplyModeRadio value={draft.applyMode} onChange={(v) => set({ applyMode: v })}
                helper="For a DEL→BOM→CCU multi-city, per sector = ₹300 × 2 sectors = ₹600 total" />
            </div>
          )}
          {draft.markupType === "Percentage" && (
            <div className="space-y-3">
              <div className="max-w-xs"><Label>% of net fare</Label>
                <Input type="number" step="0.1" value={draft.pctAmount ?? 0} onChange={(e) => set({ pctAmount: Number(e.target.value) })} />
              </div>
              <ApplyModeRadio value={draft.applyMode} onChange={(v) => set({ applyMode: v })}
                helper="For a ₹10,000 fare at 3% = ₹300 markup" />
            </div>
          )}
          {draft.markupType === "PerPax" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Adult ₹</Label><Input type="number" defaultValue={draft.perPax?.adult ?? 300}
                  onChange={(e) => set({ perPax: { ...(draft.perPax ?? { adult: 0, child: 0, infant: 0 }), adult: Number(e.target.value) } })} /></div>
                <div><Label>Child (2–11) ₹</Label><Input type="number" defaultValue={draft.perPax?.child ?? 200}
                  onChange={(e) => set({ perPax: { ...(draft.perPax ?? { adult: 0, child: 0, infant: 0 }), child: Number(e.target.value) } })} /></div>
                <div><Label>Infant (&lt;2) ₹</Label><Input type="number" defaultValue={draft.perPax?.infant ?? 0}
                  onChange={(e) => set({ perPax: { ...(draft.perPax ?? { adult: 0, child: 0, infant: 0 }), infant: Number(e.target.value) } })} /></div>
              </div>
              <ApplyModeRadio value={draft.applyMode} onChange={(v) => set({ applyMode: v })} />
            </div>
          )}
          {draft.markupType === "FlatPct" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <div><Label>Base flat ₹</Label><Input type="number" value={draft.flatAmount ?? 0} onChange={(e) => set({ flatAmount: Number(e.target.value) })} /></div>
                <div><Label>Percentage %</Label><Input type="number" step="0.1" value={draft.pctAmount ?? 0} onChange={(e) => set({ pctAmount: Number(e.target.value) })} /></div>
              </div>
              <p className="text-xs text-slate-500">₹150 base + 1.5% = on ₹10,000 fare → ₹150 + ₹150 = ₹300 total</p>
              <ApplyModeRadio value={draft.applyMode} onChange={(v) => set({ applyMode: v })} />
            </div>
          )}

          {isRT && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">For round-trips, charge markup:</p>
              <RadioGroup defaultValue="booking" className="flex gap-6">
                <div className="flex items-center gap-2"><RadioGroupItem value="booking" id="rt-b" /><Label htmlFor="rt-b" className="font-normal text-sm">Once per booking</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="sector" id="rt-s" /><Label htmlFor="rt-s" className="font-normal text-sm">Per sector (outbound + return each)</Label></div>
              </RadioGroup>
            </div>
          )}
          {isMC && (
            <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
              <p className="text-sm font-medium text-slate-700">For multi-city, charge markup:</p>
              <RadioGroup defaultValue="sector" className="space-y-2">
                <div className="flex items-center gap-2"><RadioGroupItem value="sector" id="mc-s" /><Label htmlFor="mc-s" className="font-normal text-sm">Per sector (recommended)</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="booking" id="mc-b" /><Label htmlFor="mc-b" className="font-normal text-sm">Flat per booking</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="capped" id="mc-c" /><Label htmlFor="mc-c" className="font-normal text-sm">Per sector with max cap</Label>
                  <Input type="number" placeholder="max ₹" className="w-28 h-8" value={draft.maxCap ?? ""} onChange={(e) => set({ maxCap: Number(e.target.value) })} />
                </div>
              </RadioGroup>
            </div>
          )}
        </Section>
        <Separator />

        {/* SECTION 7 */}
        <Section>
          <SectionHeader title="7. Caps, Limits & Agent Permissions" hint="Guard rails and what the downstream agent can override" />
          <p className="text-sm text-slate-600 mb-3">Guard rails and agent control</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Minimum markup ₹</Label>
              <Input type="number" value={draft.minMarkup ?? ""} onChange={(e) => set({ minMarkup: Number(e.target.value) || undefined })} />
              <p className="text-[11px] text-slate-500 mt-1">Markup will never go below this</p>
            </div>
            <div>
              <Label>Maximum markup ₹</Label>
              <Input type="number" value={draft.maxMarkup ?? ""} onChange={(e) => set({ maxMarkup: Number(e.target.value) || undefined })} />
              <p className="text-[11px] text-slate-500 mt-1">Markup will never exceed this</p>
            </div>
            <div>
              <Label>Max markup per passenger ₹</Label>
              <Input type="number" value={draft.maxPerPax ?? ""} onChange={(e) => set({ maxPerPax: Number(e.target.value) || undefined })} />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Switch checked={draft.allowAgentTopUp} onCheckedChange={(c) => set({ allowAgentTopUp: c })} />
              <Label className="font-normal">Allow agent to add their own markup on top</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={draft.allowAgentWaive} onCheckedChange={(c) => set({ allowAgentWaive: c })} />
              <Label className="font-normal">Allow agent to reduce or waive their markup</Label>
            </div>
          </div>
        </Section>
      </div>

      <div className="flex items-center justify-between p-5 border-t border-slate-200 bg-slate-50/40 rounded-b-xl">
        <button onClick={() => { onReset(); toast("Form reset"); }} className="text-sm text-slate-500 hover:text-slate-700">Reset form</button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" onClick={() => onSave("Draft")}>Save as Draft</Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => onSave("Active")}>Save &amp; Activate Rule</Button>
        </div>
      </div>
    </section>
  );
}

function ApplyModeRadio({ value, onChange, helper }: { value: "booking" | "sector"; onChange: (v: "booking" | "sector") => void; helper?: string }) {
  return (
    <div>
      <p className="text-sm text-slate-600 mb-1.5">Apply this markup</p>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as "booking" | "sector")} className="flex gap-6">
        <div className="flex items-center gap-2"><RadioGroupItem value="booking" id="am-b" /><Label htmlFor="am-b" className="font-normal text-sm">Per booking</Label></div>
        <div className="flex items-center gap-2"><RadioGroupItem value="sector" id="am-s" /><Label htmlFor="am-s" className="font-normal text-sm">Per sector</Label></div>
      </RadioGroup>
      {helper && <p className="text-[11px] text-slate-500 mt-1.5">{helper}</p>}
    </div>
  );
}
