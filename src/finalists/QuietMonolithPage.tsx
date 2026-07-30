import { experienceProof, principles, supportingProjects } from './content';
import { GolfieDemo } from './ProjectDemos';
import { MonolithProductExpansion, SateSourceDemo } from './RealProductDemos';

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

export default function QuietMonolithPage() {
  return (
    <div className="monolith-page" id="monolith-top">
      <header className="monolith-nav">
        <MonolithMark />
        <nav aria-label="Quiet Monolith navigation"><a href="#monolith-work">Work</a><a href="#monolith-about">About</a><a href="#monolith-contact">Contact</a></nav>
        <span><i /> Available for ambitious work</span>
      </header>

      <main>
        <section className="monolith-hero" aria-labelledby="monolith-title">
          <div className="monolith-hero-copy">
            <p>PRODUCT ENGINEER · FOUNDER</p>
            <h1 id="monolith-title">I build what<br />doesn’t <em>exist yet.</em></h1>
            <a href="#monolith-intro">Discover the work <span>↓</span></a>
          </div>
          <MonolithBall className="monolith-hero-object quiet-ball--hero" />
          <div className="monolith-hero-caption"><span>GOLFIE · 2026</span><i /><span>Two cameras.<br />One reconstructed flight.</span></div>
        </section>

        <section className="monolith-intro" id="monolith-intro">
          <QuietReveal>
            <span>THE PRACTICE</span>
            <p>Some ideas begin as products.<br />Mine often begin as <em>impossible questions.</em></p>
          </QuietReveal>
          <QuietReveal className="monolith-intro-detail">
            <p>I work where software meets the physical world—computer vision, mathematical models, real-time systems, and the interfaces that make them useful.</p>
            <span>Damian Kim<br />Duke CS + Mathematics</span>
          </QuietReveal>
        </section>

        <section className="monolith-golfie" id="monolith-work">
          <QuietReveal className="monolith-golfie-heading">
            <div><p>01 / FLAGSHIP PROJECT</p><h2>Golfie</h2></div>
            <p>A dual-iPhone launch monitor built across computer vision, numerical physics, and interactive 3D.</p>
          </QuietReveal>
          <QuietReveal className="monolith-featured-demo"><GolfieDemo tone="monolith" /></QuietReveal>
          <MonolithProductExpansion />
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

        <section className="monolith-thesis">
          <p>
            SEE <i /> MODEL <i /> SHIP
          </p>
          <span>ONE CONTINUOUS PRACTICE</span>
        </section>

        <section className="monolith-projects">
          <QuietReveal className="monolith-section-heading"><span>SELECTED SYSTEMS</span><h2>Operate the work.</h2></QuietReveal>
          <QuietReveal className="monolith-demo-project monolith-demo-project--sate">
            <aside><div><span>03 · {supportingProjects[1].type}</span><h3>{supportingProjects[1].name}</h3></div><p>{supportingProjects[1].detail}</p><strong>{supportingProjects[1].result}<small>{supportingProjects[1].resultLabel}</small></strong></aside>
            <div className="monolith-demo-frame"><SateSourceDemo /></div>
          </QuietReveal>
        </section>

        <section className="monolith-about" id="monolith-about">
          <QuietReveal className="monolith-about-heading"><span>THE LONGER LINE</span><h2>Built across<br /><em>research, production,</em><br />and the classroom.</h2></QuietReveal>
          <div className="monolith-experience">
            {experienceProof.map((item) => (
              <QuietReveal key={item.place}>
                <span>{item.year}</span><h3>{item.place}</h3><p>{item.role}</p><p>{item.summary}</p>{item.metric && <strong>{item.metric}</strong>}
              </QuietReveal>
            ))}
          </div>
        </section>

        <section className="monolith-principles">
          <QuietReveal className="monolith-section-heading"><span>OPERATING PRINCIPLES</span><h2>Quiet rigor.<br />Visible results.</h2></QuietReveal>
          <div>
            {principles.map((principle) => (
              <QuietReveal key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.copy}</p></QuietReveal>
            ))}
          </div>
        </section>

        <section className="monolith-contact" id="monolith-contact">
          <div className="monolith-contact-glow" aria-hidden="true"><MonolithBall className="quiet-ball--closing" /></div>
          <QuietReveal>
            <p>WHAT SHOULD EXIST NEXT?</p>
            <h2>Let’s make<br />the difficult <em>real.</em></h2>
            <a href="mailto:damiank0428@gmail.com"><span>Start a conversation</span><strong>damiank0428@gmail.com ↗</strong></a>
          </QuietReveal>
          <footer><MonolithMark /><span>DURHAM, NORTH CAROLINA</span><span>© {new Date().getFullYear()}</span></footer>
        </section>
      </main>
    </div>
  );
}
