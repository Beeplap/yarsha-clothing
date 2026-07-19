"use client";

import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  isExiting: boolean;
};

export function LoadingScreen({ isExiting }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[1000] flex flex-col items-center justify-center overflow-hidden bg-background transition-[inset,border-radius,opacity,visibility] duration-700 ease-in-out",
        isExiting
          ? "pointer-events-none invisible inset-[10px] rounded-[30px] opacity-0"
          : "visible opacity-100",
      )}
      aria-hidden={isExiting}
      aria-busy={!isExiting}
      role="status"
      aria-label="Loading Yarsha Byte"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drawPath {
          0% { stroke-dashoffset: 1; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          0% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-draw-path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: drawPath 0.85s ease-in-out forwards;
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 1s ease-out 0.4s forwards;
        }
        .animate-scale-up {
          transform: scale(0.9);
          animation: scaleUp 2s ease-out forwards;
        }
      `}} />
      <div className="flex flex-col items-center gap-10">
        <svg
          viewBox="0 0 320 240"
          className="h-36 w-48 sm:h-48 sm:w-64 animate-scale-up"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {[
              "M40 120 L80 96 L120 120 L160 96 L200 120 L240 96 L280 120",
              "M80 96 L100 72 L120 96 L140 72 L160 96 L180 72 L200 96",
              "M120 120 L120 168 L140 188 L160 168 L180 188 L200 168 L200 120",
              "M60 144 L80 168 L100 144 L120 168 L140 144",
              "M180 144 L200 168 L220 144 L240 168 L260 144",
              "M100 72 L120 48 L140 72 L160 48 L180 72 L200 48 L220 72",
              "M80 168 L100 192 L120 168 L140 192 L160 168 L180 192 L200 168 L220 192 L240 168",
            ].map((path, index) => (
              <path
                key={path}
                d={path}
                pathLength={1}
                className="animate-draw-path"
                style={{
                  animationDelay: `${index * 0.05 + 0.12}s`
                }}
              />
            ))}
          </g>
        </svg>

        <p className="text-center text-xs uppercase tracking-[0.42em] text-black sm:text-sm md:text-base animate-fade-up">
          <span className="font-light">Loading </span>
          <span className="font-helvetica-bold">Yarsha Byte</span>
        </p>
      </div>
    </div>
  );
}
