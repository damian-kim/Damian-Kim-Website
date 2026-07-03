import type { ScenePoint } from "../lib/types";

export interface SceneBounds {
  maxDownrangeM: number;
  maxHeightM: number;
  maxLateralAbsM: number;
}

export function computeSceneBounds(pointSets: ScenePoint[][]): SceneBounds {
  let maxDownrangeM = 1;
  let maxHeightM = 1;
  let maxLateralAbsM = 1;
  for (const points of pointSets) {
    for (const p of points) {
      maxDownrangeM = Math.max(maxDownrangeM, p.x);
      maxHeightM = Math.max(maxHeightM, p.y);
      maxLateralAbsM = Math.max(maxLateralAbsM, Math.abs(p.z));
    }
  }
  return { maxDownrangeM, maxHeightM, maxLateralAbsM };
}

/** Camera position + orbit target scaled to the shot length */
export function fitCameraToBounds(bounds: SceneBounds) {
  const range = bounds.maxDownrangeM;
  return {
    position: [-range * 0.12 - 10, range * 0.16 + 8, range * 0.32 + 14] as [number, number, number],
    target: [range * 0.55, Math.max(bounds.maxHeightM * 0.3, 2), 0] as [number, number, number],
  };
}

/** Linear interpolation of a point sequence by time */
export function samplePointAtTime(points: ScenePoint[], t: number): ScenePoint | null {
  if (points.length === 0) return null;
  if (t <= points[0].t) return points[0];
  if (t >= points[points.length - 1].t) return points[points.length - 1];

  for (let i = 1; i < points.length; i++) {
    if (points[i].t >= t) {
      const a = points[i - 1];
      const b = points[i];
      const span = b.t - a.t;
      const frac = span > 0 ? (t - a.t) / span : 0;
      return {
        t,
        x: a.x + (b.x - a.x) * frac,
        y: a.y + (b.y - a.y) * frac,
        z: a.z + (b.z - a.z) * frac,
      };
    }
  }
  return points[points.length - 1];
}
