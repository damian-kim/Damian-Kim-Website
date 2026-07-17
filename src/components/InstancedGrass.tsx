import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface InstancedGrassProps {
  count?: number;
  width?: number;
  length?: number;
}

// 1. Vertex Shader: Handles organic wind wave sway on the GPU
const grassVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // Extract instance coordinates from the translation column of instanceMatrix
    vec3 instancePosition = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

    // Wind animation calculation (layered sine waves for natural wind gust ripples)
    float windSpeed = 2.5;
    float waveX = sin(uTime * windSpeed + instancePosition.x * 0.15 + instancePosition.z * 0.06);
    float waveZ = cos(uTime * 1.7 + instancePosition.x * 0.22) * 0.4;
    
    // Wind displacement bends the blade proportional to height squared
    float displaceFactor = pow(uv.y, 1.8);
    
    vec4 localPosition = vec4(position, 1.0);
    localPosition.x += waveX * 0.22 * displaceFactor;
    localPosition.z += waveZ * 0.08 * displaceFactor;

    // Apply instance matrix transformation
    vec4 worldPosition = modelMatrix * instanceMatrix * localPosition;
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

// 2. Fragment Shader: Renders gradient maps for shadow ambient occlusion and lighting
const grassFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    // Ambient occlusion factor: deep charcoal base, bright tips
    float ao = mix(0.18, 1.0, vUv.y);

    // Diffuse lighting
    vec3 lightPos = vec3(50.0, 75.0, 25.0);
    vec3 lightDir = normalize(lightPos - vWorldPosition);
    float diff = max(dot(vNormal, lightDir), 0.0);
    float diffuseLight = mix(0.82, 1.0, diff);

    // Xiaomi MiMo monochrome color gradient
    vec3 baseColor = vec3(0.12, 0.13, 0.15); // Dark base shadow
    vec3 tipColor = vec3(0.96, 0.96, 0.96);  // Pure off-white tip
    
    vec3 finalColor = mix(baseColor, tipColor, vUv.y) * ao * diffuseLight;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function InstancedGrass({ count = 120000, width = 45, length = 280 }: InstancedGrassProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // 1. Build a custom organic clump geometry composed of 4 distinct curved 3D creased grass blades (Blender step 1 & 2)
  const clumpGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const numBlades = 4;
    let vertexOffset = 0;

    for (let b = 0; b < numBlades; b++) {
      // Rotate each blade to form a circular dense clump
      const bladeAngle = (b / numBlades) * Math.PI * 2 + Math.random() * 0.4;
      const cos = Math.cos(bladeAngle);
      const sin = Math.sin(bladeAngle);

      // Curve orientation bends the blades slightly outwards
      const curveCos = Math.cos(bladeAngle + Math.PI);
      const curveSin = Math.sin(bladeAngle + Math.PI);

      // Grass Height Trimmed down to match short fairway grass (0.12m - 0.20m)
      const h = 0.12 + Math.random() * 0.08;
      const w = 0.03 + Math.random() * 0.015; // Width scaled down proportionally

      // Curved ribbon segment vertices: base to tip
      const segments = [
        { yRatio: 0.0,  wRatio: 1.0,  curveRatio: 0.0 },
        { yRatio: 0.35, wRatio: 0.8,  curveRatio: 0.08 },
        { yRatio: 0.7,  wRatio: 0.5,  curveRatio: 0.22 },
        { yRatio: 1.0,  wRatio: 0.0,  curveRatio: 0.45 },
      ];

      segments.forEach((seg) => {
        const y = seg.yRatio * h;
        const curW = seg.wRatio * w;
        const cOffset = seg.curveRatio * h;
        
        // Base coordinate curve offsets
        const cx = cOffset * curveCos;
        const cz = cOffset * curveSin;

        if (seg.wRatio === 0) {
          // Tip vertex (single point)
          const vx = cx;
          const vz = cz;
          positions.push(vx * cos - vz * sin, y, vx * sin + vz * cos);
          uvs.push(0.5, seg.yRatio);
        } else {
          // Creased fold details (Step 1 modeling crease fold):
          // Center crease is folded outwards, left/right fold inwards along normal direction
          const creaseDepth = curW * 0.22;
          
          // Left vertex
          const lx = -curW + cx;
          const lz = cz - creaseDepth;
          positions.push(lx * cos - lz * sin, y, lx * sin + lz * cos);
          uvs.push(0.0, seg.yRatio);

          // Center creased vertex
          const mx = cx;
          const mz = cz + creaseDepth * 2.0;
          positions.push(mx * cos - mz * sin, y, mx * sin + mz * cos);
          uvs.push(0.5, seg.yRatio);

          // Right vertex
          const rx = curW + cx;
          const rz = cz - creaseDepth;
          positions.push(rx * cos - rz * sin, y, rx * sin + rz * cos);
          uvs.push(1.0, seg.yRatio);
        }
      });

      // Construct creased indices
      // Vertex offsets per segment:
      // s0: left=0, center=1, right=2
      // s1: left=3, center=4, right=5
      // s2: left=6, center=7, right=8
      // s3: tip=9
      const o = vertexOffset;
      indices.push(
        // Segment 1 (Base to Mid-Low)
        o + 0, o + 3, o + 4,   o + 0, o + 4, o + 1, // Left crease side
        o + 1, o + 4, o + 5,   o + 1, o + 5, o + 2, // Right crease side

        // Segment 2 (Mid-Low to Mid-High)
        o + 3, o + 6, o + 7,   o + 3, o + 7, o + 4, // Left crease side
        o + 4, o + 7, o + 8,   o + 4, o + 8, o + 5, // Right crease side

        // Segment 3 (Mid-High to Tip)
        o + 6, o + 9, o + 7,                        // Left crease side merges at tip
        o + 7, o + 9, o + 8                         // Right crease side merges at tip
      );

      vertexOffset += 10; // 10 vertices per blade
    }

    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
    geom.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // 2. Procedural Scattering: Populate matrices using foreground concentration density
  const scatterMatrices = useMemo(() => {
    const temp = new THREE.Object3D();
    const array = [];

    for (let i = 0; i < count; i++) {
      let x = 0;
      let z = 0;

      const r = Math.random();
      if (r < 0.72) {
        x = -5 + Math.random() * 70;
        z = (Math.random() - 0.5) * (width * 0.75);
      } else if (r < 0.92) {
        x = 65 + Math.random() * 70;
        z = (Math.random() - 0.5) * (width * 0.65);
      } else {
        x = 135 + Math.random() * 115;
        z = (Math.random() - 0.5) * (width * 0.5);
      }

      // Short height scaling
      const baseScale = 0.85 + Math.random() * 0.4;
      const distFade = Math.max(0.3, 1.0 - (x / length) * 0.4);
      const scale = baseScale * distFade;

      const rotY = Math.random() * Math.PI * 2;
      const tiltX = (Math.random() - 0.5) * 0.12;
      const tiltZ = (Math.random() - 0.5) * 0.12;

      temp.position.set(x, 0, z);
      temp.rotation.set(tiltX, rotY, tiltZ);
      temp.scale.set(scale, scale, scale);
      temp.updateMatrix();
      
      array.push(temp.matrix.clone());
    }
    return array;
  }, [count, length, width]);

  const handleMeshInit = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return;
    scatterMatrices.forEach((matrix, i) => {
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[clumpGeometry, null as any, count]}
      onUpdate={handleMeshInit}
      castShadow
      receiveShadow
    >
      <shaderMaterial
        vertexShader={grassVertexShader}
        fragmentShader={grassFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
