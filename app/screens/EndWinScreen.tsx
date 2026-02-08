"use client";

import Image from "next/image";

type Props = {
  onRestart: () => void;
};

export function EndWinScreen({ onRestart }: Props) {
  return (
    <section className="screen relative flex min-h-full w-full flex-col items-center justify-center px-4 py-6">
      <div className="screen-inner relative z-10 flex flex-col items-center">
        {/* Sad cat gif */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/sad-cat-cat.gif"
            alt=""
            width={180}
            height={180}
            className="rounded-2xl object-contain drop-shadow-lg"
            unoptimized
          />
        </div>
        <p className="screen-text">
          Wow, you're that dedicated to say no? Well congrats, you win. I always preferred your sister anyways.
        </p>
        <div className="screen-buttons">
          <button className="btn btn-primary" type="button" onClick={onRestart}>
            Start over from the beginning
          </button>
        </div>
      </div>
    </section>
  );
}
