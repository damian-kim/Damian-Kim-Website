import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ScenePoint } from "../lib/types";
import { samplePointAtTime } from "./sceneMath";

interface AnimatedBallProps {
  points: ScenePoint[];
  playToken: number;
  chaseCamera?: boolean;
}

const MAX_LAUNCH_RPM = 3200;
const MIN_FLIGHT_RPM = 520;
const BALL_POINT = new Float32Array([0, 0, 0]);
const BALL_VERTEX_SHADER = `
  uniform float uSize;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize;
  }
`;
const BALL_FRAGMENT_SHADER = `
  precision highp float;
  uniform float uSpin;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float radius = length(point);
    if (radius > 0.5) discard;

    float sphereZ = sqrt(max(0.0, 0.25 - dot(point, point)));
    vec3 normal = normalize(vec3(point.x, -point.y, sphereZ));
    vec3 lightDirection = normalize(vec3(-0.55, 0.72, 0.8));
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float rim = pow(1.0 - normal.z, 2.4);

    float cosine = cos(uSpin);
    float sine = sin(uSpin);
    vec2 rotated = mat2(cosine, -sine, sine, cosine) * point;
    float dimpleField = sin(rotated.x * 62.0) * sin(rotated.y * 57.0);
    float dimples = smoothstep(0.72, 0.98, dimpleField) * 0.12;

    vec3 shadowColor = vec3(0.32, 0.29, 0.23);
    vec3 litColor = vec3(1.0, 0.98, 0.91);
    vec3 color = mix(shadowColor, litColor, 0.28 + diffuse * 0.76);
    color -= dimples;
    color += vec3(0.16, 0.13, 0.08) * rim;

    float alpha = smoothstep(0.5, 0.455, radius);
    gl_FragColor = vec4(color, alpha);
  }
`;

export function AnimatedBall({ points, playToken, chaseCamera = false }: AnimatedBallProps) {
  const ballRef = useRef<THREE.Group>(null);
  const markerMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastPlayTokenRef = useRef(playToken);
  const lastChaseCameraRef = useRef(chaseCamera);
  const initialSpeedRef = useRef(1);
  const visualSpinRef = useRef(0);

  const firstPointTime = points.length > 0 ? points[0].t : 0;
  const duration = points.length > 0 ? points[points.length - 1].t - firstPointTime : 0;

  // Run before Drei's Html projection callbacks. Ball Cam changes the camera
  // every frame; updating it first keeps the DOM ball/yardage markers on the
  // same camera matrix as the WebGL trajectory instead of one frame behind.
  useFrame((state, delta) => {
    if (!ballRef.current || points.length === 0) return;

    const newLaunch = lastPlayTokenRef.current !== playToken;
    if (newLaunch) {
      lastPlayTokenRef.current = playToken;
      startTimeRef.current = state.clock.elapsedTime;
      visualSpinRef.current = 0;

      const launchAhead = samplePointAtTime(points, Math.min(firstPointTime + 0.08, firstPointTime + duration)) ?? points[1] ?? points[0];
      const launchVelocity = new THREE.Vector3(
        launchAhead.x - points[0].x,
        launchAhead.y - points[0].y,
        launchAhead.z - points[0].z,
      ).divideScalar(Math.max(0.001, launchAhead.t - points[0].t));
      initialSpeedRef.current = Math.max(launchVelocity.length(), 0.01);
    }

    const chaseActivated = chaseCamera && (!lastChaseCameraRef.current || newLaunch);
    lastChaseCameraRef.current = chaseCamera;
    const restPoint = points[points.length - 1];
    const elapsed = startTimeRef.current === null ? duration : state.clock.elapsedTime - startTimeRef.current;
    const flightTime = THREE.MathUtils.clamp(elapsed, 0, duration);
    const sample = startTimeRef.current === null || elapsed >= duration
      ? restPoint
      : samplePointAtTime(points, firstPointTime + flightTime);
    if (!sample) return;

    ballRef.current.position.set(sample.x, sample.y, sample.z);

    const sampleWindow = 0.055;
    const behindTime = Math.max(0, flightTime - sampleWindow);
    const aheadTime = Math.min(duration, flightTime + sampleWindow);
    const behind = samplePointAtTime(points, firstPointTime + behindTime) ?? sample;
    const ahead = samplePointAtTime(points, firstPointTime + aheadTime) ?? sample;
    const velocity = new THREE.Vector3(ahead.x - behind.x, ahead.y - behind.y, ahead.z - behind.z)
      .divideScalar(Math.max(0.001, aheadTime - behindTime));
    const speed = velocity.length();

    if (markerMaterialRef.current) {
      markerMaterialRef.current.uniforms.uSize.value = 16 * state.gl.getPixelRatio();
    }

    if (markerMaterialRef.current && startTimeRef.current !== null && elapsed < duration) {
      const speedRatio = THREE.MathUtils.clamp(speed / initialSpeedRef.current, 0, 1);
      const rpm = MIN_FLIGHT_RPM + (MAX_LAUNCH_RPM - MIN_FLIGHT_RPM) * Math.pow(speedRatio, 0.78);
      const visibleRate = THREE.MathUtils.lerp(10, 28, Math.pow(speedRatio, 0.72)) * (rpm / MAX_LAUNCH_RPM);
      visualSpinRef.current -= visibleRate * Math.min(delta, 0.04);
      markerMaterialRef.current.uniforms.uSpin.value = visualSpinRef.current;
    }

    if (chaseCamera) {
      const direction = velocity.lengthSq() > 1e-6
        ? velocity.normalize()
        : new THREE.Vector3(restPoint.x - points[Math.max(0, points.length - 2)].x, 0, restPoint.z - points[Math.max(0, points.length - 2)].z).normalize();
      if (direction.lengthSq() < 1e-6) direction.set(1, 0, 0);
      const ball = new THREE.Vector3(sample.x, sample.y, sample.z);
      const desired = ball.clone().addScaledVector(direction, -12.5).add(new THREE.Vector3(0, 4.8, 0));

      // Snap on activation/replay before the frame is painted. Subsequent frames
      // damp smoothly, eliminating the one-frame backward orbit-camera flash.
      if (chaseActivated) state.camera.position.copy(desired);
      else if (elapsed < duration) state.camera.position.lerp(desired, 1 - Math.exp(-delta * 6.5));
      state.camera.up.set(0, 1, 0);
      state.camera.lookAt(ball);
      state.camera.updateMatrixWorld();
    }
  }, -1);

  return (
    <group ref={ballRef}>
      <points frustumCulled={false} renderOrder={20}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[BALL_POINT, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={markerMaterialRef}
          vertexShader={BALL_VERTEX_SHADER}
          fragmentShader={BALL_FRAGMENT_SHADER}
          uniforms={{ uSize: { value: 16 }, uSpin: { value: 0 } }}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
