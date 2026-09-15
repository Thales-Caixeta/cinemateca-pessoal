"use client";

import { useRef, useState } from "react";

// Wine (#c2402f) fading into gold (#d4af37) as the rating climbs — a 2 sits
// duller and wine-toned, a 9 burns bright gold. Same two brand colors used
// everywhere else, no unrelated hues.
const WINE: [number, number, number] = [194, 64, 47];
const GOLD: [number, number, number] = [212, 175, 55];

export function ratingColor(v: number) {
  const t = Math.max(0, Math.min(1, v / 10));
  const r = Math.round(WINE[0] + (GOLD[0] - WINE[0]) * t);
  const g = Math.round(WINE[1] + (GOLD[1] - WINE[1]) * t);
  const b = Math.round(WINE[2] + (GOLD[2] - WINE[2]) * t);
  const weight = 0.4 + t * 0.6;
  return `rgba(${r}, ${g}, ${b}, ${weight.toFixed(2)})`;
}

export default function TicketRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [snapping, setSnapping] = useState(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);

  function valueFromClientX(clientX: number) {
    const bar = barRef.current;
    if (!bar) return value;
    const rect = bar.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    return (x / rect.width) * 10;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
    setSnapping(false);
    movedRef.current = false;
    startXRef.current = e.clientX;
    document.body.classList.add("select-none");

    function onMove(ev: PointerEvent) {
      if (Math.abs(ev.clientX - startXRef.current) > 4) {
        movedRef.current = true;
        onChange(Math.round(valueFromClientX(ev.clientX) * 10) / 10);
      }
    }

    function onUp(ev: PointerEvent) {
      setDragging(false);
      setSnapping(true);
      document.body.classList.remove("select-none");
      if (movedRef.current) {
        onChange(Math.round(valueFromClientX(ev.clientX) * 10) / 10);
      } else {
        onChange(Math.round(valueFromClientX(ev.clientX)));
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  const pct = (value / 10) * 100;
  const color = ratingColor(value);
  const label = value <= 0 ? "—" : value >= 10 ? "10" : value.toFixed(1);

  return (
    <div className="grid grid-cols-[68px_1px_1fr] items-center gap-4 bg-white/5 border border-white/10 rounded-lg px-5 py-3.5 w-full min-w-0">
      <span
        className="font-[family-name:var(--font-fraunces)] font-bold text-[28px] leading-none whitespace-nowrap"
        style={{ color: value <= 0 ? "#6b7080" : color }}
      >
        {label}
        {value > 0 && (
          <sup className="text-xs font-medium text-neutral-500 ml-0.5">
            /10
          </sup>
        )}
      </span>

      <div className="self-stretch border-l border-dashed border-white/15" />

      <div className="flex flex-col gap-2">
        <div
          ref={barRef}
          onPointerDown={handlePointerDown}
          className="relative h-6 rounded-md bg-white/10 cursor-pointer overflow-hidden touch-none"
        >
          <div
            className="absolute inset-0 rounded-md"
            style={{
              width: `${pct}%`,
              background: color,
              transition: snapping
                ? "width 0.15s ease-out, background 0.15s ease-out"
                : "none",
            }}
          />
          <div className="absolute inset-0 flex pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 border-r border-[#171b24]/55 last:border-r-0"
              />
            ))}
          </div>
        </div>
        <span className="text-[11px] text-neutral-500 min-h-[1.4em]">
          {dragging ? "release to set" : "tap or drag to rate"}
        </span>
      </div>
    </div>
  );
}
