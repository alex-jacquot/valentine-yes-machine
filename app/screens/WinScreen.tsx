"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  onRestart: () => void;
  onBackToPrevious: () => void;
};

export function WinScreen({ onRestart, onBackToPrevious }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);

  useEffect(() => {
    setBurstId(Date.now());
  }, []);

  useEffect(() => {
    if (burstId === null) return;
    const t = setTimeout(() => setBurstId(null), 700);
    return () => clearTimeout(t);
  }, [burstId]);

  return (
    <section className="screen relative flex min-h-full w-full flex-col items-center justify-center px-4 py-6">
      {/* Big page confetti */}
      {burstId !== null && (
        <div className="confetti-layer">
          {Array.from({ length: 64 }).map((_, i) => (
            <span
              key={`${burstId}-${i}`}
              className="confetti-piece"
              style={
                {
                  "--dx": (Math.random() - 0.5) * 320,
                  "--dy": Math.random() * 180 + 60,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className="screen-inner relative z-10 flex flex-col items-center">
        {/* Centered silly cat dance */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/silly-cat-dance.gif"
            alt=""
            width={200}
            height={200}
            className="rounded-2xl object-contain drop-shadow-lg"
            unoptimized
          />
        </div>
        <p className="screen-text">
          I knew you'd say yes! See you Saturday!
        </p>
        <div className="screen-buttons">
          <button className="btn btn-primary" type="button" onClick={onRestart}>
            Back to my original question
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onBackToPrevious}
          >
            Let me go back and say yes again
          </button>
        </div>
      </div>
    </section>
  );
}
