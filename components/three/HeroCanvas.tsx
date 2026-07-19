"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import dynamic from "next/dynamic";
import { suppressThreeClockWarning } from "@/lib/suppress-three-clock-warning";

const InteractiveBlob = dynamic(
  () => import("@/components/three/InteractiveBlob").then((mod) => mod.InteractiveBlob),
  { ssr: false, loading: () => null }
);

export function HeroCanvas() {
  useEffect(() => {
    suppressThreeClockWarning();
  }, []);
  return (
    <Canvas
      className="h-full w-full"
      style={{ pointerEvents: "none" }}
      camera={{ position: [0, 0, 15], fov: 30 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.15]}
      frameloop="always"
    >
      <InteractiveBlob />
    </Canvas>
  );
}
