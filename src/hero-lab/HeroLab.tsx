import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';

const concepts = [
  ['01', 'Orbital system'], ['02', 'Technical artifacts'], ['03', 'Trajectory field'],
  ['04', 'Liquid glass'], ['05', 'Experiment constellation'], ['06', 'Impossible desktop'],
  ['07', 'Shadow sculpture'], ['08', 'Contour landscape'],
] as const;

function HeroTitle({ eyebrow }: { eyebrow: string }) {
  return <div className="hero-title"><span>{eyebrow}</span><h2>Damian Kim</h2><p>I like solving hard problems.</p></div>;
}

function Study({ index, title, note, children }: { index: string; title: string; note: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const move = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${(event.clientX - rect.left) / rect.width - .5}`);
    event.currentTarget.style.setProperty('--my', `${(event.clientY - rect.top) / rect.height - .5}`);
  };
  return (
    <section ref={ref} className={`study study-${index}`} data-study onPointerMove={move}>
      <header><span>{index} / 08</span><strong>{title}</strong><p>{note}</p></header>
      <div className="stage">{children}</div>
    </section>
  );
}

function OrbitHero() {
  return <div className="orbit-hero hero-scene">
    <div className="orbit-ring orbit-ring-a"><div className="orbit-object orbit-ball"><i /></div></div>
    <div className="orbit-ring orbit-ring-b"><div className="orbit-object orbit-wave"><i /><i /><i /><i /><i /></div></div>
    <div className="orbit-ring orbit-ring-c"><div className="orbit-object orbit-card"><b>SATE</b><small>36.2° N</small></div></div>
    <div className="orbit-label label-a">GOLFIE / FLIGHT</div><div className="orbit-label label-b">JUNO / RTC</div><div className="orbit-label label-c">SATE / CONSENSUS</div>
    <HeroTitle eyebrow="PRODUCT ENGINEER · 2026" />
  </div>;
}

function ArtifactsHero() {
  return <div className="artifacts-hero hero-scene">
    <div className="artifact calibration"><span>CAM A</span>{Array.from({ length: 20 }, (_, i) => <i key={i} />)}</div>
    <div className="artifact telemetry"><span>SIM / 001</span><b>142.8</b><small>YDS CARRY</small><svg viewBox="0 0 180 55"><path d="M3 48 Q50 2 98 18 T177 8" /></svg></div>
    <div className="artifact signal"><span>VOICE / LIVE</span><div>{Array.from({ length: 15 }, (_, i) => <i key={i} />)}</div></div>
    <div className="artifact coord"><b>35.9940</b><small>−78.8986</small><i /></div>
    <HeroTitle eyebrow="SEE · MODEL · SHIP" />
  </div>;
}

function TrajectoryHero() {
  return <div className="trajectory-hero hero-scene">
    <div className="trajectory-grid" />
    <svg className="trajectory-svg" viewBox="0 0 1200 650" preserveAspectRatio="none">
      <path className="trajectory-shadow" d="M-30 550 C250 505 285 65 610 88 S950 450 1230 535" />
      <path className="trajectory-line" d="M-30 550 C250 505 285 65 610 88 S950 450 1230 535" />
      <circle className="trajectory-ball" r="8"><animateMotion dur="7s" repeatCount="indefinite" path="M-30 550 C250 505 285 65 610 88 S950 450 1230 535" /></circle>
    </svg>
    <span className="metric metric-apex">APEX<br /><b>31.4 M</b></span><span className="metric metric-spin">SPIN<br /><b>2,840 RPM</b></span><span className="metric metric-carry">CARRY<br /><b>244.6 YD</b></span>
    <HeroTitle eyebrow="COMPUTER VISION / FLIGHT DYNAMICS" />
  </div>;
}

function GlassHero() {
  return <div className="glass-hero hero-scene">
    <div className="glass-grid" /><div className="glass-glow" />
    <div className="glass-lens lens-one"><i /></div><div className="glass-lens lens-two"><i /></div>
    <div className="glass-index">DK<br /><span>01—03</span></div>
    <HeroTitle eyebrow="DESIGNING SYSTEMS THAT MOVE" />
  </div>;
}

function ConstellationHero() {
  const nodes = [[12, 22], [27, 39], [43, 17], [58, 44], [76, 20], [88, 39], [19, 72], [38, 78], [63, 70], [82, 81]];
  return <div className="constellation-hero hero-scene">
    <svg className="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 22 L27 39 L43 17 L58 44 L76 20 L88 39 L82 81 L63 70 L38 78 L19 72 L27 39 M58 44 L63 70 M43 17 L76 20" /></svg>
    {nodes.map(([x, y], i) => <i className="constellation-node" key={i} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -.3}s` }} />)}
    <span className="constellation-label con-vision">VISION</span><span className="constellation-label con-physics">PHYSICS</span><span className="constellation-label con-rtc">REAL-TIME</span><span className="constellation-label con-render">RENDERING</span>
    <HeroTitle eyebrow="CONNECTED BY CURIOSITY" />
  </div>;
}

function DesktopHero() {
  return <div className="desktop-hero hero-scene">
    <div className="desktop-floor" />
    <div className="float-window window-code"><header><i /><i /><i /><span>trajectory.ts</span></header><pre><em>const</em> force = drag{`\n`}  + magnus + gravity;{`\n`}{`\n`}integrate(force, dt);</pre></div>
    <div className="float-window window-call"><header><i /><i /><i /><span>juno / live</span></header><div className="call-avatar">DK</div><div className="call-wave">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div><small>CONNECTED · 18 MS</small></div>
    <div className="float-window window-map"><header><i /><i /><i /><span>sate / nearby</span></header><div className="map-route"><i /><i /><i /></div><b>3 people agree</b></div>
    <HeroTitle eyebrow="BUILDING ACROSS THE STACK" />
  </div>;
}

function SculptureHero() {
  return <div className="sculpture-hero hero-scene">
    <div className="sculpture-light" /><div className="sculpture"><i className="sculpture-core" />{Array.from({ length: 8 }, (_, i) => <i className={`sculpture-ring ring-${i}`} key={i} />)}</div>
    <div className="sculpture-caption"><span>OBJECT 01</span><b>Complexity,<br />made tangible.</b></div>
    <HeroTitle eyebrow="ENGINEER · DESIGNER · FOUNDER" />
  </div>;
}

function ContourHero() {
  const curves = Array.from({ length: 18 }, (_, i) => {
    const y = 45 + i * 31;
    const bend = (i % 5) * 18;
    return `M-30 ${y} C220 ${y - 80 - bend} 340 ${y + 100} 590 ${y - 10} S920 ${y - 100 + bend} 1230 ${y + 8}`;
  });
  return <div className="contour-hero hero-scene">
    <div className="contour-spot" /><svg className="contour-svg" viewBox="0 0 1200 650" preserveAspectRatio="none">{curves.map((d, i) => <path d={d} key={i} style={{ animationDelay: `${i * -.18}s` }} />)}</svg>
    <span className="contour-coordinate">35° 59′ 38″ N<br />78° 53′ 55″ W</span><span className="contour-elevation">ELEV / 122 M</span>
    <HeroTitle eyebrow="TURNING SIGNAL INTO SHAPE" />
  </div>;
}

export default function HeroLab() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => document.querySelectorAll<HTMLElement>('[data-study]').forEach((study) => {
        const rect = study.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / (window.innerHeight + rect.height) * 2));
        study.style.setProperty('--progress', progress.toFixed(3));
      }));
    };
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);

  return <main className="hero-lab">
    <nav className="lab-nav"><a href="/finalists.html?direction=monolith">← Portfolio</a><span>DK / HERO LAB</span><b>8 STUDIES</b></nav>
    <header className="lab-intro"><p>BACKGROUND STUDIES / 2026</p><h1>Same name.<br /><em>Different gravity.</em></h1><div><p>Eight interactive directions for the opening moment. Move your pointer. Scroll slowly. Nothing here touches the live portfolio.</p><span>SCROLL TO EXPLORE ↓</span></div></header>
    <Study index="01" title={concepts[0][1]} note="Three projects orbit one calm center."><OrbitHero /></Study>
    <Study index="02" title={concepts[1][1]} note="Fragments of the work drift through depth."><ArtifactsHero /></Study>
    <Study index="03" title={concepts[2][1]} note="A flight path becomes the transition."><TrajectoryHero /></Study>
    <Study index="04" title={concepts[3][1]} note="Refraction, light, and oversized glass."><GlassHero /></Study>
    <Study index="05" title={concepts[4][1]} note="Skills connect into a living system."><ConstellationHero /></Study>
    <Study index="06" title={concepts[5][1]} note="Products float as impossible windows."><DesktopHero /></Study>
    <Study index="07" title={concepts[6][1]} note="One cinematic object, barely revealed."><SculptureHero /></Study>
    <Study index="08" title={concepts[7][1]} note="Topography bends around the name."><ContourHero /></Study>
    <footer className="lab-footer"><span>END OF STUDIES</span><a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</a></footer>
  </main>;
}
