import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

const CUBE_COUNT = 5200;
const ARM_COUNT = 5;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function CubeGalaxy({ heroBackground = false }: { heroBackground?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const heroPointer = useRef(new THREE.Vector2());
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const viewportSize = useThree((state) => state.size);
  const viewportAspect = viewportSize.width / viewportSize.height;
  const presentationScale = heroBackground
    ? THREE.MathUtils.clamp(viewportAspect * 0.3, 0.34, 0.58)
    : 1;
  const heroOffsetX = heroBackground && viewportAspect > 1 ? 15 : 0;

  useEffect(() => {
    if (!heroBackground) return;
    const updatePointer = (event: PointerEvent) => {
      heroPointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      );
    };
    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => window.removeEventListener('pointermove', updatePointer);
  }, [heroBackground]);

  const field = useMemo(() => {
    const random = mulberry32(42817);
    const positions = new Float32Array(CUBE_COUNT * 3);
    const rotations = new Float32Array(CUBE_COUNT * 3);
    const scales = new Float32Array(CUBE_COUNT * 3);
    const colors = new Float32Array(CUBE_COUNT * 3);
    const phases = new Float32Array(CUBE_COUNT * 3);
    const spins = new Float32Array(CUBE_COUNT * 3);
    const color = new THREE.Color();

    for (let index = 0; index < CUBE_COUNT; index++) {
      const cursor = index * 3;
      const radius = Math.pow(random(), 0.6) * 42;
      const arm = index % ARM_COUNT;
      const angle = (arm / ARM_COUNT) * Math.PI * 2 + radius * 0.235 + (random() - 0.5) * (0.5 + radius * 0.018);
      const core = Math.max(0, 1 - radius / 17);
      const radial = radius + (random() - 0.5) * (1.35 + radius * 0.03);

      positions[cursor] = Math.cos(angle) * radial;
      positions[cursor + 1] = (random() + random() + random() - 1.5) * (1.15 + core * 4.8);
      positions[cursor + 2] = Math.sin(angle) * radial;
      rotations[cursor] = random() * Math.PI;
      rotations[cursor + 1] = random() * Math.PI;
      rotations[cursor + 2] = random() * Math.PI;

      const size = 0.1 + Math.pow(random(), 3.1) * 0.52;
      scales[cursor] = size * (0.7 + random() * 0.85);
      scales[cursor + 1] = size * (0.58 + random() * 1.12);
      scales[cursor + 2] = size * (0.7 + random() * 0.85);
      phases[cursor] = random() * Math.PI * 2;
      phases[cursor + 1] = random() * Math.PI * 2;
      phases[cursor + 2] = random() * Math.PI * 2;
      spins[cursor] = (random() - 0.5) * 0.7;
      spins[cursor + 1] = (random() - 0.5) * 0.7;
      spins[cursor + 2] = (random() - 0.5) * 0.7;

      const choice = random();
      if (core > 0.46 || choice > 0.82) color.setHSL(0.045 + random() * 0.035, 0.72, 0.42 + core * 0.3);
      else if (choice < 0.15) color.setHSL(0.62 + random() * 0.045, 0.24, 0.42 + random() * 0.24);
      else color.setHSL(0.085, 0.1, 0.4 + random() * 0.36);
      color.toArray(colors, cursor);
    }
    return { positions, rotations, scales, colors, phases, spins };
  }, []);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    for (let index = 0; index < CUBE_COUNT; index++) {
      const cursor = index * 3;
      position.fromArray(field.positions, cursor);
      rotation.set(field.rotations[cursor], field.rotations[cursor + 1], field.rotations[cursor + 2]);
      quaternion.setFromEuler(rotation);
      scale.fromArray(field.scales, cursor);
      matrix.compose(position, quaternion, scale);
      mesh.current.setMatrixAt(index, matrix);
      mesh.current.setColorAt(index, color.fromArray(field.colors, cursor));
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;

    const geometry = mesh.current.geometry as THREE.InstancedBufferGeometry;
    geometry.setAttribute('instancePhase', new THREE.InstancedBufferAttribute(field.phases, 3));
    geometry.setAttribute('instanceSpin', new THREE.InstancedBufferAttribute(field.spins, 3));
  }, [field]);

  useLayoutEffect(() => {
    if (!material.current) return;
    material.current.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\nattribute vec3 instancePhase;\nattribute vec3 instanceSpin;\nuniform float uTime;\nmat3 axisRotation(vec3 a) {\n  vec3 c = cos(a); vec3 s = sin(a);\n  mat3 rx = mat3(1.,0.,0., 0.,c.x,s.x, 0.,-s.x,c.x);\n  mat3 ry = mat3(c.y,0.,-s.y, 0.,1.,0., s.y,0.,c.y);\n  mat3 rz = mat3(c.z,s.z,0., -s.z,c.z,0., 0.,0.,1.);\n  return rz * ry * rx;\n}`)
        .replace('#include <begin_vertex>', 'mat3 danceRotation = axisRotation(instancePhase + instanceSpin * uTime);\nvec3 transformed = danceRotation * vec3(position);')
        .replace('#include <beginnormal_vertex>', 'vec3 objectNormal = axisRotation(instancePhase + instanceSpin * uTime) * vec3(normal);');
      material.current!.userData.shader = shader;
    };
    material.current.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const pointer = heroBackground ? heroPointer.current : state.pointer;
    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.037;
      const shader = material.current?.userData.shader;
      if (shader) shader.uniforms.uTime.value = state.clock.elapsedTime;
    }
    const tiltStrength = heroBackground ? 0.115 : 0.035;
    const rollStrength = heroBackground ? 0.09 : 0.028;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.28 + pointer.y * tiltStrength, 0.035);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, pointer.x * -rollStrength, 0.035);
    if (heroBackground) {
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, heroOffsetX + pointer.x * 2.4, 0.035);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -2 + pointer.y * 1.5, 0.035);
    }
  });

  return (
    <group ref={group} rotation={[-0.28, 0.28, 0.02]} position={[heroOffsetX, heroBackground ? -2 : 0, 0]} scale={presentationScale}>
      <instancedMesh ref={mesh} args={[undefined, undefined, CUBE_COUNT]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial ref={material} vertexColors roughness={0.34} metalness={0.33} emissive="#180804" emissiveIntensity={0.32} />
      </instancedMesh>
      <pointLight color="#ff7338" intensity={510} distance={39} decay={2} position={[0, 2.5, 0]} />
      <pointLight color="#ffe0bd" intensity={190} distance={28} decay={2} position={[-5, 3, 5]} />
      <pointLight color="#7786d7" intensity={95} distance={34} decay={2} position={[13, 5, -11]} />
      <Sparkles count={170} scale={[25, 9, 25]} size={3.1} speed={0.22} color="#ff9a68" opacity={0.48} />
    </group>
  );
}

export function GalaxyScene({ heroBackground = false }: { heroBackground?: boolean }) {
  return (
    <Canvas
      dpr={heroBackground ? [1, 1.25] : [1, 1.55]}
      camera={{ position: heroBackground ? [0, 18, 66] : [0, 23, 56], fov: 47, near: 0.1, far: 180 }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMappingExposure = 1.45;
      }}
    >
      <color attach="background" args={['#050405']} />
      <fogExp2 attach="fog" args={['#090607', 0.012]} />
      <ambientLight intensity={0.15} color="#8b92a6" />
      <directionalLight position={[7, 18, 13]} intensity={1.5} color="#ffe4c6" />
      <CubeGalaxy heroBackground={heroBackground} />
      <Stars radius={90} depth={55} count={950} factor={1.5} saturation={0.2} fade speed={0.12} />
    </Canvas>
  );
}

function BackgroundStudio() {
  return (
    <div className="studio-background" aria-hidden="true">
      <div className="studio-mark">MK</div>
      <div className="studio-index">02 — STUDIO</div>
      <div className="studio-grid">
        <div className="studio-card studio-card--dark"><span>AI Design Encoding</span><small>2026 · AI · Generative</small></div>
        <div className="studio-card studio-card--light"><div className="ribbon" /></div>
        <div className="studio-card studio-card--paper"><span>point</span><i /></div>
      </div>
    </div>
  );
}

export default function DancingCubesPage() {
  return (
    <main className="dancing-page">
      <BackgroundStudio />
      <div className="page-scrim" />
      <article className="project-modal" aria-labelledby="project-title">
        <section className="galaxy-panel" aria-label="Animated galaxy made from 5,200 cubes">
          <GalaxyScene />
          <button className="next-art" aria-label="Next artwork"><span>›</span></button>
          <span className="art-index">?</span>
          <div className="carousel-dots" aria-label="Artwork 1 of 5">
            <span className="active" /><span /><span /><span /><span />
          </div>
        </section>
        <section className="project-copy">
          <a className="close-button" href="/" aria-label="Close project">×</a>
          <div className="project-heading">
            <h1 id="project-title">DANCING CUBES</h1>
            <p>Three.js galaxy of 5,200 tumbling<br />cubes. Generated by my algorithmic<br />3D art skill.</p>
          </div>
          <div className="project-meta">
            <div className="project-note">Encoding design taste into AI skills,<br />creating an on-demand asset pipeline.</div>
            <div className="project-credit">
              <strong>AI Design Encoding</strong>
              <span>2026 · <em>AI · Generative</em></span>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
