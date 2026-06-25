import { useMemo, useState } from "react";
import type { Seat } from "@/lib/search-data";
import { generateSeatMap } from "@/lib/search-data";
import { fmtINR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const COLS = ["A", "B", "C", "D", "E", "F"];

export function SeatMap({
  flightId,
  passengers,
  selected,
  onChange,
}: {
  flightId: string;
  passengers: number;
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const seats = useMemo(() => generateSeatMap(flightId), [flightId]);
  const byRow = useMemo(() => {
    const m: Record<number, Seat[]> = {};
    seats.forEach(s => { (m[s.row] ||= []).push(s); });
    return m;
  }, [seats]);
  const rows = Object.keys(byRow).map(Number).sort((a, b) => a - b);

  const toggle = (s: Seat) => {
    if (s.status === "occupied" || s.status === "blocked") return;
    if (selected.includes(s.id)) {
      onChange(selected.filter(x => x !== s.id));
    } else if (selected.length < passengers) {
      onChange([...selected, s.id]);
    }
  };

  const total = selected.reduce((acc, id) => acc + (seats.find(s => s.id === id)?.price ?? 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4">
      <div className="rounded-xl border bg-gradient-to-b from-muted/30 to-background p-4">
        <Legend />
        <div className="mx-auto max-w-md mt-4">
          <div className="mx-auto h-8 w-32 rounded-t-[40%] border-2 border-dashed border-muted-foreground/40 text-center text-[10px] uppercase tracking-widest text-muted-foreground pt-1">Cockpit</div>
          <div className="mt-3 grid gap-1.5">
            <div className="grid grid-cols-[28px_repeat(3,1fr)_24px_repeat(3,1fr)] gap-1.5 text-[10px] text-muted-foreground font-medium">
              <span />
              {COLS.slice(0,3).map(c => <span key={c} className="text-center">{c}</span>)}
              <span />
              {COLS.slice(3).map(c => <span key={c} className="text-center">{c}</span>)}
            </div>
            {rows.map(r => (
              <div key={r} className="grid grid-cols-[28px_repeat(3,1fr)_24px_repeat(3,1fr)] gap-1.5 items-center">
                <span className="text-[10px] text-muted-foreground text-right pr-1">{r}</span>
                {byRow[r].slice(0, 3).map(s => <SeatBtn key={s.id} seat={s} selected={selected.includes(s.id)} onClick={() => toggle(s)} />)}
                <span className="text-[9px] text-muted-foreground/60 text-center">{r === 12 ? "EXIT" : ""}</span>
                {byRow[r].slice(3).map(s => <SeatBtn key={s.id} seat={s} selected={selected.includes(s.id)} onClick={() => toggle(s)} />)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3 text-sm h-fit">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Your seats</p>
          <p className="font-medium mt-0.5">{selected.length}/{passengers} selected</p>
        </div>
        <div className="space-y-1.5 min-h-[60px]">
          {selected.length === 0 && <p className="text-xs text-muted-foreground italic">Tap a green seat to assign passenger.</p>}
          {selected.map((id, i) => {
            const s = seats.find(x => x.id === id)!;
            return (
              <div key={id} className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5">
                <span><span className="text-xs text-muted-foreground">P{i+1}</span> · <span className="font-medium">{id}</span></span>
                <span className="text-xs">{s.price ? `+${fmtINR(s.price)}` : "Free"}</span>
              </div>
            );
          })}
        </div>
        <div className="pt-2 border-t flex justify-between font-medium">
          <span>Seat charges</span><span>{fmtINR(total)}</span>
        </div>
      </div>
    </div>
  );
}

function SeatBtn({ seat, selected, onClick }: { seat: Seat; selected: boolean; onClick: () => void }) {
  const base = "h-7 rounded-md text-[10px] font-medium transition-all flex items-center justify-center border";
  let cls = "";
  if (selected) cls = "bg-primary text-primary-foreground border-primary scale-105 shadow";
  else if (seat.status === "occupied") cls = "bg-muted text-muted-foreground/40 border-transparent cursor-not-allowed";
  else if (seat.status === "premium") cls = "bg-gold/15 hover:bg-gold/25 border-gold/40 text-foreground";
  else if (seat.status === "exit") cls = "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/40 text-foreground";
  else if (seat.price > 0) cls = "bg-success-soft hover:bg-success/20 border-success/30 text-foreground";
  else cls = "bg-background hover:bg-success-soft border-border text-foreground";
  return (
    <button onClick={onClick} disabled={seat.status === "occupied"} className={cn(base, cls)} title={`${seat.id}${seat.price ? ` · +${fmtINR(seat.price)}` : ""}`}>
      {selected ? "✓" : seat.col}
    </button>
  );
}

function Legend() {
  const items = [
    { cls: "bg-background border-border", label: "Available" },
    { cls: "bg-success-soft border-success/30", label: "Standard ₹150" },
    { cls: "bg-gold/20 border-gold/40", label: "Premium ₹850" },
    { cls: "bg-blue-500/15 border-blue-500/40", label: "Exit ₹450" },
    { cls: "bg-muted border-transparent", label: "Occupied" },
    { cls: "bg-primary border-primary", label: "Selected" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
      {items.map(i => (
        <div key={i.label} className="flex items-center gap-1.5">
          <span className={cn("h-4 w-4 rounded border", i.cls)} />
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}
