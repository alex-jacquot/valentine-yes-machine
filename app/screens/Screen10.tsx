"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

type MovingYes = {
  id: number;
  x: number; // 0–100%
  y: number; // 0–100%
  vx: number; // % per second
  vy: number;
  rotate: number;
  scale: number;
};

type MovingNo = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function Screen10({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [yesDots, setYesDots] = useState<MovingYes[]>(() =>
    Array.from({ length: 70 }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() * 10 - 5) * 0.7,
      vy: (Math.random() * 10 - 5) * 0.7,
      rotate: Math.random() * 40 - 20,
      scale: 0.9 + Math.random() * 2.1,
    }))
  );
  const [noDot, setNoDot] = useState<MovingNo>(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    vx: (Math.random() * 10 - 5) * 1.2,
    vy: (Math.random() * 10 - 5) * 1.2,
  }));

  const lastTimeRef = useRef<number | null>(null);

  const handleYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  const handleNo = () => {
    onNo();
  };

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  // Animation loop to move Yes and No buttons; wrapping around screen edges.
  useEffect(() => {
    let frameId: number;

    const step = (time: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
        frameId = requestAnimationFrame(step);
        return;
      }

      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setYesDots((prev) =>
        prev.map((dot) => {
          let x = dot.x + dot.vx * dt;
          let y = dot.y + dot.vy * dt;
          if (x < 0) x += 100;
          if (x > 100) x -= 100;
          if (y < 0) y += 100;
          if (y > 100) y -= 100;
          return { ...dot, x, y };
        })
      );

      setNoDot((prev) => {
        let x = prev.x + prev.vx * dt;
        let y = prev.y + prev.vy * dt;
        if (x < 0) x += 100;
        if (x > 100) x -= 100;
        if (y < 0) y += 100;
        if (y > 100) y -= 100;
        return { ...prev, x, y };
      });

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="screen relative flex h-full w-full items-center justify-center px-4 py-4">
      {burstId !== null && (
        <div className="confetti-layer">
          {Array.from({ length: 56 }).map((_, index) => {
            const dx = (Math.random() - 0.5) * 200;
            const dy = Math.random() * 200 + 40;
            return (
              <span
                key={`${burstId}-${index}`}
                className="confetti-piece"
                style={
                  {
                    "--dx": dx,
                    "--dy": dy,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
        <p className="mx-7 max-w-xl text-center text-sm font-medium text-pink-100/80 sm:text-base">
          Look, you&apos;re outnumbered.
        </p>
      </div>

      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-black/40 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
        {yesDots.map((dot) => (
          <button
            key={dot.id}
            type="button"
            onClick={handleYes}
            className="absolute z-20 inline-flex origin-center -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full bg-yesGreen/95 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-950 shadow-md shadow-black/70 hover:bg-green-500"
            style={
              {
                top: `${dot.y}%`,
                left: `${dot.x}%`,
                transform: `translate(-50%, -50%) rotate(${dot.rotate}deg) scale(${dot.scale})`,
              } as CSSProperties
            }
          >
            Yes
          </button>
        ))}

        <button
          type="button"
          onClick={handleNo}
          className="absolute z-10 inline-flex -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full bg-red-700 px-3 py-1 text-[0.55rem] font-semibold tracking-[0.16em] text-red-50 shadow-md shadow-black/80 hover:bg-red-500"
          style={
            {
              top: `${noDot.y}%`,
              left: `${noDot.x}%`,
              transform: "translate(-50%, -50%)",
              transition: "top 20ms linear, left 20ms linear",
            } as CSSProperties
          }
        >
          No
        </button>
      </div>
    </section>
  );
}

