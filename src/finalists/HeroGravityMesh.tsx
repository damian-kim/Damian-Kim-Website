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
      tiltX: 0,
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

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
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

      const cosY = Math.cos(body.tiltY);
      const sinY = Math.sin(body.tiltY);
      const x1 = px * cosY + z * sinY;
      let z1 = -px * sinY + z * cosY;

      const cosX = Math.cos(body.tiltX);
      const sinX = Math.sin(body.tiltX);
      const y1 = py * cosX - z1 * sinX;
      z1 = py * sinX + z1 * cosX;

      const scale = 920 / (920 - z1);
      return { x: cx + x1 * scale, y: cy + y1 * scale, scale };
    };

    const surfacePoint = (x: number, y: number) => {
      const dx = x - body.x;
      const dy = y - body.y;
      const distance = Math.hypot(dx, dy);
      const radius = clamp(Math.min(width, height) * .24, 125, 220);
      const influence = Math.exp(-(distance * distance) / (2 * radius * radius));
      const core = Math.exp(-(distance * distance) / (2 * (radius * .38) ** 2));
      const pull = influence * .18 + core * .12;
      const depth = -(radius * .36 * influence + radius * .08 * core);

      return {
        x: x - dx * pull,
        y: y - dy * pull,
        z: depth,
      };
    };

    const drawMesh = () => {
      const spacing = width < 720 ? 40 : 48;
      const margin = spacing * 3;
      const startX = -margin;
      const endX = width + margin;
      const startY = -margin;
      const endY = height + margin;
      const step = 10;

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
    };

    const drawBall = () => {
      const surface = surfacePoint(body.x, body.y);
      const contact = project(surface.x, surface.y, surface.z);
      const radius = clamp(Math.min(width, height) * .024, 15, 25);
      const ballY = contact.y - radius * .72;

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

      const fill = context.createRadialGradient(contact.x - radius * .38, ballY - radius * .42, radius * .08, contact.x, ballY, radius * 1.15);
      fill.addColorStop(0, '#fffaf0');
      fill.addColorStop(.25, '#e7d8b9');
      fill.addColorStop(.7, '#a28d67');
      fill.addColorStop(1, '#2c271f');
      context.fillStyle = fill;
      context.fillRect(contact.x - radius, ballY - radius, radius * 2, radius * 2);

      context.translate(contact.x, ballY);
      context.rotate(body.rollX * .035);
      context.strokeStyle = 'rgba(47, 40, 29, .34)';
      context.lineWidth = 1;
      for (let offset = -radius * 1.8; offset <= radius * 1.8; offset += radius * .42) {
        context.beginPath();
        context.arc(offset + Math.sin(body.rollY * .04) * radius, 0, radius * .13, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();

      context.strokeStyle = 'rgba(255, 248, 230, .48)';
      context.lineWidth = 1;
      context.beginPath();
      context.arc(contact.x, ballY, radius - .5, 0, Math.PI * 2);
      context.stroke();
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
      const targetTiltX = ny * .075;
      const targetTiltY = -nx * .09;
      const tiltSpring = 12;
      const tiltDamping = 6.2;
      body.tiltVx += ((targetTiltX - body.tiltX) * tiltSpring - body.tiltVx * tiltDamping) * dt;
      body.tiltVy += ((targetTiltY - body.tiltY) * tiltSpring - body.tiltVy * tiltDamping) * dt;
      body.tiltX += body.tiltVx * dt;
      body.tiltY += body.tiltVy * dt;

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
