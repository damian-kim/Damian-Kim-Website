import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ScenePoint } from "../lib/types";
import { samplePointAtTime } from "../utils/sceneMath";

interface AnimatedBallProps {
  points: ScenePoint[];
  playToken: number;
  onUpdate?: (index: number) => void;
  chaseCamEnabled?: boolean;
}

export function AnimatedBall({ points, playToken, onUpdate, chaseCamEnabled = true }: AnimatedBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastPlayTokenRef = useRef(playToken);

  const duration = points.length > 0 ? points[points.length - 1].t : 0;

  useEffect(() => {
    startTimeRef.current = null;
    if (onUpdate) onUpdate(0);
  }, [playToken, onUpdate]);

  useFrame((state) => {
    if (!meshRef.current || points.length === 0) return;

    if (lastPlayTokenRef.current !== playToken) {
      lastPlayTokenRef.current = playToken;
      startTimeRef.current = state.clock.elapsedTime;
    }

    const restPoint = points[points.length - 1];
    
    // 1. If simulation hasn't launched yet, stay at tee box (0, 0, 0)
    if (startTimeRef.current === null) {
      meshRef.current.position.set(0, 0.05, 0);
      return;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const isFlightActive = elapsed < duration;

    // 2. Sample current position along trajectory (incorporating ground bounces/roll)
    const sample = isFlightActive ? samplePointAtTime(points, elapsed) : restPoint;
    
    let activeIndex = points.length;
    if (isFlightActive && sample) {
      meshRef.current.position.set(sample.x, sample.y, sample.z);
      
      // Calculate search index matching elapsed time
      for (let i = 1; i < points.length; i++) {
        if (points[i].t >= elapsed) {
          activeIndex = i;
          break;
        }
      }
    } else {
      // Keep ball static at its landing/rolling rest point
      meshRef.current.position.set(restPoint.x, restPoint.y, restPoint.z);
    }

    // Update parent drawCount to reveal trailing path
    if (onUpdate) {
      onUpdate(activeIndex);
    }

    // 3. Dynamic camera tracking
    if (isFlightActive && sample) {
      if (chaseCamEnabled) {
        // Follow DIRECTLY BEHIND: offset only along X (backwards) and Y (up), keep Z exactly aligned with the ball's path!
        const camX = sample.x - 7.5;
        const camY = sample.y + 2.2;
        const camZ = sample.z;

        state.camera.position.set(camX, camY, camZ);
        state.camera.lookAt(sample.x, sample.y, sample.z);

        if (state.controls) {
          const controls = state.controls as any;
          controls.target.set(sample.x, sample.y, sample.z);
          controls.update();
        }
      } else {
        // If flight is active but user has disabled chase cam by dragging:
        // Keep camera focused/looking at the moving ball (so it stays centered),
        // but do NOT override camera position, allowing free orbital drag and zoom!
        if (state.controls) {
          const controls = state.controls as any;
          controls.target.set(sample.x, sample.y, sample.z);
          controls.update();
        }
      }
    } else {
      // PERSISTENT TARGET: once the ball lands and comes to a complete rest, do NOT reset target to tee.
      // Leave camera target anchored exactly on the ball's resting coordinates so user can orbit/inspect!
      if (state.controls) {
        const controls = state.controls as any;
        controls.target.set(restPoint.x, restPoint.y, restPoint.z);
        controls.update();
      }
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[0.2, 24, 24]} /> {/* Slightly reduced scale to match realistic 3D ball radius */}
      <meshStandardMaterial color="#000000" roughness={0.35} metalness={0.05} />
    </mesh>
  );
}
