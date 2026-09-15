export default function AmbientBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
      {/* subtle film grain */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.16,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="noctreelGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={3}
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.4 0.4 0.4 0 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noctreelGrain)" />
      </svg>

      {/* soft vignette drawing the eye toward the center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(35,40,56,0.35), transparent 70%)",
        }}
      />
    </div>
  );
}
