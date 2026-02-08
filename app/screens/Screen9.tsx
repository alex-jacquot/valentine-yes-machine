"use client";

import { useEffect, useMemo, useState, type CSSProperties, KeyboardEvent } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen9({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [guess, setGuess] = useState("");

  const handleYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  const normalized = guess.trim().toLowerCase();

  const submitGuess = () => {
    if (normalized === "yes") {
      handleYes();
    } else if (normalized === "no") {
      onNo();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submitGuess();
    }
  };

  return (
    <section className="screen flex h-full w-full items-center justify-center px-4 sm:px-6">
      <div className="relative flex w-full max-w-3xl flex-col items-center justify-center gap-6 text-center">
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
          Guess what movie it is.
        </p>

        <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl bg-black/30 p-4 shadow-lg shadow-black/60 sm:flex-row sm:gap-6">
          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-pink-200/20 bg-black/60 sm:h-48 sm:w-1/2">
            <img
              src="/yesman.jpg"
              alt="Poster from the movie 'Yes Man'"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex w-full flex-1 flex-col items-center gap-3 text-pink-50 sm:items-start">
            <p className="text-sm sm:text-base">
              Title hint: <span className="font-semibold">_____ Man</span>
            </p>
            <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-start">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-28 rounded-lg border border-pink-200/60 bg-black/40 px-3 py-1.5 text-center text-sm text-pink-50 outline-none ring-0 transition focus:border-pink-300 focus:bg-black/60 focus:shadow-[0_0_0_1px_rgba(251,207,232,0.6)]"
                placeholder="_____"
              />
              <button
                type="button"
                onClick={submitGuess}
                className="rounded-full border border-pink-200/60 bg-pink-900/70 px-4 py-1.5 text-xs font-medium text-pink-50 shadow-md shadow-black/70 transition hover:bg-pink-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <button
          className="rounded-full bg-yesGreen px-10 py-3 text-lg font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:translate-y-[1px] hover:bg-green-600 hover:shadow-emerald-400/60 active:translate-y-[2px]"
          type="button"
          onClick={handleYes}
        >
          Yes (you can still just click me)
        </button>
      </div>
    </section>
  );
}

