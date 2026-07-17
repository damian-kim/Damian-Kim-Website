import { Line } from "@react-three/drei";
import type { ScenePoint } from "../lib/types";

interface TrajectoryTracerProps {
  points: ScenePoint[];
  color: string;
  dashed?: boolean;
  lineWidth?: number;
  drawCount?: number;
}

export function TrajectoryTracer({ points, color, dashed = false, lineWidth = 3.5, drawCount = 0 }: TrajectoryTracerProps) {
  if (points.length < 2) return null;

  // Slice points dynamically to only show trailing path behind the ball
  const visibleCount = Math.min(Math.max(drawCount, 0), points.length);
  const slicedPoints = points.slice(0, visibleCount);

  if (slicedPoints.length < 2) return null;

  const vertices: [number, number, number][] = slicedPoints.map((p) => [p.x, p.y, p.z]);

  return (
    <Line
      points={vertices}
      color={color}
      lineWidth={lineWidth}
      dashed={dashed}
      dashSize={dashed ? 0.6 : undefined}
      gapSize={dashed ? 0.4 : undefined}
    />
  );
}
