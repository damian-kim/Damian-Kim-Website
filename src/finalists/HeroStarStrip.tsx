import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
  twinkleRate: number;
  color: [number, number, number];
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export default function HeroStarStrip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const random = mulberry32(4282026);
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let previousTime = performance.now();

    const rebuild = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.max(160, Math.min(520, Math.round((width * height) / 1800)));
      stars = Array.from({ length: count }, () => {
        const temperature = random();
        const color: [number, number, number] = temperature < 0.14
          ? [206, 220, 255]
          : temperature > 0.9
            ? [255, 230, 214]
            : [244, 246, 250];
        return {
          x: random() * width,
          y: (0.04 + random() * 0.92) * height,
          radius: 0.2 + Math.pow(random(), 4.2) * 0.72,
          alpha: 0.18 + Math.pow(random(), 0.72) * 0.56,
          speed: 5 + Math.pow(random(), 1.45) * 10,
          phase: random() * Math.PI * 2,
          twinkleRate: 0.12 + random() * 0.42,
          color,
        };
      });
    };

    const draw = (time: number) => {
      const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        if (!reducedMotion) {
          star.x -= star.speed * deltaSeconds;
          if (star.x < -2) star.x += width + 4;
        }
        const twinkle = 0.88 + Math.sin(time * 0.001 * star.twinkleRate + star.phase) * 0.12;
        const [red, green, blue] = star.color;
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${star.alpha * twinkle})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      }

      if (!reducedMotion) animationFrame = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(() => {
      rebuild();
      if (reducedMotion) draw(performance.now());
    });
    resizeObserver.observe(canvas);
    rebuild();
    draw(previousTime);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <div className="monolith-star-strip" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
