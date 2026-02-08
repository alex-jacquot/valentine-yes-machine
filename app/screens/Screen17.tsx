"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen17({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

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

  const handleCheck = () => {
    // Always shake – there is no "correct" answer
    setShakeKey((k) => k + 1);
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
          Time for something extremely unfair:
        </p>

        <div className="w-full rounded-3xl bg-black/40 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-pink-200/80">
            Evaluate the following expression or say Yes:
          </p>

          <div className="mb-4 overflow-x-auto text-left font-mono text-[0.8rem] text-pink-100/90 sm:text-sm">
            <div>
              ∫<sub>0</sub><sup>N</sup>{" "}
              <span className="whitespace-nowrap">
                (3x² + 5x − 7)
                <span
                  className="cursor-pointer hover:text-red-400 hover:drop-shadow-[0_0_10px_rgba(248,113,113,0.9)]"
                  onClick={triggerNo}
                >
                  N0</span>
                e<sup>−x</sup>
                / (1 + e<sup>−x</sup>)
              </span>{" "}
              dx
            </div>
            <div>
              + Σ<sub>k=1</sub><sup>∞</sup>{" "}
              (k! / 2<sup>k²</sup>) · (1 − cos(kπ/3))<sup>k+1</sup>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-pink-100/80 sm:text-[0.8rem]">
                Your answer:
              </span>
              <input
                key={shakeKey}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input-shake w-32 rounded-lg border border-pink-200/70 bg-black/60 px-3 py-1.5 text-center text-xs text-pink-50 outline-none ring-0 focus:border-pink-300 focus:bg-black/80"
              />
              <button
                type="button"
                onClick={handleCheck}
                className="rounded-full border border-pink-200/60 bg-black/40 px-4 py-1.5 text-[0.7rem] font-semibold text-pink-100 shadow-sm shadow-black/70 transition hover:bg-black/70"
              >
                Check
              </button>
              
            </div>
            <button
          type="button"
          onClick={triggerYes}
          className="mt-2 rounded-full bg-yesGreen px-8 py-2.5 text-sm font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-green-600 active:translate-y-[1px]"
        >
          Yes, I give up
        </button>
          </div>
        </div>

        
      </div>
    </section>
  );
}

