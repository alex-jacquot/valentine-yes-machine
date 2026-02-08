"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen11({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  const handleNo = () => {
    setOpen(false);
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

      {!open && (
        <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4 rounded-3xl bg-black/40 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          <p className="text-balance text-sm font-medium text-pink-100/90 sm:text-base">
            Before you try to say No, my highly qualified team of imaginary lawyers
            insists you review a few gentle terms and conditions.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-yesGreen px-8 py-2.5 text-sm font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-green-600 active:translate-y-[1px]"
          >
            Open Terms &amp; Conditions
          </button>
        </div>
      )}

      {open && (
        <>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-xl rounded-3xl bg-[#130017]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.95)]">
            <div className="mb-2 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-wide text-pink-50 sm:text-xl">
                Terms &amp; Conditions
              </h2>
              <button
                type="button"
                onClick={handleNo}
                aria-label="Close"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-pink-200/40 bg-black/40 text-pink-100 shadow-sm shadow-black/70 transition hover:bg-black/70 hover:text-pink-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 max-h-64 space-y-3 overflow-y-auto pr-1 text-left text-sm leading-relaxed text-pink-100/85 sm:text-[0.9rem]">
              <p>
                1. By proceeding, you agree that our first date may contain an
                unreasonable amount of laughter, one (1) shared dessert minimum,
                and at least five (5) instances of eye contact that last
                slightly longer than necessary.
              </p>
              <p>
                2. You acknowledge that saying &quot;I&apos;m not hungry&quot;
                does not waive your right to &quot;just a bite&quot; of my
                food, and that such bites may in fact become &quot;half of
                it.&quot;
              </p>
              <p>
                3. You acknowledge that this website is badass and whoever coded it is a genius deserving of a date.
              </p>
              <p>
                4. You understand that terrible puns, dramatic retellings of
                small inconveniences, and unsolicited playlists are a
                non‑refundable part of the experience.
              </p>
              <p>
                5. Finally, by reaching the end of this incredibly serious legal
                document, you confirm that you&apos;ve already mentally said
                &quot;yes&quot; at least once.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleYes}
                className="rounded-full bg-yesGreen px-6 py-2 text-sm font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-green-600 active:translate-y-[1px]"
              >
                Agree
              </button>
              <button
                type="button"
                onClick={handleYes}
                className="rounded-full border border-pink-200/60 bg-black/50 px-6 py-2 text-sm font-semibold tracking-wide text-pink-100 shadow-md shadow-black/70 transition hover:bg-black/70 active:translate-y-[1px]"
              >
                Not Disagree
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

