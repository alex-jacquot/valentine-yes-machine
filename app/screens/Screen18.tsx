"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

const FLASHLIGHT_RADIUS = 30; 
const FLASHLIGHT_SOFT = 15;

// No button zone (bottom-left): no Yes may overlap this rect (in %)
const NO_ZONE = { left: 0, right: 14, top: 80, bottom: 100 };

type ScatterYes = {
  left: number;
  top: number;
  scale: number;
  rotation: number;
  shape: "circle" | "rounded" | "pill" | "square";
};

function overlapsNoZone(centerX: number, centerY: number, halfSize: number): boolean {
  const left = centerX - halfSize;
  const right = centerX + halfSize;
  const top = centerY - halfSize;
  const bottom = centerY + halfSize;
  const { left: nL, right: nR, top: nT, bottom: nB } = NO_ZONE;
  return !(right < nL || left > nR || bottom < nT || top > nB);
}

function generateScatterYes(): ScatterYes[] {
  const out: ScatterYes[] = [];
  const shapes: ScatterYes["shape"][] = ["circle", "rounded", "pill", "square"];
  const baseSize = 5; // % approximate half-size for overlap check
  let attempts = 0;
  const maxAttempts = 200;
  while (out.length < 100 && attempts < maxAttempts) {
    attempts++;
    const left = 4 + Math.random() * 88;
    const top = 12 + Math.random() * 72;
    const scale = 0.45 + Math.random() * 1.9;
    const rotation = (Math.random() - 0.5) * 50;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const halfSize = baseSize * scale;
    if (overlapsNoZone(left, top, halfSize)) continue;
    out.push({ left, top, scale, rotation, shape });
  }
  return out;
}

export function Screen18({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const triggerYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  const triggerNo = () => onNo();

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setMouse({ x: e.clientX, y: e.clientY });
  }, []);

  const scatterYes = useMemo(() => generateScatterYes(), []);

  useEffect(() => {
    if (burstId === null) return;
    const t = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(t);
  }, [burstId]);

  const shapeClass = (shape: ScatterYes["shape"]) => {
    switch (shape) {
      case "circle":
        return "rounded-full px-4 py-3";
      case "pill":
        return "rounded-full px-6 py-2";
      case "rounded":
        return "rounded-2xl px-4 py-2.5";
      case "square":
        return "rounded-md px-3 py-2";
      default:
        return "rounded-full px-4 py-2";
    }
  };

  // Default light position (center) until user moves
  const cx = mouse?.x ?? (typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const cy = mouse?.y ?? (typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  const overlayStyle: CSSProperties = {
    background: `radial-gradient(circle ${FLASHLIGHT_RADIUS + FLASHLIGHT_SOFT}px at ${cx}px ${cy}px, transparent 0%, transparent ${FLASHLIGHT_RADIUS}px, rgba(0,0,0,0.985) ${FLASHLIGHT_RADIUS + FLASHLIGHT_SOFT}px)`,
  };

  return (
    <section
      className="screen relative flex h-full w-full items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {burstId !== null && (
        <div className="confetti-layer">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={`${burstId}-${i}`}
              className="confetti-piece"
              style={
                {
                  "--dx": (Math.random() - 0.5) * 140,
                  "--dy": Math.random() * 100 + 20,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Dark overlay with flashlight cutout – almost nothing visible outside the circle */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={overlayStyle}
        aria-hidden
      />

      {/* Hint text – always visible on top of the dark overlay */}
      <p
        className="pointer-events-none absolute top-6 left-1/2 z-20 -translate-x-1/2 text-center text-xs font-medium text-pink-200/90 sm:text-sm"
        aria-hidden
      >
        Clear your mind and click Yes.
      </p>

      {/* Content – all interactive below overlay (z-0); overlay is pointer-events-none so moves/clicks pass through */}
      <div
        className="relative z-0 flex h-full w-full flex-col items-center justify-center"
        onMouseMove={handleMouseMove}
      >
        {/* Main Yes with arrows pointing at it */}
        <div className="relative flex items-center justify-center">
          {/* Arrows pointing inward */}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl text-pink-200/90" style={{ transform: "translate(-50%, 0) rotate(-90deg)" }}>▼</span>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl text-pink-200/90" style={{ transform: "translate(-50%, 0) rotate(90deg)" }}>▼</span>
          <span className="absolute -left-10 top-1/2 -translate-y-1/2 text-2xl text-pink-200/90 rotate-0">▶</span>
          <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-2xl text-pink-200/90" style={{ transform: "translate(0, -50%) rotate(180deg)" }}>▶</span>
          <button
            type="button"
            onClick={triggerYes}
            className="rounded-full bg-yesGreen px-10 py-4 text-lg font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/50 transition hover:bg-green-600 active:translate-y-[1px]"
          >
            Yes
          </button>
        </div>

       
        {/* Scattered Yes – random positions, scales, angles; none overlap No */}
        {scatterYes.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={triggerYes}
            className={`absolute -translate-x-1/2 -translate-y-1/2 text-xs font-semibold tracking-wide text-emerald-950 shadow-md transition hover:bg-green-500 active:scale-95 ${shapeClass(item.shape)}`}
            style={
              {
                left: `${item.left}%`,
                top: `${item.top}%`,
                transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              } as CSSProperties
            }
          >
            Yes
          </button>
        ))}

        {/* Hidden No near bottom left */}
        <button
          type="button"
          onClick={triggerNo}
          className="absolute bottom-[30%] left-[11%] rounded-full border border-red-200/50 bg-red-900/80 px-4 py-1.5 text-xs font-medium text-red-100 shadow-lg shadow-black/60 transition hover:bg-red-800"
        >
          No
        </button>
      </div>
    </section>
  );
}
