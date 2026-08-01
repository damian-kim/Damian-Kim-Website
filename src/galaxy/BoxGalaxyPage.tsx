import { useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const BOX_COUNT = 5200;
const ARM_COUNT = 5;

function seededRandom(seed = 428) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function GalaxyBoxes() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const field = useMemo(() => {
    const random = seededRandom();
    const positions = new Float32Array(BOX_COUNT * 3);
    const rotations = new Float32Array(BOX_COUNT * 3);
    const scales = new Float32Array(BOX_COUNT * 3);
    const colors = new Float32Array(BOX_COUNT * 3);
    const color = new THREE.Color();

    for (let index = 0; index < BOX_COUNT; index++) {
      const radius = Math.pow(random(), .58) * 46;
      const arm = index % ARM_COUNT;
      const armAngle = arm / ARM_COUNT * Math.PI * 2;
      const curl = radius * .215;
      const spread = (random() - .5) * (.48 + radius * .018);
      const angle = armAngle + curl + spread;
      const bulge = Math.max(0, 1 - radius / 17);
      const verticalSpread = 4.4 * bulge + 1.15;
      const y = (random() + random() + random() - 1.5) * verticalSpread;
      const radialNoise = (random() - .5) * (1.2 + radius * .035);
      const resolvedRadius = radius + radialNoise;
      const cursor = index * 3;

      positions[cursor] = Math.cos(angle) * resolvedRadius;
      positions[cursor + 1] = y;
      positions[cursor + 2] = Math.sin(angle) * resolvedRadius;

      rotations[cursor] = random() * Math.PI;
      rotations[cursor + 1] = random() * Math.PI;
      rotations[cursor + 2] = random() * Math.PI;

      const baseScale = .09 + Math.pow(random(), 3.4) * .52;
      scales[cursor] = baseScale * (.65 + random() * .9);
      scales[cursor + 1] = baseScale * (.55 + random() * 1.25);
      scales[cursor + 2] = baseScale * (.65 + random() * .9);

      const core = 1 - Math.min(radius / 30, 1);
      const warmChance = random();
      if (core > .55 || warmChance > .82) {
        color.setHSL(.055 + random() * .035, .72, .42 + core * .32);
      } else if (warmChance < .17) {
        color.setHSL(.59 + random() * .06, .34, .48 + random() * .22);
      } else {
        color.setHSL(.09, .12, .36 + random() * .4);
      }
      color.toArray(colors, cursor);
    }

    return { positions, rotations, scales, colors };
  }, []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();

    for (let index = 0; index < BOX_COUNT; index++) {
      const cursor = index * 3;
      position.fromArray(field.positions, cursor);
      rotation.set(field.rotations[cursor], field.rotations[cursor + 1], field.rotations[cursor + 2]);
      quaternion.setFromEuler(rotation);
      scale.fromArray(field.scales, cursor);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
      color.fromArray(field.colors, cursor);
      mesh.setColorAt(index, color);
    }
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [field]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (!reducedMotion) group.rotation.y += delta * .055;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -.2 + state.pointer.y * .045, .025);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, state.pointer.x * -.035, .025);
  });

  return (
    <group ref={groupRef} rotation={[-.2, 0, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, BOX_COUNT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial vertexColors roughness={.48} metalness={.12} emissive="#2b0f08" emissiveIntensity={.28} />
      </instancedMesh>
      <pointLight color="#ff6e35" intensity={440} distance={42} decay={2} position={[0, 2, 0]} />
      <pointLight color="#ffd3a8" intensity={150} distance={28} decay={2} position={[-7, -2, 5]} />
      <pointLight color="#6e8dff" intensity={95} distance={34} decay={2} position={[16, 5, -12]} />
    </group>
  );
}

export default function BoxGalaxyPage() {
  return (
    <main className="galaxy-page">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 25, 64], fov: 46, near: .1, far: 220 }}
        gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMappingExposure = 1.28;
        }}
      >
        <color attach="background" args={['#030304']} />
        <fogExp2 attach="fog" args={['#060506', .0095]} />
        <ambientLight intensity={.17} color="#7d879f" />
        <directionalLight position={[12, 28, 18]} intensity={1.4} color="#ffe0bd" />
        <GalaxyBoxes />
        <Stars radius={105} depth={70} count={1800} factor={2.1} saturation={.35} fade speed={.18} />
      </Canvas>

      <header className="galaxy-nav">
        <a href="/" aria-label="Return to Damian Kim portfolio"><span>DK</span> Back to portfolio</a>
        <p>THREE.JS / ALGORITHMIC STUDY</p>
      </header>

      <section className="galaxy-intro" aria-labelledby="galaxy-title">
        <span>EXPERIMENT 01</span>
        <h1 id="galaxy-title">A galaxy made<br />from <em>boxes.</em></h1>
        <p>5,200 individually placed cubes form five gravitational arms. One instanced draw call keeps the whole system moving.</p>
      </section>

      <aside className="galaxy-readout">
        <div><span>OBJECTS</span><strong>5,200</strong></div>
        <div><span>DRAW CALLS</span><strong>01</strong></div>
        <div><span>MOTION</span><strong>LIVE</strong></div>
      </aside>

      <footer className="galaxy-footer"><span>Move pointer to shift the orbital plane</span><i /><span>Built with React Three Fiber</span></footer>
    </main>
  );
}
