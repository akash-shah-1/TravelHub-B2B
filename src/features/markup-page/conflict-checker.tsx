import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { AGENTS, AIRLINES, ALL_CITIES, type FlightMarkupRule } from "./data";
import { findMatchingRules, type ConflictScenario } from "./utils";

interface Props { rules: FlightMarkupRule[] }

export function ConflictChecker({ rules }: Props) {
  const [s, setS] = useState<ConflictScenario>({
    origin: "DEL", destination: "DXB", tripType: "One-way",
    airline: "6E", cabin: "Economy", travelDate: "2026-09-12", agent: "Sharma Travels",
  });
  const [result, setResult] = useState<FlightMarkupRule[] | null>(null);

  const set = (patch: Partial<ConflictScenario>) => setS(prev => ({ ...prev, ...patch }));

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-[#1E3A8A]">Rule Conflict Checker</h2>
        <p className="text-xs text-slate-500 mt-0.5">Check if a booking scenario matches multiple rules</p>
      </div>
      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Origin">
            <Select value={s.origin} onValueChange={(v) => set({ origin: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ALL_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Destination">
            <Select value={s.destination} onValueChange={(v) => set({ destination: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ALL_CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Trip type">
            <Select value={s.tripType} onValueChange={(v) => set({ tripType: v as never })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="One-way">One-way</SelectItem>
                <SelectItem value="Round-trip">Round-trip</SelectItem>
                <SelectItem value="Multi-city">Multi-city</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Airline">
            <Select value={s.airline} onValueChange={(v) => set({ airline: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AIRLINES.filter(a => a.code !== "ALL").map(a => <SelectItem key={a.code} value={a.code}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Cabin">
            <Select value={s.cabin} onValueChange={(v) => set({ cabin: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="First Class">First Class</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Travel date">
            <Input type="date" value={s.travelDate} onChange={(e) => set({ travelDate: e.target.value })} />
          </Field>
          <Field label="Agent" wide>
            <Select value={s.agent} onValueChange={(v) => set({ agent: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AGENTS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setResult(findMatchingRules(rules, s))}>
          Check Rules
        </Button>

        {result && (
          <div className="pt-2">
            {result.length === 0 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm flex gap-2 items-start">
                <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-red-800">No rule matches</p>
                  <p className="text-red-700 text-xs mt-0.5">Default markup of ₹0 will be applied. Consider adding a fallback rule.</p>
                </div>
              </div>
            )}
            {result.length === 1 && (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm flex gap-2 items-start">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-emerald-800">✓ Rule matched: {result[0].name} (Priority {result[0].priority})</p>
                  <p className="text-emerald-700 text-xs mt-0.5">Markup applied: {result[0].valueLabel}</p>
                </div>
              </div>
            )}
            {result.length > 1 && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="font-medium text-amber-900">{result.length} rules match this scenario:</p>
                </div>
                <ol className="mt-2 space-y-1 text-xs text-amber-900 list-decimal pl-8">
                  {result.map((r, i) => (
                    <li key={r.id}>
                      {r.name} (Priority {r.priority})
                      {i === 0
                        ? <span className="ml-1 font-semibold">← WILL BE APPLIED</span>
                        : <span className="ml-1 text-amber-700">— overridden</span>}
                    </li>
                  ))}
                </ol>
                <p className="text-[11px] text-amber-700 mt-2">Priority {result[0].priority} rule wins. Lower priority rules are ignored.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
