"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen14({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({
    x: 70,
    y: 60,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const noX = (noPos.x / 100) * rect.width;
    const noY = (noPos.y / 100) * rect.height;

    const dx = noX - mouseX;
    const dy = noY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const threshold = 120;
    if (distance > threshold || distance === 0) return;

    // move away from cursor
    const escapeStrength = 40; // pixels
    const ux = dx / distance;
    const uy = dy / distance;

    const newX = noX + ux * escapeStrength;
    const newY = noY + uy * escapeStrength;

    // clamp to container
    const clampedX = Math.max(40, Math.min(rect.width - 40, newX));
    const clampedY = Math.max(40, Math.min(rect.height - 40, newY));

    setNoPos({
      x: (clampedX / rect.width) * 100,
      y: (clampedY / rect.height) * 100,
    });
  };

  return (
    <section className="screen relative flex h-full w-full flex-col items-center justify-center px-4 py-4">
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

      <div className="relative flex h-full w-full flex-col items-center gap-6">
        <p className="mt-4 text-center text-balance text-sm font-medium text-pink-100/90 sm:text-base">
          Look even the "No" is sick of whatever you're doing here.
        </p>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="relative mt-6 h-full w-full"
        >
          <button
            type="button"
            onClick={handleYes}
            className="absolute left-1/3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full bg-yesGreen px-8 py-2.5 text-sm font-semibold tracking-wide text-emerald-950 shadow-md shadow-emerald-500/60 transition hover:bg-green-600 active:translate-y-[1px]"
          >
            Yes
          </button>

          <button
            type="button"
            onClick={handleNo}
            className="absolute inline-flex items-center justify-center rounded-full bg-red-700 px-6 py-2 text-sm font-semibold tracking-wide text-red-50 shadow-md shadow-black/80 transition hover:bg-red-500 active:translate-y-[1px]"
            style={
              {
                left: `${noPos.x}%`,
                top: `${noPos.y}%`,
                transform: "translate(-50%, -50%)",
                transition: "left 160ms ease-out, top 160ms ease-out",
              } as CSSProperties
            }
          >
            No
          </button>
        </div>
      </div>
    </section>
  );
}

