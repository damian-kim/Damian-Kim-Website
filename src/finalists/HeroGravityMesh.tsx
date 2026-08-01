import { useEffect, useRef } from 'react';

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  tiltX: number;
  tiltY: number;
  tiltVx: number;
  tiltVy: number;
  rollX: number;
  rollY: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const BASE_TILT_X = Math.PI * .32;
const FOCAL_LENGTH = 920;
const MESH_HORIZON = .16;
const GRAVITY_CUTOFF = 2.45;
const DIMPLES = [
  [-.58, -.49], [-.2, -.66], [.22, -.62], [.55, -.42],
  [-.72, -.13], [-.37, -.23], [.03, -.29], [.42, -.18], [.73, .02],
  [-.62, .23], [-.23, .14], [.17, .08], [.53, .27],
  [-.45, .55], [-.04, .48], [.35, .58], [.04, .78],
] as const;

export default function HeroGravityMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>('.monolith-hero');
    const context = canvas?.getContext('2d');
    if (!canvas || !hero || !context) return;

    const body: Body = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: 0,
      tiltX: BASE_TILT_X,
      tiltY: 0,
      tiltVx: 0,
      tiltVy: 0,
      rollX: 0,
      rollY: 0,
    };

    let width = 1;
    let height = 1;
    let dpr = 1;
    let frame = 0;
    let previousTime = performance.now();
    let pointerActive = false;
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ballPlaneX = 0;
    let ballPlaneY = 0;
    let wellRadius = 125;
    let wellRadiusSquared = wellRadius * wellRadius;
    let gravityCutoffSquared = (wellRadius * GRAVITY_CUTOFF) ** 2;
    let gravityFadeStartSquared = (wellRadius * 2.05) ** 2;
    let cosTiltX = Math.cos(BASE_TILT_X);
    let sinTiltX = Math.sin(BASE_TILT_X);
    let cosTiltY = 1;
    let sinTiltY = 0;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      // A dense animated line mesh gains very little above 1.5x DPR, while the
      // number of shaded pixels grows quadratically on Retina displays.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      wellRadius = clamp(Math.min(width, height) * .24, 125, 220);
      wellRadiusSquared = wellRadius * wellRadius;
      gravityCutoffSquared = (wellRadius * GRAVITY_CUTOFF) ** 2;
      gravityFadeStartSquared = (wellRadius * 2.05) ** 2;
      if (!pointerActive) {
        body.x = body.targetX = width * .5;
        body.y = body.targetY = height * .53;
      }
    };

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      body.targetX = clamp(event.clientX - rect.left, 26, width - 26);
      body.targetY = clamp(event.clientY - rect.top, 26, height - 26);
      pointerActive = true;
    };

    const leavePointer = () => {
      pointerActive = false;
      body.targetX = width * .5;
      body.targetY = height * .53;
    };

    const onMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
    };

    const project = (x: number, y: number, z: number) => {
      const cx = width * .5;
      const cy = height * .53;
      let px = x - cx;
      let py = y - cy;

      const x1 = px * cosTiltY + z * sinTiltY;
      let z1 = -px * sinTiltY + z * cosTiltY;
      const y1 = py * cosTiltX - z1 * sinTiltX;
      z1 = py * sinTiltX + z1 * cosTiltX;

      const scale = FOCAL_LENGTH / (FOCAL_LENGTH - z1);
      return { x: cx + x1 * scale, y: cy + y1 * scale, scale };
    };

    // Intersect a screen-space ray with the tilted mesh plane. This keeps the
    // gravity well under the pointer even though the grid itself recedes in 3D.
    const unprojectToPlane = (screenX: number, screenY: number, localZ = 0) => {
      const cx = width * .5;
      const cy = height * .53;
      const u = screenX - cx;
      const v = screenY - cy;
      const normalX = sinTiltY;
      const normalY = -cosTiltY * sinTiltX;
      const normalZ = cosTiltY * cosTiltX;
      const denominator = FOCAL_LENGTH * normalZ - u * normalX - v * normalY;
      const rayScale = (FOCAL_LENGTH * normalZ - localZ) / Math.max(80, denominator);
      const x1 = u * rayScale;
      const y1 = v * rayScale;
      const z1 = FOCAL_LENGTH * (1 - rayScale);

      const planeY = y1 * cosTiltX + z1 * sinTiltX;
      const zAfterX = -y1 * sinTiltX + z1 * cosTiltX;
      const planeX = x1 * cosTiltY - zAfterX * sinTiltY;
      return { x: cx + planeX, y: cy + planeY };
    };

    const surfacePoint = (x: number, y: number) => {
      const dx = x - ballPlaneX;
      const dy = y - ballPlaneY;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared > gravityCutoffSquared) return { x, y, z: 0 };

      const fade = distanceSquared > gravityFadeStartSquared
        ? clamp((gravityCutoffSquared - distanceSquared) / (gravityCutoffSquared - gravityFadeStartSquared), 0, 1)
        : 1;
      const influence = Math.exp(-distanceSquared / (2 * wellRadiusSquared)) * fade;
      const coreRadius = wellRadius * .38;
      const core = Math.exp(-distanceSquared / (2 * coreRadius * coreRadius));
      const pull = influence * .18 + core * .12;
      const depth = -(wellRadius * .36 * influence + wellRadius * .08 * core);

      return {
        x: x - dx * pull,
        y: y - dy * pull,
        z: depth,
      };
    };

    const drawMesh = () => {
      const spacing = width < 720 ? 44 : 54;
      const horizonY = height * MESH_HORIZON;
      const corners = [
        unprojectToPlane(0, horizonY),
        unprojectToPlane(width, horizonY),
        unprojectToPlane(0, height),
        unprojectToPlane(width, height),
      ];
      const margin = spacing * 4;
      const startX = Math.floor((Math.min(...corners.map((point) => point.x)) - margin) / spacing) * spacing;
      const endX = Math.ceil((Math.max(...corners.map((point) => point.x)) + margin) / spacing) * spacing;
      const startY = Math.floor((Math.min(...corners.map((point) => point.y)) - margin) / spacing) * spacing;
      const endY = Math.ceil((Math.max(...corners.map((point) => point.y)) + margin) / spacing) * spacing;
      const step = width < 720 ? 18 : 16;

      context.save();
      context.beginPath();
      context.rect(0, horizonY, width, height - horizonY);
      context.clip();
      context.lineWidth = 1;
      context.strokeStyle = 'rgba(216, 196, 154, 0.16)';

      for (let x = startX; x <= endX; x += spacing) {
        context.beginPath();
        let first = true;
        for (let y = startY; y <= endY; y += step) {
          const p = surfacePoint(x, y);
          const screen = project(p.x, p.y, p.z);
          if (first) context.moveTo(screen.x, screen.y);
          else context.lineTo(screen.x, screen.y);
          first = false;
        }
        context.stroke();
      }

      for (let y = startY; y <= endY; y += spacing) {
        context.beginPath();
        let first = true;
        for (let x = startX; x <= endX; x += step) {
          const p = surfacePoint(x, y);
          const screen = project(p.x, p.y, p.z);
          if (first) context.moveTo(screen.x, screen.y);
          else context.lineTo(screen.x, screen.y);
          first = false;
        }
        context.stroke();
      }
      context.restore();

      const horizon = context.createLinearGradient(0, 0, width, 0);
      horizon.addColorStop(0, 'rgba(216, 196, 154, 0)');
      horizon.addColorStop(.5, 'rgba(216, 196, 154, .1)');
      horizon.addColorStop(1, 'rgba(216, 196, 154, 0)');
      context.strokeStyle = horizon;
      context.beginPath();
      context.moveTo(0, horizonY + .5);
      context.lineTo(width, horizonY + .5);
      context.stroke();
    };

    const drawBall = () => {
      const surface = surfacePoint(ballPlaneX, ballPlaneY);
      const contact = project(surface.x, surface.y, surface.z);
      const radius = clamp(Math.min(width, height) * .03, 19, 30);
      const ballY = contact.y - radius * .78;

      const shadow = context.createRadialGradient(contact.x, contact.y + 3, 1, contact.x, contact.y + 3, radius * 2.5);
      shadow.addColorStop(0, 'rgba(0, 0, 0, .72)');
      shadow.addColorStop(.42, 'rgba(0, 0, 0, .34)');
      shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = shadow;
      context.beginPath();
      context.ellipse(contact.x, contact.y + 3, radius * 2.5, radius * .72, 0, 0, Math.PI * 2);
      context.fill();

      context.save();
      context.beginPath();
      context.arc(contact.x, ballY, radius, 0, Math.PI * 2);
      context.clip();

      const fill = context.createRadialGradient(contact.x - radius * .38, ballY - radius * .44, radius * .03, contact.x + radius * .12, ballY + radius * .12, radius * 1.18);
      fill.addColorStop(0, '#ffffff');
      fill.addColorStop(.18, '#f4ead7');
      fill.addColorStop(.52, '#cdbb98');
      fill.addColorStop(.78, '#887555');
      fill.addColorStop(1, '#211d17');
      context.fillStyle = fill;
      context.fillRect(contact.x - radius, ballY - radius, radius * 2, radius * 2);

      context.translate(contact.x, ballY);
      context.rotate((body.rollX - body.rollY) * .018);
      for (const [dimpleX, dimpleY] of DIMPLES) {
        const x = dimpleX * radius + Math.sin(body.rollY * .035) * radius * .08;
        const y = dimpleY * radius + Math.cos(body.rollX * .035) * radius * .05;
        if (x * x + y * y > radius * radius * .82) continue;
        const dimpleRadius = radius * (.075 + (1 - Math.hypot(x, y) / radius) * .025);
        context.fillStyle = 'rgba(54, 45, 32, .26)';
        context.beginPath();
        context.ellipse(x + dimpleRadius * .18, y + dimpleRadius * .22, dimpleRadius, dimpleRadius * .72, 0, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = 'rgba(255, 250, 237, .28)';
        context.beginPath();
        context.ellipse(x - dimpleRadius * .2, y - dimpleRadius * .22, dimpleRadius * .66, dimpleRadius * .38, 0, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      const rim = context.createLinearGradient(contact.x, ballY - radius, contact.x, ballY + radius);
      rim.addColorStop(0, 'rgba(255, 255, 255, .82)');
      rim.addColorStop(.5, 'rgba(240, 224, 192, .36)');
      rim.addColorStop(1, 'rgba(24, 20, 15, .78)');
      context.strokeStyle = rim;
      context.lineWidth = 1.35;
      context.beginPath();
      context.arc(contact.x, ballY, radius - .7, 0, Math.PI * 2);
      context.stroke();

      context.fillStyle = 'rgba(255, 255, 255, .58)';
      context.beginPath();
      context.ellipse(contact.x - radius * .34, ballY - radius * .42, radius * .2, radius * .11, -.55, 0, Math.PI * 2);
      context.fill();
    };

    const tick = (now: number) => {
      const dt = Math.min((now - previousTime) / 1000, .032);
      previousTime = now;

      if (reducedMotion) {
        body.x = body.targetX;
        body.y = body.targetY;
        body.vx = body.vy = 0;
      } else {
        const spring = 92;
        const damping = 17;
        body.vx += ((body.targetX - body.x) * spring - body.vx * damping) * dt;
        body.vy += ((body.targetY - body.y) * spring - body.vy * damping) * dt;
        body.x += body.vx * dt;
        body.y += body.vy * dt;
        body.rollX += body.vx * dt / 18;
        body.rollY += body.vy * dt / 18;
      }

      const nx = (body.x / width - .5) * 2;
      const ny = (body.y / height - .5) * 2;
      const targetTiltX = BASE_TILT_X + ny * .045;
      const targetTiltY = -nx * .075;
      const tiltSpring = 12;
      const tiltDamping = 6.2;
      body.tiltVx += ((targetTiltX - body.tiltX) * tiltSpring - body.tiltVx * tiltDamping) * dt;
      body.tiltVy += ((targetTiltY - body.tiltY) * tiltSpring - body.tiltVy * tiltDamping) * dt;
      body.tiltX += body.tiltVx * dt;
      body.tiltY += body.tiltVy * dt;
      cosTiltX = Math.cos(body.tiltX);
      sinTiltX = Math.sin(body.tiltX);
      cosTiltY = Math.cos(body.tiltY);
      sinTiltY = Math.sin(body.tiltY);

      const centerDepth = -wellRadius * .44;
      const ballPlane = unprojectToPlane(body.x, body.y, centerDepth);
      ballPlaneX = ballPlane.x;
      ballPlaneY = ballPlane.y;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      drawMesh();
      drawBall();
      frame = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(resize);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    resizeObserver.observe(hero);
    hero.addEventListener('pointermove', movePointer);
    hero.addEventListener('pointerleave', leavePointer);
    motionQuery.addEventListener('change', onMotionPreference);
    resize();
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      hero.removeEventListener('pointermove', movePointer);
      hero.removeEventListener('pointerleave', leavePointer);
      motionQuery.removeEventListener('change', onMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="monolith-gravity-mesh" aria-hidden="true" />;
}
