import { useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ScenePoint } from "../lib/types";
import RangeEnvironment from "./RangeEnvironment";
import { TrajectoryTracer } from "./TrajectoryTracer";
import { AnimatedBall } from "./AnimatedBall";
import InstancedGrass from "./InstancedGrass";
import { computeSceneBounds, fitCameraToBounds } from "../utils/sceneMath";

interface DrivingRangeSceneProps {
  simulated: ScenePoint[];
  playToken: number;
  height?: number | string;
  grassCount?: number;
  className?: string;
}

export default function DrivingRangeScene({
  simulated,
  playToken,
  height = 400,
  grassCount = 120000,
  className = "",
}: DrivingRangeSceneProps) {
  const [drawCount, setDrawCount] = useState(0);
  const [chaseCamEnabled, setChaseCamEnabled] = useState(true);

  const bounds = useMemo(
    () => computeSceneBounds([simulated]),
    [simulated]
  );
  
  const { position: cameraPosition, target: cameraTarget } = useMemo(
    () => fitCameraToBounds(bounds),
    [bounds]
  );

  // Reset drawing range and enable chase cam when playToken changes (launch/replay)
  useEffect(() => {
    setDrawCount(0);
    setChaseCamEnabled(true);
  }, [playToken]);

  return (
    <div className={`driving-range__canvas-wrap ${className}`.trim()} style={{ width: "100%", height, borderRadius: "4px", overflow: "hidden", position: "relative" }}>
      <Canvas dpr={[1, 1.5]} shadows="basic" camera={{ position: cameraPosition, fov: 42, far: 2000 }}>
        {/* Clean monochrome background and fog */}
        <color attach="background" args={["#ffffff"]} />
        <fog attach="fog" args={["#ffffff", 150, Math.max(bounds.maxDownrangeM * 2.5, 300)]} />
        
        {/* Wind-swaying instanced grass blades (width increased to 80m to match the wider fairway) */}
        <InstancedGrass count={grassCount} width={80} length={Math.max(bounds.maxDownrangeM * 1.2, 100)} />

        {/* Monochrome landscape environment */}
        <RangeEnvironment bounds={bounds} />
        
        {/* Draw dynamic black flight path trailing the ball */}
        {simulated.length > 0 && (
          <TrajectoryTracer points={simulated} color="#000000" lineWidth={3.5} drawCount={drawCount} />
        )}
        
        {/* Animated black ball tracking camera position */}
        {simulated.length > 0 && (
          <AnimatedBall 
            points={simulated} 
            playToken={playToken} 
            onUpdate={setDrawCount} 
            chaseCamEnabled={chaseCamEnabled} 
          />
        )}
        
        {/* Orbit controls with manual interaction override (disables auto chase camera when dragging starts) */}
        <OrbitControls 
          target={cameraTarget} 
          maxPolarAngle={Math.PI / 2 - 0.02} 
          onStart={() => setChaseCamEnabled(false)} 
        />
      </Canvas>
    </div>
  );
}
