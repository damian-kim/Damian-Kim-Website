export interface ScenePoint {
  x: number; // downrange, meters
  y: number; // height, meters (Three.js "up")
  z: number; // lateral, meters
  t: number; // elapsed time, seconds
  confidence?: number;
}
