import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fmtINR, type FlightMarkupRule } from "./data";
import { computeMarkup, type PreviewInput } from "./utils";

interface Props {
  activeRule: FlightMarkupRule | null;
}

const tripOptions = ["One-way", "Round-trip", "Multi-city"] as const;

export function PreviewCalculator({ activeRule }: Props) {
  const [input, setInput] = useState<PreviewInput>({
    netFare: 8500, tripType: "One-way", sectors: 2, adult: 1, child: 0, infant: 0,
  });
  const [agentMarkup, setAgentMarkup] = useState(200);

  const platformMarkup = useMemo(() => computeMarkup(activeRule, input), [activeRule, input]);
  const agentCost = input.netFare + platformMarkup;
  const customerPays = agentCost + agentMarkup;
  const sectorsLabel = input.tripType === "Round-trip" ? "× 2 sectors" : input.tripType === "Multi-city" ? `× ${input.sectors} sectors` : "";

  const setNum = (k: keyof PreviewInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(s => ({ ...s, [k]: Number(e.target.value) || 0 }));

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-primary">Live Markup Preview</h2>
        <p className="text-xs text-slate-500 mt-0.5">See exactly what each party pays and earns</p>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <Label className="text-xs">Net fare from supplier ₹</Label>
          <Input type="number" value={input.netFare} onChange={setNum("netFare")} />
        </div>
        <div>
          <Label className="text-xs">Trip type</Label>
          <div className="inline-flex rounded-md border border-slate-200 overflow-hidden w-full">
            {tripOptions.map(t => (
              <button key={t} type="button" onClick={() => setInput(s => ({ ...s, tripType: t }))}
                className={cn("flex-1 px-2 py-1.5 text-xs font-medium",
                  input.tripType === t ? "bg-primary text-primary-foreground" : "bg-white text-slate-600 hover:bg-slate-50")}>{t}</button>
            ))}
          </div>
        </div>
        {input.tripType === "Multi-city" && (
          <div>
            <Label className="text-xs">Number of sectors</Label>
            <Input type="number" min={2} max={6} value={input.sectors} onChange={setNum("sectors")} />
          </div>
        )}
        <div>
          <Label className="text-xs">Passengers</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {(["adult", "child", "infant"] as const).map(k => (
              <div key={k} className="flex items-center gap-1 rounded-md border border-slate-200 p-1">
                <span className="text-[10px] uppercase text-slate-500 ml-1 w-12">{k}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setInput(s => ({ ...s, [k]: Math.max(0, (s[k] as number) - 1) }))}>−</Button>
                <span className="text-sm font-medium w-4 text-center">{input[k] as number}</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setInput(s => ({ ...s, [k]: (s[k] as number) + 1 }))}>+</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 overflow-hidden text-sm">
          <Row label="Net fare (from supplier)" value={fmtINR(input.netFare)} tone="muted" />
          <Row label={`Platform markup ${activeRule ? `(${activeRule.name})` : ""}`} value={`+${fmtINR(platformMarkup)}`} tone="blue" />
          <Divider />
          <Row label="Agent sees (their cost)" value={fmtINR(agentCost)} tone="dark" bold />
          <Row label="Agent's own markup" value={
            <span className="flex items-center gap-1">+
              <input type="number" value={agentMarkup} onChange={(e) => setAgentMarkup(Number(e.target.value) || 0)}
                className="w-20 text-right bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-600" />
            </span>
          } tone="purple" />
          <Divider />
          <Row label="Customer pays" value={fmtINR(customerPays)} tone="green" bold size="lg" />
          {sectorsLabel && <Row label="Multi-sector note" value={sectorsLabel} tone="muted" small />}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-amber-700">Platform earns</p>
            <p className="text-base font-bold text-amber-900">{fmtINR(platformMarkup)}</p>
          </div>
          <div className="rounded-md bg-teal-50 border border-teal-200 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-teal-700">Agent earns</p>
            <p className="text-base font-bold text-teal-900">{fmtINR(agentMarkup)}</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 pt-1">
          Agent's markup is an estimate. Each agent sets their own markup separately.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value, tone, bold, size, small }: {
  label: string; value: React.ReactNode;
  tone: "muted" | "blue" | "dark" | "purple" | "green";
  bold?: boolean; size?: "lg"; small?: boolean;
}) {
  const toneMap = {
    muted: "bg-slate-50 text-slate-600",
    blue: "bg-primary/10 text-primary",
    dark: "bg-slate-900 text-white",
    purple: "bg-purple-50 text-purple-800",
    green: "bg-emerald-50 text-emerald-800",
  };
  return (
    <div className={cn("flex items-center justify-between px-3 py-2", toneMap[tone], small && "text-xs py-1.5")}>
      <span className={cn(bold && "font-semibold")}>{label}</span>
      <span className={cn(bold && "font-bold", size === "lg" && "text-lg")}>{value}</span>
    </div>
  );
}
function Divider() { return <div className="h-px bg-slate-200" />; }
