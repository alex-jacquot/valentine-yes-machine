"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen7({ onYes, onNo }: Props) {
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
          Guess what? I removed the{" "}
          <button
            type="button"
            onClick={onNo}
            className="relative mx-1 inline-flex items-center justify-center rounded-sm px-1 text-pink-100 transition hover:text-red-300 hover:drop-shadow-[0_0_16px_rgba(248,113,113,0.9)] focus-visible:outline-none"
          >
            No
          </button>{" "}
          button. Good luck trying not pressing Yes.
        </p>

        <button
          className="rounded-full bg-yesGreen px-10 py-4 text-lg font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:translate-y-[1px] hover:bg-green-600 hover:shadow-emerald-400/60 active:translate-y-[2px]"
          type="button"
          onClick={handleYes}
        >
          Yes
        </button>
      </div>
    </section>
  );
}

