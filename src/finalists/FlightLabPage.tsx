import { motion } from 'motion/react';
import { experienceProof, golfiePipeline, principles, supportingProjects } from './content';
import { GolfieDemo, JunoDemo, SateDemo } from './ProjectDemos';

function FlightMark() {
  return <a className="flight-mark" href="#flight-top" aria-label="Damian Kim, back to top"><b>DK</b><i /><span>DAMIAN KIM<br />PRODUCT ENGINEER</span></a>;
}

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return <div className="flight-section-label"><span>{index}</span><i /><strong>{children}</strong></div>;
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function StereoPhone({ camera, offset }: { camera: 'A' | 'B'; offset: number }) {
  return (
    <div className={`stereo-phone stereo-phone--${camera.toLowerCase()}`}>
      <header><span>CAMERA {camera}</span><span>60 FPS · 4K</span></header>
      <div className="stereo-feed">
        <div className="stereo-horizon" />
        <motion.i
          className="stereo-ball"
          animate={{ x: [offset - 8, offset + 8, offset - 8], y: [5, -5, 5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="stereo-reticle"
          animate={{ x: [offset - 8, offset + 8, offset - 8], y: [5, -5, 5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <small>X 1142 · Y 0638<br />CONF .982</small>
      </div>
      <footer><span>ISO 160</span><i /><span>1/1000</span></footer>
    </div>
  );
}

export default function FlightLabPage() {
  return (
    <div className="flight-page" id="flight-top">
      <header className="flight-nav">
        <FlightMark />
        <nav aria-label="Flight Lab navigation">
          <a href="#golfie">Golfie</a>
          <a href="#flight-work">Work</a>
          <a href="#flight-proof">Proof</a>
        </nav>
        <a className="flight-contact-link" href="mailto:damiank0428@gmail.com"><i /> Start a conversation ↗</a>
      </header>

      <main>
        <section className="flight-hero" aria-labelledby="flight-hero-title">
          <div className="flight-hero-grid" aria-hidden="true" />
          <div className="flight-hero-copy">
            <p data-flight-intro>PROJECT SHOWROOM · THREE SHIPPED SYSTEMS</p>
            <h1 id="flight-hero-title" data-flight-intro>Products that<br /><em>prove the work.</em></h1>
            <div className="flight-hero-lower" data-flight-intro>
              <p>Operate the models, communication flows, and recommendation logic—not a decorative portfolio scene.</p>
              <a href="#golfie">Open the projects <span>↓</span></a>
            </div>
          </div>
          <div className="flight-hero-demo" data-flight-intro><GolfieDemo compact /></div>

          <div className="flight-hero-footer" data-flight-intro>
            <span>01 / GOLFIE</span><i /><span>STEREO VISION · RK4 PHYSICS · PRODUCT</span>
          </div>
        </section>

        <section className="flight-proof-strip" aria-label="Selected engineering outcomes">
          <div><span>FLAGSHIP</span><strong>Dual-iPhone 3D reconstruction</strong></div>
          <div><span>REAL-TIME</span><strong>&lt;200 ms cross-border latency</strong></div>
          <div><span>DATA</span><strong>20× lower repeat scan volume</strong></div>
          <div><span>RESEARCH</span><strong>NASA computer vision</strong></div>
        </section>

        <section className="flight-flagship" id="golfie">
          <SectionLabel index="01">THE FLAGSHIP BUILD</SectionLabel>
          <Reveal className="flight-flagship-heading">
            <p>GOLFIE · FOUNDER & SOFTWARE ENGINEER · 2026</p>
            <h2>Two phones.<br />One reconstructed <em>flight.</em></h2>
          </Reveal>
          <Reveal className="flight-flagship-intro">
            <p>Golf launch monitors are expensive, specialized machines. Golfie asks a more ambitious question:</p>
            <blockquote>Can the cameras already in your pocket understand a golf shot in 3D?</blockquote>
          </Reveal>
          <div className="flight-flagship-stats">
            <Reveal><span>02</span><p>independent cameras</p></Reveal>
            <Reveal><span>3D</span><p>trajectory reconstruction</p></Reveal>
            <Reveal><span>RK4</span><p>numerical integration</p></Reveal>
            <Reveal><span>01</span><p>complete product loop</p></Reveal>
          </div>
        </section>

        <section className="flight-stereo">
          <div className="flight-stereo-copy">
            <SectionLabel index="02">SEEING IN DEPTH</SectionLabel>
            <Reveal>
              <h2>One camera sees a point.<br /><em>Two recover a world.</em></h2>
              <p>Golfie synchronizes two independent video streams, calibrates their geometry, detects the ball in each image plane, and triangulates its position through time.</p>
            </Reveal>
          </div>
          <Reveal className="stereo-stage">
            <StereoPhone camera="A" offset={-6} />
            <StereoPhone camera="B" offset={9} />
            <svg className="stereo-rays" viewBox="0 0 1000 420" aria-hidden="true">
              <path d="M210 280 L500 92 L790 267" />
              <circle cx="500" cy="92" r="5" />
            </svg>
            <div className="stereo-lock"><i /> 3D POINT LOCKED <span>X 12.42 · Y 4.81 · Z 86.03</span></div>
          </Reveal>
        </section>

        <section className="flight-pipeline">
          <SectionLabel index="03">FROM PIXELS TO PHYSICS</SectionLabel>
          <Reveal className="flight-pipeline-heading"><h2>The whole system,<br /><em>not one clever model.</em></h2><p>Each stage turns uncertain observation into a useful, explorable product.</p></Reveal>
          <div className="pipeline-list">
            {golfiePipeline.map(([number, title, description]) => (
              <Reveal className="pipeline-item" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{description}</p><i />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="flight-live-lab">
          <SectionLabel index="04">THE LIVE MODEL</SectionLabel>
          <Reveal className="flight-lab-heading"><div><p>THE ACTUAL GOLFIE RANGE</p><h2>Use the product.</h2></div><p>Replay the shot, compare predicted rollout, stereo observations, and the physics launch fit, or switch to the free camera to inspect the range.</p></Reveal>
          <Reveal><GolfieDemo /></Reveal>
        </section>

        <section className="flight-selected-work" id="flight-work">
          <SectionLabel index="05">ALSO SHIPPED</SectionLabel>
          <Reveal className="flight-work-heading"><h2>Two more products.<br /><em>Both interactive.</em></h2></Reveal>
          <div className="flight-demo-showcases">
            <Reveal className="flight-demo-showcase">
              <div className="flight-demo-frame"><JunoDemo /></div>
              <div className="flight-demo-copy"><span>02 · {supportingProjects[0].type}</span><h3>{supportingProjects[0].name}</h3><p>{supportingProjects[0].detail}</p><strong>{supportingProjects[0].result}<small>{supportingProjects[0].resultLabel}</small></strong><footer>{supportingProjects[0].tags.map((tag) => <i key={tag}>{tag}</i>)}</footer></div>
            </Reveal>
            <Reveal className="flight-demo-showcase flight-demo-showcase--reverse">
              <div className="flight-demo-frame"><SateDemo /></div>
              <div className="flight-demo-copy"><span>03 · {supportingProjects[1].type}</span><h3>{supportingProjects[1].name}</h3><p>{supportingProjects[1].detail}</p><strong>{supportingProjects[1].result}<small>{supportingProjects[1].resultLabel}</small></strong><footer>{supportingProjects[1].tags.map((tag) => <i key={tag}>{tag}</i>)}</footer></div>
            </Reveal>
          </div>
        </section>

        <section className="flight-production-proof" id="flight-proof">
          <SectionLabel index="06">PROVEN IN THE WILD</SectionLabel>
          <Reveal className="flight-proof-heading"><p>Before founding Golfie, I built in research labs, healthcare AI, and the classroom.</p><h2>Curiosity,<br />under <em>pressure.</em></h2></Reveal>
          <div className="flight-experience-list">
            {experienceProof.map((item) => (
              <Reveal className="flight-experience" key={item.place}>
                <span>{item.year}</span><div><h3>{item.place}</h3><p>{item.role}</p></div><p>{item.summary}</p><strong>{item.metric ?? 'VIEW STORY ↗'}</strong>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="flight-principles">
          <SectionLabel index="07">HOW I BUILD</SectionLabel>
          <div className="flight-principles-grid">
            {principles.map((principle) => (
              <Reveal key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.copy}</p></Reveal>
            ))}
          </div>
        </section>

        <section className="flight-closing">
          <div className="closing-trajectory" aria-hidden="true"><svg viewBox="0 0 1000 350" preserveAspectRatio="none"><path d="M8 310 C190 299 278 49 517 70 S807 261 990 275" /></svg></div>
          <p>THE NEXT HARD THING</p>
          <h2>Let’s build<br />what comes <em>next.</em></h2>
          <a href="mailto:damiank0428@gmail.com"><span>Start a conversation</span><strong>damiank0428@gmail.com ↗</strong></a>
          <footer><FlightMark /><span>DUKE CS + MATHEMATICS · CLASS OF 2027</span><span>© {new Date().getFullYear()}</span></footer>
        </section>
      </main>
    </div>
  );
}
