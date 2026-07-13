"use client";

import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Suspense, useState } from "react";

interface ParticleFieldProps {
  particle1?: string;
  particle2?: string;
}

function Scene({ particle1, particle2 }: ParticleFieldProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <Sparkles
        count={40}
        scale={[9, 6, 4]}
        size={3.2}
        speed={0.25}
        opacity={0.55}
        color={particle1}
        noise={1}
      />
      <Sparkles
        count={25}
        scale={[8, 5, 3]}
        size={2.2}
        speed={0.18}
        opacity={0.4}
        color={particle2}
        noise={1.2}
      />
    </>
  );
}

export default function ParticleField({ particle1 = "#b7e11d", particle2 = "#1e4dff" }: ParticleFieldProps) {
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 640px)").matches;
    return !reduced && !small;
  });

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 z-[15] opacity-80">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <Suspense fallback={null}>
          <Scene particle1={particle1} particle2={particle2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
