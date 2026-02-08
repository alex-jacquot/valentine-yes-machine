"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen4({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);

  const handleYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  return (
    <section className="screen relative flex h-full w-full items-stretch justify-stretch px-4 py-4">
      {burstId !== null && (
        <div className="confetti-layer">
          {Array.from({ length: 24 }).map((_, index) => {
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

      <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-6">
        <p className="mx-6 max-w-xl text-center text-sm font-medium text-pink-100/80 sm:text-base">
          Let's see you miss the Yes on that one...
        </p>
      </div>

      <button
        className="flex h-full w-full items-center justify-center rounded-3xl bg-yesGreen text-3xl font-semibold tracking-wide text-emerald-950 shadow-[0_20px_60px_rgba(0,0,0,0.8)] shadow-emerald-500/50 transition hover:bg-green-600 active:translate-y-[1px] active:cursor-grabbing"
        style={{ cursor: "grab" }}
        type="button"
        onClick={handleYes}
      >
        Yes
      </button>
      <button
        className="pointer-events-auto absolute bottom-4 right-4 rounded-full border border-red-200/70 bg-red-900/80 px-3 py-1 text-[0.7rem] font-medium text-red-50 shadow-md shadow-black/70 transition hover:bg-red-700"
        type="button"
        onClick={onNo}
      >
        No
      </button>
    </section>
  );
}

