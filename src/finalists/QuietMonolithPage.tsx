import { useEffect, useRef } from 'react';
import { animate, createScope, stagger } from 'animejs';
import { experienceProof, supportingProjects } from './content';
import { GolfieDemo } from './ProjectDemos';
import { JunoSourceDemo, SateSourceDemo } from './RealProductDemos';

function MonolithMark() {
  return <a className="monolith-mark" href="#monolith-top" aria-label="Damian Kim, back to top">DK<span>Damian Kim</span></a>;
}

function MonolithBall({ className = '' }: { className?: string }) {
  return (
    <div className={`quiet-ball ${className}`} aria-hidden="true">
      {Array.from({ length: 42 }, (_, index) => <i key={index} />)}
      <span>01<small>GOLFIE</small></span>
    </div>
  );
}

function QuietReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function MonolithHeroReveal() {
  const revealRef = useRef<HTMLDivElement>(null);

  const moveReveal = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--reveal-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--reveal-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <div className="monolith-object-reveal" ref={revealRef} onPointerMove={moveReveal} data-hero>
      <div className="monolith-object-reveal__base">
        <span className="monolith-object-reveal__orbit monolith-object-reveal__orbit--one" />
        <span className="monolith-object-reveal__orbit monolith-object-reveal__orbit--two" />
        <MonolithBall className="quiet-ball--hero" />
        <p>Hover to inspect</p>
      </div>
      <div className="monolith-object-reveal__layer" aria-hidden="true">
        <div className="monolith-object-reveal__glow" />
        <MonolithBall className="quiet-ball--hero quiet-ball--revealed" />
        <div className="monolith-object-reveal__readout">
          <span>01 / CURRENT WORK</span>
          <strong>Golfie</strong>
          <p>Computer vision<br />Physics<br />Interactive 3D</p>
        </div>
      </div>
      <span className="monolith-object-reveal__cursor">REVEAL</span>
    </div>
  );
}

export default function QuietMonolithPage() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scope = createScope({ root: heroRef }).add(() => {
      animate('[data-hero]', {
        opacity: [0, 1],
        y: [22, 0],
        duration: 900,
        delay: stagger(90),
        ease: 'out(4)',
      });
    });
    return () => scope.revert();
  }, []);

  return (
    <div className="monolith-page" id="monolith-top">
      <header className="monolith-nav">
        <MonolithMark />
        <nav aria-label="Quiet Monolith navigation"><a href="#monolith-work">Work</a><a href="#monolith-about">About</a><a href="#monolith-contact">Contact</a></nav>
      </header>

      <main>
        <section className="monolith-hero monolith-hero--reframed" aria-labelledby="monolith-title" ref={heroRef}>
          <div className="monolith-hero-number" data-hero><span>DK / 26</span><i />PRODUCT ENGINEERING</div>
          <div className="monolith-hero-copy">
            <p data-hero>I LIKE TO SOLVE HARD PROBLEMS.</p>
            <h1 id="monolith-title" data-hero>Hard problems.<br /><em>Clear products.</em></h1>
            <div className="monolith-hero-intro" data-hero>
              <p>I turn computer vision, physics, and real-time systems into products people can actually use.</p>
              <a href="#monolith-work">Explore the work <span>↓</span></a>
            </div>
          </div>
          <MonolithHeroReveal />
          <div className="monolith-hero-projects" data-hero>
            <span><b>01</b> Golfie <small>Current</small></span>
            <span><b>02</b> Juno <small>Voice + video</small></span>
            <span><b>03</b> Sate <small>Group discovery</small></span>
          </div>
        </section>

        <section className="monolith-golfie" id="monolith-work">
          <QuietReveal className="monolith-golfie-heading">
            <div><p>01 / CURRENT WORK</p><h2>Golfie</h2></div>
            <p>Modeling golf mechanics with computer vision, physics, and interactive 3D.</p>
          </QuietReveal>
          <QuietReveal className="monolith-featured-demo"><GolfieDemo tone="monolith" /></QuietReveal>
          <div className="monolith-golfie-story">
            <QuietReveal className="monolith-story-chapter">
              <span>01 · SEE</span>
              <h3>Recover depth<br />from two views.</h3>
              <p>Synchronize independent video, calibrate camera geometry, detect the ball, and triangulate its position in three dimensions.</p>
            </QuietReveal>
            <QuietReveal className="monolith-story-chapter">
              <span>02 · MODEL</span>
              <h3>Turn observation<br />into a flight.</h3>
              <p>Estimate launch conditions, then resolve gravity, drag, Magnus lift, bounce, and roll through a custom RK4 physics engine.</p>
            </QuietReveal>
            <QuietReveal className="monolith-story-chapter">
              <span>03 · SHIP</span>
              <h3>Make the invisible<br />feel obvious.</h3>
              <p>Render the reconstructed shot inside an interactive 3D range that makes complex mechanics immediate and explorable.</p>
            </QuietReveal>
          </div>
        </section>

        <section className="monolith-projects">
          <QuietReveal className="monolith-section-heading"><h2>Previous projects</h2></QuietReveal>
          <QuietReveal className="monolith-demo-project monolith-demo-project--previous monolith-demo-project--juno">
            <aside><div><span>02 · {supportingProjects[0].type}</span><h3>{supportingProjects[0].name}</h3></div><p>{supportingProjects[0].detail}</p><strong>{supportingProjects[0].result}<small>{supportingProjects[0].resultLabel}</small></strong></aside>
            <div className="monolith-demo-frame"><JunoSourceDemo /></div>
          </QuietReveal>
          <QuietReveal className="monolith-demo-project monolith-demo-project--previous monolith-demo-project--sate">
            <aside><div><span>03 · {supportingProjects[1].type}</span><h3>{supportingProjects[1].name}</h3></div><p>{supportingProjects[1].detail}</p><strong>{supportingProjects[1].result}<small>{supportingProjects[1].resultLabel}</small></strong></aside>
            <div className="monolith-demo-frame"><SateSourceDemo /></div>
          </QuietReveal>
        </section>

        <section className="monolith-about" id="monolith-about">
          <QuietReveal className="monolith-about-heading"><span>EXPERIENCE</span><h2>Research, production,<br />and teaching.</h2></QuietReveal>
          <div className="monolith-experience">
            {experienceProof.map((item) => (
              <QuietReveal key={item.place}>
                <span>{item.year}</span><h3>{item.place}</h3><p>{item.role}</p><p>{item.summary}</p>{item.metric && <strong>{item.metric}</strong>}
              </QuietReveal>
            ))}
          </div>
        </section>

        <section className="monolith-contact" id="monolith-contact">
          <div className="monolith-contact-glow" aria-hidden="true"><MonolithBall className="quiet-ball--closing" /></div>
          <QuietReveal>
            <p>CONTACT</p>
            <h2>Get in touch.</h2>
            <a href="mailto:damiank0428@gmail.com"><span>Email</span><strong>damiank0428@gmail.com ↗</strong></a>
          </QuietReveal>
          <footer><MonolithMark /><span>DURHAM, NORTH CAROLINA</span><span>© {new Date().getFullYear()}</span></footer>
        </section>
      </main>
    </div>
  );
}
