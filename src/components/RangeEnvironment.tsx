import { Html } from "@react-three/drei";
import type { SceneBounds } from "../utils/sceneMath";

interface RangeEnvironmentProps {
  bounds: SceneBounds;
}

const YARD_TO_M = 0.9144;
const M_TO_YARD = 1.09361;

// Clean targets matching Xiaomi MiMo monochrome blueprint style
const TARGETS = [
  { yards: 50, z: -2.5, color: "#000000" },   // Black flag
  { yards: 100, z: 3.5, color: "#333333" },   // Dark charcoal flag
  { yards: 150, z: -4.0, color: "#444444" },  // Medium gray flag
  { yards: 200, z: 0.0, color: "#000000" },   // Black flag
  { yards: 250, z: 5.0, color: "#333333" },   // Dark charcoal flag
  { yards: 300, z: -3.0, color: "#444444" },  // Medium gray flag
];

function LowPolyTree({ position }: { position: [number, number, number] }) {
  const seed = position[0] + position[2];
  const heightScale = 0.85 + (Math.sin(seed * 100) * 0.15 + 0.15);
  const widthScale = 0.9 + (Math.cos(seed * 50) * 0.1 + 0.1);

  return (
    <group position={position} scale={[widthScale, heightScale, widthScale]}>
      {/* Trunk: solid charcoal */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 2.0, 8]} />
        <meshStandardMaterial color="#222222" roughness={0.9} />
      </mesh>
      {/* Bottom foliage: off-white */}
      <mesh position={[0, 2.7, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.1, 2.4, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
      </mesh>
      {/* Top foliage: medium-light gray */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <coneGeometry args={[0.8, 1.8, 8]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
      </mesh>
    </group>
  );
}

interface TargetGreenProps {
  yards: number;
  x: number;
  z: number;
  color: string;
}

function TargetGreen({ yards, x, z, color }: TargetGreenProps) {
  return (
    <group position={[x, 0.005, z]}>
      {/* Circular green turf (monochrome white/gray) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5.0, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>

      {/* Target black outer ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[4.8, 5.0, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>

      {/* Bullseye inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.9, 2.0, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Flagpole */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 3.2, 8]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Flag banner (black) */}
      <mesh position={[0.38, 2.8, 0]} castShadow>
        <boxGeometry args={[0.76, 0.45, 0.015]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Floating yardage badge: pure black with white text */}
      <Html position={[0, 3.8, 0]} center distanceFactor={25}>
        <div className="target-badge">
          {yards} <span className="target-badge__unit">yd</span>
        </div>
      </Html>
    </group>
  );
}

export default function RangeEnvironment({ bounds }: RangeEnvironmentProps) {
  const lengthM = Math.max(bounds.maxDownrangeM * 1.25, 30);
  const widthM = Math.max(bounds.maxLateralAbsM * 3, 24);

  const fairwayWidth = widthM * 0.7;
  const roughWidth = (widthM - fairwayWidth) / 2;

  const maxYards = Math.ceil((lengthM * M_TO_YARD) / 25) * 25;
  const ringYards: number[] = [];
  for (let y = 25; y <= maxYards; y += 25) ringYards.push(y);

  const treeSpacing = 22;
  const numTrees = Math.ceil(lengthM / treeSpacing);
  const treePositions: [number, number, number][] = [];

  for (let i = 0; i < numTrees; i++) {
    const x = i * treeSpacing + 10;
    if (x > lengthM) break;
    // Left boundary
    treePositions.push([x, 0, -widthM / 2 + roughWidth / 2]);
    // Right boundary
    treePositions.push([x, 0, widthM / 2 - roughWidth / 2]);
  }

  return (
    <group>
      {/* Fairway Lawn Stripes: alternating clean white and very light gray */}
      {Array.from({ length: 40 }).map((_, i) => {
        const stripWidth = (lengthM + 20) / 40;
        const x = i * stripWidth - 10 + stripWidth / 2;
        const isEven = i % 2 === 0;
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, 0]} receiveShadow>
            <planeGeometry args={[stripWidth, fairwayWidth]} />
            <meshStandardMaterial
              color={isEven ? "#ffffff" : "#fafafa"}
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        );
      })}

      {/* Left Rough (light gray border) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[lengthM / 2 - 5, 0, -widthM / 2 + roughWidth / 2]}
        receiveShadow
      >
        <planeGeometry args={[lengthM + 10, roughWidth]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      {/* Right Rough (light gray border) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[lengthM / 2 - 5, 0, widthM / 2 - roughWidth / 2]}
        receiveShadow
      >
        <planeGeometry args={[lengthM + 10, roughWidth]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      {/* Monochrome Trees */}
      {treePositions.map((pos, idx) => (
        <LowPolyTree key={idx} position={pos} />
      ))}

      {/* Target Greens */}
      {TARGETS.map((target) => {
        const x = target.yards * YARD_TO_M;
        if (x < lengthM) {
          return (
            <TargetGreen
              key={target.yards}
              yards={target.yards}
              x={x}
              z={target.z}
              color={target.color}
            />
          );
        }
        return null;
      })}

      {/* Distance rings (thin charcoal lines) */}
      {ringYards.map((yd) => {
        const x = yd * YARD_TO_M;
        return (
          <group key={yd}>
            <mesh position={[x, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.04, fairwayWidth]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.12} />
            </mesh>
            <Html position={[x, 0, fairwayWidth / 2 + 0.8]} center distanceFactor={35}>
              <div className="range-label">{yd} yd</div>
            </Html>
          </group>
        );
      })}

      {/* Target center line down the middle */}
      <mesh position={[lengthM / 2 - 5, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[lengthM + 10, 0.04]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.06} />
      </mesh>

      {/* Tee Box platform (clean light gray block) */}
      <group position={[-0.5, 0.01, 0]}>
        <mesh position={[0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.06, 2.0]} />
          <meshStandardMaterial color="#e5e5e5" roughness={0.9} />
        </mesh>
        <mesh position={[0.5, 0.05, 0.8]} castShadow>
          <boxGeometry args={[0.3, 0.06, 0.5]} />
          <meshStandardMaterial color="#111111" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.035, 0]} receiveShadow>
          <boxGeometry args={[1.2, 0.01, 1.4]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.95} />
        </mesh>
      </group>

      {/* Tee markers (charcoal) */}
      <mesh position={[0, 0.12, 1.2]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.12, -1.2]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#222222" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Natural bright blueprint lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[50, 75, 25]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={600}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0001}
      />
      <hemisphereLight args={["#ffffff", "#cccccc", 0.3]} />
    </group>
  );
}
