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

export function Screen5({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const draggingRef = useRef(false);
  const clickValidRef = useRef(false);
  const startRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  const onMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    draggingRef.current = true;
    clickValidRef.current = true;
    startRef.current = {
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    };
  };

  useEffect(() => {
    const handleMove = (event: MouseEvent | globalThis.MouseEvent) => {
      if (!draggingRef.current) return;
      const nextOffset = {
        x: event.clientX - startRef.current.x,
        y: event.clientY - startRef.current.y,
      };
      // if the button moved more than a tiny threshold, treat as drag, not click
      if (
        Math.abs(nextOffset.x - offset.x) > 3 ||
        Math.abs(nextOffset.y - offset.y) > 3
      ) {
        clickValidRef.current = false;
      }
      setOffset(nextOffset);
    };

    const handleUp = () => {
      if (draggingRef.current && clickValidRef.current) {
        handleYes();
      }
      draggingRef.current = false;
      clickValidRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [offset.x, offset.y]);

  return (
    <section className="screen flex h-full w-full items-center justify-center px-6">
      <div className="relative flex w-full max-w-xl flex-col items-center justify-center gap-8 text-center">
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
          I've moved up the Yes on your priority list, no more clumsy clicking for you.
        </p>

        <div className="relative mx-auto mt-4 h-64 w-full max-w-sm">
          <button
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yesGreen px-10 py-4 text-lg font-semibold tracking-wide text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-green-600 active:cursor-grabbing"
            type="button"
            onMouseDown={onMouseDown}
            style={
              {
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              } as CSSProperties
            }
          >
            Yes
          </button>

          <button
            className="absolute left-1/2 top-1/2 z-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-red-200/70 bg-red-800/80 px-6 py-2 text-sm font-medium text-red-50 shadow-md shadow-black/60 transition hover:bg-red-700"
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

