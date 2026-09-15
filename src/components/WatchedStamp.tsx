"use client";

import { useId } from "react";

// Wine (#c2402f) fading into gold (#d4af37) as rewatch count climbs —
// same two brand colors everywhere else, no unrelated hues.
const TIERS = [
  { min: 0, ink: "#a3362b", text: "#c2402f", badgeText: "#f6e6de" },
  { min: 10, ink: "#b15330", text: "#c66a37", badgeText: "#f7e9db" },
  { min: 20, ink: "#bd6c32", text: "#cf8339", badgeText: "#f8ecd8" },
  { min: 30, ink: "#c68632", text: "#d69b3a", badgeText: "#3a2c0a" },
  { min: 40, ink: "#cd9d31", text: "#dcae38", badgeText: "#2f2308" },
  { min: 50, ink: "#d4af37", text: "#e3c14a", badgeText: "#2a1f08" },
];

function tierFor(n: number) {
  let chosen = TIERS[0];
  for (const t of TIERS) if (n >= t.min) chosen = t;
  return chosen;
}

export default function WatchedStamp({
  watchedAt,
  timesWatched = 1,
}: {
  watchedAt: string | null;
  timesWatched?: number;
}) {
  const uid = useId().replace(/:/g, "");
  const filterId = `stamp-${uid}`;
  const softWarpId = `soft-${uid}`;
  const maskId = `holes-${uid}`;

  const { ink, text, badgeText } = tierFor(timesWatched);

  const dateLabel = watchedAt
    ? new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
        .format(new Date(watchedAt))
        .replace(/\//g, " · ")
    : "";

  const holeXs = Array.from({ length: 9 }, (_, i) => 42 + i * 19);

  return (
    <svg width="248" height="152" viewBox="12 -2 248 152" aria-label="Watched">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves={3}
            seed={23}
            result="warpNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="warpNoise"
            scale={14}
            result="warped"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves={4}
            seed={5}
            result="grain"
          />
          <feComponentTransfer in="grain" result="grainAlpha">
            <feFuncA type="linear" slope={3.2} intercept={-1.15} />
          </feComponentTransfer>
          <feComposite
            in="warped"
            in2="grainAlpha"
            operator="in"
            result="textured"
          />
          <feGaussianBlur in="textured" stdDeviation="0.35" />
        </filter>
        <filter id={softWarpId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves={2}
            seed={23}
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={4} />
        </filter>
        <mask id={maskId}>
          <rect x="0" y="0" width="270" height="170" fill="white" />
          <g fill="black">
            {holeXs.map((x) => (
              <g key={x}>
                <rect x={x - 4} y={30 - 3.5} width={8} height={7} rx={1.5} />
                <rect x={x - 4} y={130 - 3.5} width={8} height={7} rx={1.5} />
              </g>
            ))}
          </g>
        </mask>
      </defs>

      <g
        opacity={0.14}
        transform="rotate(-4 130 80) translate(-4,4)"
        filter={`url(#${filterId})`}
      >
        <g mask={`url(#${maskId})`}>
          <rect
            x="30"
            y="30"
            width="200"
            height="100"
            fill="none"
            stroke={ink}
            strokeWidth={10}
          />
        </g>
      </g>

      <g transform="rotate(-3 130 80)" filter={`url(#${filterId})`}>
        <g mask={`url(#${maskId})`}>
          <rect
            x="30"
            y="30"
            width="200"
            height="100"
            fill="none"
            stroke={ink}
            strokeWidth={10}
            strokeDasharray="70 4 90 3 100 5 40 2"
          />
        </g>
        <rect
          x="44"
          y="44"
          width="172"
          height="72"
          fill="none"
          stroke={ink}
          strokeWidth={1.5}
          strokeDasharray="90 3 120 4"
        />
      </g>

      <g transform="rotate(-3 130 80)" filter={`url(#${softWarpId})`}>
        <text
          x="130"
          y="80"
          textAnchor="middle"
          fontFamily="var(--font-cinzel), serif"
          fontSize="21"
          fontWeight={700}
          letterSpacing="2"
          fill={text}
          stroke={ink}
          strokeWidth={0.6}
        >
          WATCHED
        </text>
        {dateLabel && (
          <text
            x="130"
            y="102"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="12"
            letterSpacing="3.5"
            fill={text}
          >
            {dateLabel}
          </text>
        )}
      </g>

      {timesWatched >= 2 && (
        <g transform="translate(226, 22) rotate(8)">
          <circle r="18" fill={ink} />
          <circle
            r="18"
            fill="none"
            stroke={badgeText}
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize="15"
            fontWeight={700}
            fill={badgeText}
          >
            ×{timesWatched}
          </text>
        </g>
      )}
    </svg>
  );
}
