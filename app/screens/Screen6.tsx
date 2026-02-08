"use client";

import { useEffect, useState, type CSSProperties, KeyboardEvent } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen6({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [noTriggered, setNoTriggered] = useState(false);

  const handleYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const trimmed = answer.trim();
      if (!noTriggered && trimmed === "48") {
        setNoTriggered(true);
        onNo();
      }
    }
  };

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
          Alright then, you can rack your brain solving this math problem or you
          can just, you know, press Yes…
        </p>

        <button
          className="rounded-full bg-yesGreen px-10 py-4 text-lg font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:translate-y-[1px] hover:bg-green-600 hover:shadow-emerald-400/60 active:translate-y-[2px]"
          type="button"
          onClick={handleYes}
        >
          Yes
        </button>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-pink-50/90">
          <span className="text-sm font-medium sm:text-base">
            (26 + 6 − 8) × 2 =
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-20 rounded-lg border border-pink-200/60 bg-black/40 px-3 py-1.5 text-center text-sm text-pink-50 outline-none ring-0 transition focus:border-pink-300 focus:bg-black/60 focus:shadow-[0_0_0_1px_rgba(251,207,232,0.6)]"
            placeholder="?"
          />
          <span className="text-xs text-pink-100/70 sm:text-sm">
            (Press Enter when you&apos;re sure.)
          </span>
        </div>
      </div>
    </section>
  );
}

