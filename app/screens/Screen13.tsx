"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen13({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);

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

      <div className="relative flex h-full w-full max-w-3xl flex-col items-center justify-center gap-4">
        <div className="star-crawl-container">
          <div className="star-crawl">
            <div className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.3em] text-yellow-200/90">
              Episode XIII<br />
              The Last Two Humans Left
            </div>

            <p className="mb-4 text-sm leading-relaxed text-yellow-100/90">
              The world has ended in the most inconveniently cinematic way
              possible. Cities have crumbled, internet connections have
              vanished, and yet somehow we're the miracle survivors. Out of eight billion people, it&apos;s just you and me
              left, floating through the after‑credits scene of humanity.
            </p>

            <p className="mb-4 text-sm leading-relaxed text-yellow-100/90">
              In the infinite void of space, our mission is quite simple: salvage humanity from the brink of extinction, and repopulate the Earth with our species (+ going on free trips anywhere by car).
            </p>

            <p className="mb-4 text-sm leading-relaxed text-yellow-100/90">
              Somewhere out there, distant satellites are still quietly
              orbiting, carrying the last selfies and playlists of a civilization
              that never thought the credits would roll this fast. Down here,
              it&apos;s just our footsteps, our bad jokes, and a planet waiting
              to see what we do next.
            </p>

            <p className="mb-8 text-sm leading-relaxed text-yellow-100/90">
              Sooooo in that scenario, clearly you'd decide to date me, right?
            </p>

            <div className="mt-4 flex flex-col items-center gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <button
                  key={`yes-top-${i}`}
                  type="button"
                  onClick={handleYes}
                  className="w-40 rounded-full bg-yesGreen px-6 py-2 text-sm font-semibold tracking-wide text-emerald-950 shadow-md shadow-emerald-500/60 transition hover:bg-green-600"
                >
                  Yes
                </button>
              ))}

              <button
                type="button"
                onClick={handleNo}
                className="w-24 rounded-full border border-red-200/80 bg-red-800/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-red-50 shadow-md shadow-black/70 transition hover:bg-red-600"
              >
                No
              </button>

              {[0, 1, 2, 3].map((i) => (
                <button
                  key={`yes-bottom-${i}`}
                  type="button"
                  onClick={handleYes}
                  className="w-40 rounded-full bg-yesGreen px-6 py-2 text-sm font-semibold tracking-wide text-emerald-950 shadow-md shadow-emerald-500/60 transition hover:bg-green-600"
                >
                  Yes
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleYes}
          className="mt-2 rounded-full bg-yesGreen px-8 py-2 text-sm font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-green-600 active:translate-y-[1px]"
        >
          Skip and Say Yes
        </button>
      </div>
    </section>
  );
}

