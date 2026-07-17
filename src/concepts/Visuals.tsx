import { motion } from 'motion/react';

type VisualProps = {
  reducedMotion: boolean;
};

function Mark({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`proto-mark${inverse ? ' proto-mark--inverse' : ''}`}>
      <span>DK</span>
      <i />
      <small>Damian Kim</small>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function FlightLab({ reducedMotion }: VisualProps) {
  return (
    <div className="prototype prototype--flight">
      <header className="proto-header" data-anime>
        <Mark inverse />
        <div className="proto-nav"><span>01 / Golfie</span><span>Work</span><span>About</span></div>
        <span className="proto-status"><i /> Available · ’26</span>
      </header>
      <div className="flight-grid" aria-hidden="true" />
      <section className="flight-copy">
        <p className="proto-kicker" data-anime>FOUNDER · ENGINEER · DURHAM, NC</p>
        <h2 data-anime>Making hard<br />things <em>fly.</em></h2>
        <p className="proto-deck" data-anime>I build ambitious products across computer vision, physics, and real-time systems.</p>
        <div className="proto-actions" data-anime><span className="proto-button">Explore Golfie <Arrow /></span><span>View selected work</span></div>
      </section>
      <div className="flight-visual" aria-hidden="true">
        <svg viewBox="0 0 760 430" preserveAspectRatio="none">
          <defs>
            <pattern id="flight-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeOpacity=".12" />
            </pattern>
          </defs>
          <rect width="760" height="430" fill="url(#flight-grid)" />
          <path className="flight-ghost" d="M8 366 C170 344 214 67 432 82 S644 244 748 304" />
          <motion.path
            className="flight-path"
            d="M8 366 C170 344 214 67 432 82 S644 244 748 304"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <circle cx="432" cy="82" r="4" className="flight-apex" />
          <motion.circle
            className="flight-ball-svg"
            r="5"
            animate={reducedMotion
              ? { cx: 432, cy: 82, opacity: 1 }
              : {
                  cx: [8, 90, 190, 310, 432, 560, 660, 748],
                  cy: [366, 320, 170, 93, 82, 130, 232, 304],
                  opacity: [0, 1, 1, 1, 1, 1, 1, 0],
                }}
            transition={{ duration: 4.8, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
        <div className="flight-reading flight-reading--one" data-anime><small>APEX</small><strong>27.4 m</strong></div>
        <div className="flight-reading flight-reading--two" data-anime><small>CARRY</small><strong>186.2 m</strong></div>
        <div className="flight-coordinates" data-anime>RK4 · C<sub>d</sub> 0.24 · 3,100 RPM</div>
      </div>
      <div className="flight-foot" data-anime><span>SCROLL TO TRACE THE BUILD</span><i /><span>01—07</span></div>
    </div>
  );
}

function TwinLens({ reducedMotion }: VisualProps) {
  const reticleMotion = reducedMotion ? {} : { x: [0, 18, -8, 0], y: [0, -9, 5, 0] };
  return (
    <div className="prototype prototype--lens">
      <header className="lens-header" data-anime><Mark inverse /><span>STEREO PORTFOLIO / 2026</span><span>INDEX +</span></header>
      <div className="lens-panes" aria-hidden="true">
        <div className="lens-pane lens-pane--a"><span className="lens-meta">CAMERA A · 60 FPS</span><i className="lens-horizon" /><motion.i className="lens-reticle" animate={reticleMotion} transition={{ duration: 5, repeat: Infinity }} /></div>
        <div className="lens-pane lens-pane--b"><span className="lens-meta">CAMERA B · Δ 4.6 M</span><i className="lens-horizon" /><motion.i className="lens-reticle" animate={reticleMotion} transition={{ duration: 5, repeat: Infinity, delay: .12 }} /></div>
        <svg className="lens-rays" viewBox="0 0 1000 520" preserveAspectRatio="none">
          <motion.path d="M160 375 L500 185 L840 352" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 1.4 }} />
          <motion.path d="M160 375 L500 185" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reducedMotion ? 0 : 1.4, delay: .15 }} />
        </svg>
      </div>
      <section className="lens-copy">
        <p data-anime>TWO VIEWS · ONE MODEL</p>
        <h2 data-anime>I teach machines<br />to see <em>what matters.</em></h2>
        <div data-anime className="lens-lock"><span><i /> TARGET ACQUIRED</span><strong>X 12.42 · Y 4.81 · Z 86.03</strong></div>
      </section>
      <div className="lens-footer" data-anime><span>Golfie / Stereo reconstruction</span><span>Enter case study <Arrow /></span></div>
    </div>
  );
}

function SystemsFoundry(_: VisualProps) {
  return (
    <div className="prototype prototype--foundry">
      <header className="foundry-header" data-anime><Mark /><span>SELECTED SYSTEMS — VOL. 01</span><span>MENU (05)</span></header>
      <section className="foundry-copy">
        <p className="foundry-issue" data-anime>ENGINEERING JOURNAL<br />JULY 2026</p>
        <h2 data-anime>Built, not<br /><em>assembled.</em></h2>
        <p data-anime>Damian Kim designs products from the model up—where software, physics, and people meet.</p>
      </section>
      <div className="foundry-machine" aria-hidden="true" data-anime>
        <div className="foundry-label"><span>FIG. 01</span><strong>GOLFIE SYSTEM</strong></div>
        <div className="machine-rail"><i /><i /><i /><i /><i /><i /></div>
        <div className="machine-piece piece-a"><span>A</span><small>CAPTURE</small></div>
        <div className="machine-piece piece-b"><span>B</span><small>TRIANGULATE</small></div>
        <div className="machine-piece piece-c"><span>C</span><small>SIMULATE</small></div>
        <svg viewBox="0 0 600 300"><path d="M62 217 C155 212 180 58 302 78 S433 197 548 173" /></svg>
      </div>
      <div className="foundry-marquee" aria-hidden="true"><span>COMPUTER VISION — PHYSICS — PRODUCT — REAL-TIME SYSTEMS —</span><span>COMPUTER VISION — PHYSICS — PRODUCT — REAL-TIME SYSTEMS —</span></div>
    </div>
  );
}

function ProjectOrbit({ reducedMotion }: VisualProps) {
  return (
    <div className="prototype prototype--orbit">
      <header className="orbit-header" data-anime><Mark inverse /><span>WORK CONSTELLATION</span><span>ABOUT · CONTACT</span></header>
      <section className="orbit-copy">
        <p data-anime>BUILD / MODEL / SHIP</p>
        <h2 data-anime>Different systems.<br />One <em>practice.</em></h2>
        <span data-anime>Move through the work <Arrow /></span>
      </section>
      <div className="orbit-map" aria-hidden="true">
        <motion.div className="orbit-ring orbit-ring--one" animate={reducedMotion ? {} : { rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
          <span className="orbit-node node-golfie"><i />GOLFIE<small>VISION + PHYSICS</small></span>
          <span className="orbit-node node-juno"><i />JUNO<small>REAL-TIME</small></span>
        </motion.div>
        <motion.div className="orbit-ring orbit-ring--two" animate={reducedMotion ? {} : { rotate: -360 }} transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}>
          <span className="orbit-node node-sate"><i />SATE<small>RECOMMENDATION</small></span>
          <span className="orbit-node node-mayo"><i />MAYO<small>ML SYSTEMS</small></span>
          <span className="orbit-node node-nasa"><i />NASA<small>COMPUTER VISION</small></span>
        </motion.div>
        <div className="orbit-core"><span>DK</span><small>PRODUCT<br />ENGINEER</small></div>
      </div>
      <div className="orbit-axis" aria-hidden="true"><i /><span>01 / 05</span><i /></div>
    </div>
  );
}

function KineticThesis(_: VisualProps) {
  return (
    <div className="prototype prototype--kinetic">
      <header className="kinetic-header" data-anime><Mark /><span>PRODUCT ENGINEER<br />DURHAM / NC</span><span>WORK (03)<br />INFO +</span></header>
      <section className="kinetic-copy">
        <h2 data-anime>I MAKE</h2>
        <div className="kinetic-middle" data-anime>
          <span className="kinetic-project"><small>NOW BUILDING</small><strong>GOLFIE</strong><i>↘</i></span>
          <h2>HARD THINGS</h2>
        </div>
        <h2 data-anime><em>REAL.</em></h2>
      </section>
      <div className="kinetic-stamp" data-anime><span>AI</span><span>CV</span><span>ML</span><span>01</span></div>
      <div className="kinetic-footer" data-anime><p>From dual-camera reconstruction to low-latency communication systems.</p><span>Selected work <Arrow /></span></div>
    </div>
  );
}

function FounderOs({ reducedMotion }: VisualProps) {
  return (
    <div className="prototype prototype--os">
      <header className="os-menubar" data-anime><Mark inverse /><span>Portfolio</span><span>Projects</span><span>Experiments</span><span className="os-clock">DK.OS · 09:41</span></header>
      <div className="os-desktop">
        <motion.div className="os-window os-window--main" initial={{ scale: reducedMotion ? 1 : .94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 130, damping: 18 }}>
          <div className="os-windowbar"><span><i /><i /><i /></span><strong>Golfie — Live build</strong><small>⌘1</small></div>
          <div className="os-main-content">
            <p>FOUNDER PROCESS · ACTIVE</p>
            <h2>Turning two iPhones<br />into a <em>launch monitor.</em></h2>
            <div className="os-trajectory" aria-hidden="true"><svg viewBox="0 0 700 230"><path d="M4 210 C145 205 166 36 352 44 S570 156 696 180" /></svg><i /></div>
            <span className="os-open">Open project <Arrow /></span>
          </div>
        </motion.div>
        <motion.div className="os-window os-window--status" initial={{ x: reducedMotion ? 0 : 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: .2 }}>
          <div className="os-windowbar"><strong>System status</strong><small>LIVE</small></div>
          <ul><li><i />Vision calibrated <b>100%</b></li><li><i />Physics online <b>RK4</b></li><li><i />Founder mode <b>ON</b></li></ul>
        </motion.div>
        <motion.div className="os-command" initial={{ y: reducedMotion ? 0 : 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .35 }}><span>⌘K</span><p>Search projects or run a command…</p><kbd>↵</kbd></motion.div>
      </div>
      <div className="os-dock" data-anime><span className="active">G</span><span>J</span><span>S</span><span>⌁</span><i /><span>↗</span></div>
    </div>
  );
}

function BuildChronicle(_: VisualProps) {
  return (
    <div className="prototype prototype--chronicle">
      <header className="chronicle-header" data-anime><Mark /><span>FIELD NOTES ON BUILDING<br />DIFFICULT SOFTWARE</span><span>ARCHIVE · 2021—26</span></header>
      <div className="chronicle-margin" aria-hidden="true"><span>VOL. I</span><i /><span>DK</span></div>
      <section className="chronicle-copy">
        <p data-anime>ENTRY 042 · DURHAM, NORTH CAROLINA</p>
        <h2 data-anime>Can two phones<br /><em>see one flight?</em></h2>
        <p data-anime>The question became a calibration system, a detection pipeline, a physics engine—and eventually, Golfie.</p>
        <span data-anime>Read the build note <Arrow /></span>
      </section>
      <div className="chronicle-artifact" data-anime>
        <div className="artifact-paper"><span>EXPERIMENT 07/26</span><svg viewBox="0 0 420 260"><path d="M20 224 C76 217 98 68 212 82 S335 198 402 177" /><path d="M20 224H402M20 224V24" /></svg><small>Trajectory fit / Magnus lift enabled</small></div>
        <div className="artifact-note">Observation 03<br /><b>Spin changes everything.</b><i /></div>
      </div>
      <div className="chronicle-index" data-anime><span>PREVIOUS<br /><b>NASA / 2021</b></span><span>NEXT<br /><b>MAYO / 2023</b></span></div>
    </div>
  );
}

function OpticalField({ reducedMotion }: VisualProps) {
  return (
    <div className="prototype prototype--optical">
      <header className="optical-header" data-anime><Mark /><span>Damian Kim / Selected Work</span><span>Index <b>+</b></span></header>
      <div className="optical-grid" aria-hidden="true" />
      <section className="optical-copy">
        <p data-anime>ENGINEER · DESIGNER · FOUNDER</p>
        <h2 data-anime>Building tools<br />that change<br /><em>what we can see.</em></h2>
        <div data-anime><span>Enter the portfolio</span><Arrow /></div>
      </section>
      <motion.div className="optical-lens" aria-hidden="true" animate={reducedMotion ? {} : { x: [0, 22, -14, 0], y: [0, -18, 12, 0], rotate: [0, 4, -3, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}>
        <i className="optical-lens-core" /><i className="optical-lens-orbit" /><span>01</span>
      </motion.div>
      <div className="optical-projects" data-anime><span>01 Golfie</span><span>02 Juno</span><span>03 Sate</span><i /></div>
    </div>
  );
}

function TelemetryDeck({ reducedMotion }: VisualProps) {
  const barTransition = { duration: reducedMotion ? 0 : 1.1, ease: 'easeOut' as const };
  return (
    <div className="prototype prototype--telemetry">
      <header className="telemetry-header" data-anime><Mark inverse /><span>DK / SYSTEMS</span><span className="telemetry-live"><i /> LIVE PORTFOLIO</span><span>INDEX [10]</span></header>
      <section className="telemetry-title" data-anime><p>ENGINEERED FROM FIRST PRINCIPLES</p><h2>Ideas are better<br /><em>when they run.</em></h2></section>
      <div className="telemetry-deck" aria-hidden="true">
        <div className="telemetry-card telemetry-card--flight" data-anime><header><span>TRAJECTORY / GOLFIE</span><b>ACTIVE</b></header><svg viewBox="0 0 500 190"><motion.path d="M5 173 C92 169 122 22 252 38 S397 151 495 139" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={barTransition} /><path className="telemetry-area" d="M5 173 C92 169 122 22 252 38 S397 151 495 139V190H5Z" /></svg><footer><span>186.2 M</span><span>27.4 M</span><span>5.82 S</span></footer></div>
        <div className="telemetry-card telemetry-card--pipeline" data-anime><header><span>PIPELINE</span><b>7 STAGES</b></header><div className="pipeline-flow"><span>CAPTURE</span><i /><span>DETECT</span><i /><span>MODEL</span><i /><span>RENDER</span></div></div>
        <div className="telemetry-card telemetry-card--proof" data-anime><header><span>PRODUCTION PROOF</span><b>MAYO</b></header><strong>20×</strong><p>less repeated scan volume</p><div><motion.i initial={{ width: 0 }} animate={{ width: '84%' }} transition={barTransition} /></div></div>
        <div className="telemetry-card telemetry-card--domains" data-anime><header><span>OPERATING DOMAINS</span><b>05</b></header><ul><li>Computer vision <i style={{ width: '88%' }} /></li><li>Product systems <i style={{ width: '76%' }} /></li><li>Applied ML <i style={{ width: '68%' }} /></li></ul></div>
      </div>
      <div className="telemetry-footer" data-anime><span>OPEN GOLFIE CASE STUDY</span><span>LAUNCH DEMO <Arrow /></span></div>
    </div>
  );
}

function QuietMonolith({ reducedMotion }: VisualProps) {
  return (
    <div className="prototype prototype--monolith">
      <header className="monolith-header" data-anime><Mark inverse /><span>WORK</span><span>ABOUT</span><span>CONTACT</span></header>
      <section className="monolith-copy">
        <p data-anime>DAMIAN KIM · PRODUCT ENGINEER</p>
        <h2 data-anime>I build what<br />doesn’t <em>exist yet.</em></h2>
        <span data-anime>Discover the work <Arrow /></span>
      </section>
      <motion.div className="monolith-ball" aria-hidden="true" initial={{ scale: reducedMotion ? 1 : .82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 1.6, ease: [0.16, 1, 0.3, 1] }}>
        {Array.from({ length: 28 }).map((_, index) => <i key={index} />)}
        <span>GOLFIE<br /><small>01 / 03</small></span>
      </motion.div>
      <div className="monolith-caption" data-anime><span>Two cameras.<br />One reconstructed flight.</span><i /><span>Scroll<br />to launch</span></div>
    </div>
  );
}

export function ConceptVisual({ id, reducedMotion }: VisualProps & { id: string }) {
  switch (id) {
    case 'flight-lab': return <FlightLab reducedMotion={reducedMotion} />;
    case 'twin-lens': return <TwinLens reducedMotion={reducedMotion} />;
    case 'systems-foundry': return <SystemsFoundry reducedMotion={reducedMotion} />;
    case 'project-orbit': return <ProjectOrbit reducedMotion={reducedMotion} />;
    case 'kinetic-thesis': return <KineticThesis reducedMotion={reducedMotion} />;
    case 'founder-os': return <FounderOs reducedMotion={reducedMotion} />;
    case 'build-chronicle': return <BuildChronicle reducedMotion={reducedMotion} />;
    case 'optical-field': return <OpticalField reducedMotion={reducedMotion} />;
    case 'telemetry-deck': return <TelemetryDeck reducedMotion={reducedMotion} />;
    case 'quiet-monolith': return <QuietMonolith reducedMotion={reducedMotion} />;
    default: return null;
  }
}
