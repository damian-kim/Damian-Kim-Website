import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ScenePoint } from "../lib/types";
import { samplePointAtTime } from "../utils/sceneMath";

interface AnimatedBallProps {
  points: ScenePoint[];
  playToken: number;
}

export function AnimatedBall({ points, playToken }: AnimatedBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastPlayTokenRef = useRef(playToken);

  const duration = points.length > 0 ? points[points.length - 1].t : 0;

  // Track changes to playToken to reset the animation start time
  useEffect(() => {
    startTimeRef.current = null;
  }, [playToken]);

  useFrame((state) => {
    if (!meshRef.current || points.length === 0) return;

    if (lastPlayTokenRef.current !== playToken) {
      lastPlayTokenRef.current = playToken;
      startTimeRef.current = state.clock.elapsedTime;
    }

    const restPoint = points[points.length - 1];
    if (startTimeRef.current === null) {
      meshRef.current.position.set(restPoint.x, restPoint.y, restPoint.z);
      return;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const sample = elapsed >= duration ? restPoint : samplePointAtTime(points, elapsed);
    if (sample) {
      meshRef.current.position.set(sample.x, sample.y, sample.z);
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.35, 24, 24]} />
      <meshStandardMaterial color="#000000" roughness={0.35} metalness={0.05} />
    </mesh>
  );
}
