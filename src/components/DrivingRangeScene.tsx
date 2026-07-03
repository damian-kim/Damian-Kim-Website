import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ScenePoint } from "../lib/types";
import RangeEnvironment from "./RangeEnvironment";
import { TrajectoryTracer } from "./TrajectoryTracer";
import { AnimatedBall } from "./AnimatedBall";
import { computeSceneBounds, fitCameraToBounds } from "../utils/sceneMath";

interface DrivingRangeSceneProps {
  simulated: ScenePoint[];
  playToken: number;
}

export default function DrivingRangeScene({ simulated, playToken }: DrivingRangeSceneProps) {
  const bounds = useMemo(
    () => computeSceneBounds([simulated]),
    [simulated]
  );
  
  const { position: cameraPosition, target: cameraTarget } = useMemo(
    () => fitCameraToBounds(bounds),
    [bounds]
  );

  return (
    <div className="driving-range__canvas-wrap" style={{ width: "100%", height: "400px", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
      <Canvas shadows camera={{ position: cameraPosition, fov: 42, far: 2000 }}>
        {/* Clean monochrome background and fog */}
        <color attach="background" args={["#ffffff"]} />
        <fog attach="fog" args={["#ffffff", 150, Math.max(bounds.maxDownrangeM * 2.5, 300)]} />
        
        {/* Monochrome landscape environment */}
        <RangeEnvironment bounds={bounds} />
        
        {/* Draw black flight path */}
        {simulated.length > 0 && (
          <TrajectoryTracer points={simulated} color="#000000" lineWidth={3.5} />
        )}
        
        {/* Animated black ball */}
        {simulated.length > 0 && (
          <AnimatedBall points={simulated} playToken={playToken} />
        )}
        
        <OrbitControls target={cameraTarget} maxPolarAngle={Math.PI / 2 - 0.02} />
      </Canvas>
    </div>
  );
}
