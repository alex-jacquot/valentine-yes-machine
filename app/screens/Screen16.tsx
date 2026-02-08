"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen16({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);

  const triggerYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  const triggerNo = () => {
    onNo();
  };

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  // Logically: the *romantically correct* answer is
  // "No, I would NOT be against it", so the No button
  // should count as a Yes in the game logic.

  const handleYesClick = () => {
    // "Yes, I would be against it" → treat as No
    triggerYes();
  };

  const handleNoClick = () => {
    // "No, I would not be against it" → treat as Yes
    triggerNo();
  };

  return (
    <section className="screen relative flex h-full w-full items-center justify-center px-4 py-4">
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

      <div className="relative flex h-full w-full max-w-3xl flex-col items-center justify-center gap-6 text-center">
        <p className="text-balance text-sm font-medium text-pink-100/90 sm:text-base">
          Would you be against the hypothetical scenario of not refusing the idea of not
          going on a date with me, on opposite day, if you had to lie about it ?
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleYesClick}
            className="rounded-full bg-yesGreen px-8 py-3 text-base font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:translate-y-[1px] hover:bg-green-600 hover:shadow-emerald-400/60 active:translate-y-[2px]"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={handleNoClick}
            className="rounded-full border border-red-200/70 bg-red-800/80 px-8 py-3 text-base font-semibold tracking-wide text-red-50 shadow-md shadow-black/70 transition hover:bg-red-600 active:translate-y-[1px]"
          >
            No
          </button>
        </div>
      </div>
    </section>
  );
}

