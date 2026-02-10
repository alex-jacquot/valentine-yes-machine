"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

type Phase = "toJunction" | "toYes" | "toNo" | "done";

// Layout: % coordinates in the track container (left=0, top=0)
const START = { x: 4, y: 50 };
const JUNCTION = { x: 50, y: 50 };
// Straight ahead (same line as trolley) → Yes
const YES_TARGET = { x: 92, y: 50 };
// 45° to the right (down-right from junction) → No
const NO_TARGET = { x: 78, y: 78 };

const TOUCH_RADIUS = 6; // % – trigger when trolley center is within this of button center
const SPEED = 14; // % per second, constant
const COS45 = Math.SQRT1_2;

export function Screen12({ onYes, onNo }: Props) {
  const [burstId, setBurstId] = useState<number | null>(null);
  const [leverSwitched, setLeverSwitched] = useState(false);
  const [phase, setPhase] = useState<Phase>("toJunction");
  const [trolleyPos, setTrolleyPos] = useState<{ x: number; y: number }>({
    x: START.x,
    y: START.y,
  });
  const [explosionAt, setExplosionAt] = useState<{ x: number; y: number } | null>(null);

  const leverSwitchedRef = useRef(false);
  const decidedRef = useRef(false);
  const phaseRef = useRef<Phase>("toJunction");

  useEffect(() => {
    leverSwitchedRef.current = leverSwitched;
  }, [leverSwitched]);

  // When trolley reaches No: show explosion, then 2s later call onNo
  useEffect(() => {
    if (explosionAt === null) return;
    const t = setTimeout(() => {
      onNo();
      setExplosionAt(null);
    }, 2000);
    return () => clearTimeout(t);
  }, [explosionAt, onNo]);

  const decide = (path: "yes" | "no") => {
    if (decidedRef.current) return;
    decidedRef.current = true;
    setPhase("done");
    phaseRef.current = "done";
    if (path === "yes") {
      setBurstId(Date.now());
      onYes();
    } else {
      onNo();
    }
  };

  useEffect(() => {
    if (burstId === null) return;
    const timeout = setTimeout(() => setBurstId(null), 650);
    return () => clearTimeout(timeout);
  }, [burstId]);

  // Velocity-based: trolley never stops; direction changes only when x reaches lever
  useEffect(() => {
    let frameId: number;
    let lastTime: number | null = null;

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);

    const step = (time: number) => {
      if (lastTime == null) {
        lastTime = time;
        frameId = requestAnimationFrame(step);
        return;
      }

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setTrolleyPos((prev) => {
        if (phaseRef.current === "done") return prev;

        const p = phaseRef.current;
        let vx: number;
        let vy: number;

        if (p === "toJunction") {
          vx = SPEED;
          vy = 0;
        } else if (p === "toYes") {
          vx = SPEED;
          vy = 0;
        } else {
          vx = SPEED * COS45;
          vy = SPEED * COS45;
        }

        const next = {
          x: prev.x + vx * dt,
          y: prev.y + vy * dt,
        };

        // Reached lever x? Sample lever once and change direction (trolley keeps moving)
        if (p === "toJunction" && next.x >= JUNCTION.x) {
          if (leverSwitchedRef.current) {
            setPhase("toNo");
            phaseRef.current = "toNo";
          } else {
            setPhase("toYes");
            phaseRef.current = "toYes";
          }
          return { x: JUNCTION.x, y: JUNCTION.y };
        }

        if (p === "toYes" && dist(next, YES_TARGET) <= TOUCH_RADIUS) {
          decide("yes");
        } else if (p === "toNo" && dist(next, NO_TARGET) <= TOUCH_RADIUS) {
          setExplosionAt(next);
          setPhase("done");
          phaseRef.current = "done";
          decidedRef.current = true;
          return next;
        }

        return next;
      });

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const toggleLever = () => {
    const next = !leverSwitched;
    setLeverSwitched(next);
    leverSwitchedRef.current = next;
  };

  // Trolley rotation: 0 = right, 45 = down-right (for No branch)
  const trolleyRotation = phase === "toNo" ? 45 : 0;

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

      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
        <p className="mx-4 max-w-2xl text-center text-sm font-medium text-pink-100/90 sm:text-base">
          This is a trolley problem: the trolley is on the right track and will
          arrive safely to our date. Please don't touch anything before an accident occurs.
        </p>
      </div>

      <div className="relative flex h-full w-full max-w-3xl items-center justify-center">
        <div className="relative h-64 w-full max-w-3xl rounded-3xl bg-black/40 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.9)] sm:h-72">
          {/* Track: horizontal from left to junction */}
          <div
            className="absolute h-0.5 -translate-y-1/2 bg-slate-400/70"
            style={{
              left: "8%",
              width: "42%",
              top: "50%",
            }}
          />
          {/* Track: straight to Yes (right from junction) */}
          <div
            className="absolute h-0.5 -translate-y-1/2 bg-slate-400/70"
            style={{
              left: "50%",
              width: "44%",
              top: "50%",
            }}
          />
          {/* Track: 45° branch to No (diagonal down-right from junction) */}
          <div
            className="absolute h-0.5 w-[40%] origin-left -translate-y-1/2 bg-slate-400/70"
            style={{
              left: "50%",
              top: "50%",
              transform: "translateY(-50%) rotate(45deg)",
            }}
          />

          {/* Trolley image – hidden when explosion is showing */}
          {explosionAt === null && (
            <div
              className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{
                left: `${trolleyPos.x}%`,
                top: `${trolleyPos.y}%`,
                transform: `translate(-50%, -50%) rotate(${trolleyRotation}deg)`,
              }}
            >
              <Image
                src="/trolley.png"
                alt=""
                width={56}
                height={32}
                className="object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                unoptimized
              />
            </div>
          )}

          {/* Explosion when trolley reaches No – 2s later onNo() is called */}
          {explosionAt !== null && (
            <div
              className="absolute z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{
                left: `${explosionAt.x}%`,
                top: `${explosionAt.y}%`,
              }}
              aria-hidden
            >
              <div className="trolley-explosion" />
            </div>
          )}

          {/* Lever – only interactive control */}
          <button
            type="button"
            onClick={toggleLever}
            className="absolute left-1/2 top-20 z-30 flex -translate-x-1/2 flex-col items-center gap-1"
          >
            <span
              className="h-10 w-1 rounded-full bg-slate-200"
              style={
                {
                  transform: leverSwitched
                    ? "rotate(25deg) translateX(6px)"
                    : "rotate(-25deg) translateX(-6px)",
                  transformOrigin: "bottom center",
                  transition: "transform 200ms ease-out",
                } as CSSProperties
              }
            />
            <span className="rounded-full bg-black/70 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-pink-100">
              Lever
            </span>
          </button>

          {/* Yes – straight ahead; not clickable, trolley triggers */}
          <div
            className="pointer-events-none absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yesGreen/90 px-5 py-1.5 text-xs font-semibold tracking-[0.16em] text-emerald-950 shadow-md shadow-black/80"
            style={{
              left: `${YES_TARGET.x}%`,
              top: `${YES_TARGET.y}%`,
            }}
          >
            Yes
          </div>

          {/* No – 45° branch; not clickable, trolley triggers */}
          <div
            className="pointer-events-none absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-700/90 px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-red-50 shadow-md shadow-black/80"
            style={{
              left: `${NO_TARGET.x}%`,
              top: `${NO_TARGET.y}%`,
            }}
          >
            No
          </div>
        </div>
      </div>
    </section>
  );
}
