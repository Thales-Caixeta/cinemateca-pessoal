export default function WatchedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-sm"
      style={{
        color: "#c2402f",
        border: "1px solid #a3362b",
        fontFamily: "var(--font-cinzel), serif",
        letterSpacing: "0.5px",
      }}
    >
      watched
    </span>
  );
}
