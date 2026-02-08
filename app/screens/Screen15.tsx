"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TouchEvent,
} from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

export function Screen15({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [message, setMessage] = useState<string | null>(
    "Listen to your hands and draw a big resounding Yes."
  );
  const [isRecognizing, setIsRecognizing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
    setIsDrawing(true);
  };

  const drawLine = (x: number, y: number) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    startDrawing(event.clientX, event.clientY);
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    drawLine(event.clientX, event.clientY);
  };

  const handleTouchStart = (event: TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    startDrawing(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (event: TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    drawLine(touch.clientX, touch.clientY);
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setMessage("Canvas cleared. Try drawing “YES” again.");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffe4ff";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  const triggerYes = () => {
    setBurstId(Date.now());
    onYes();
  };

  const triggerNo = () => {
    onNo();
  };

  const handleRecognize = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecognizing(true);
    setMessage("Trying to read your handwriting…");
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(canvas);
      await worker.terminate();

      const raw = data.text || "";
      const text = raw.toLowerCase();

      if (text.includes("yes") && !text.includes("no")) {
        setMessage("I clearly see a YES in there.");
        triggerYes();
      } else if (text.includes("no") && !text.includes("yes")) {
        setMessage("That looks suspiciously like a NO.");
        triggerNo();
      } else if (text.includes("yes") && text.includes("no")) {
        setMessage(
          "I see both YES and NO in there… very torn. Try again, a bit clearer?"
        );
      } else {
        setMessage(
          "Big letters, you can do it."
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "The recognition spell fizzled out. Let’s pretend you said YES and try again later."
      );
    } finally {
      setIsRecognizing(false);
    }
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

      <div className="relative flex h-full w-full max-w-3xl flex-col items-center gap-6">
        <p className="mt-4 text-center text-balance text-sm font-medium text-pink-100/90 sm:text-base">
          I think you have a problem with buttons. Let's just switch to good old handwriting.        </p>

        <div className="relative mt-2 flex h-72 w-full max-w-xl flex-col items-stretch gap-3 rounded-3xl bg-black/40 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.9)] sm:h-80">
          <canvas
            ref={canvasRef}
            className="h-56 w-full flex-1 cursor-crosshair rounded-2xl bg-slate-900/80"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={stopDrawing}
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-pink-100/80 sm:text-[0.8rem]">
              <p>Tip: large block letters work best for the yes.</p>
              {message && <p className="mt-1 text-pink-200/80">{message}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={clearCanvas}
                className="rounded-full border border-pink-200/60 bg-black/40 px-4 py-1.5 text-xs font-medium text-pink-100 shadow-sm shadow-black/70 transition hover:bg-black/70"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleRecognize}
                disabled={isRecognizing}
                className="rounded-full bg-yesGreen px-5 py-1.5 text-xs font-semibold tracking-wide text-emerald-950 shadow-md shadow-emerald-500/60 transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRecognizing ? "Reading..." : "Recognize"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

