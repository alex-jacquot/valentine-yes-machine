"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen2({ onYes, onNo }: Props) {
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
    <section className="screen flex h-full w-full items-center justify-center px-6">
      <div className="relative flex w-full max-w-xl flex-col items-center justify-center gap-6 text-center">
        {burstId !== null && (
          <div className="confetti-layer">
            {Array.from({ length: 22 }).map((_, index) => {
              const dx = (Math.random() - 0.5) * 140;
              const dy = Math.random() * 100 + 20;
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

        <p className="text-balance text-2xl font-semibold text-pink-50 sm:text-3xl">
          Haha, so silly of you... Click YES.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            className="rounded-full bg-yesGreen px-10 py-4 text-lg font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:translate-y-[1px] hover:bg-green-600 hover:shadow-emerald-400/60 active:translate-y-[2px]"
            type="button"
            onClick={handleYes}
          >
            Yes
          </button>
          <button
            className="rounded-full border border-red-200/70 bg-red-800/70 px-6 py-2 text-sm font-medium text-red-50 shadow-md shadow-black/50 transition hover:bg-red-700 active:translate-y-[1px]"
            type="button"
            onClick={onNo}
          >
            No
          </button>
        </div>
      </div>
    </section>
  );
}

