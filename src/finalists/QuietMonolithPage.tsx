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

function ProjectSiteLink({ href, project }: { href: string; project: string }) {
  return <a className="project-site-link" href={href} target="_blank" rel="noreferrer" aria-label={`Visit the ${project} website`}>Visit site <span aria-hidden="true">↗</span></a>;
}

export default function QuietMonolithPage() {
  return (
    <div className="monolith-page" id="monolith-top">
      <header className="monolith-nav">
        <MonolithMark />
        <nav aria-label="Quiet Monolith navigation"><a href="#monolith-work">Work</a><a href="#monolith-about">About</a><a href="#monolith-contact">Contact</a></nav>
      </header>

      <main>
        <section className="monolith-hero monolith-hero--minimal" aria-labelledby="monolith-title">
          <div className="monolith-hero-minimal-copy">
            <h1 id="monolith-title">Damian Kim</h1>
            <p>I like solving hard problems.</p>
            <a href="#monolith-work">Explore the work</a>
          </div>
        </section>

        <section className="monolith-golfie" id="monolith-work">
          <QuietReveal className="monolith-golfie-heading">
            <div><p>01 / CURRENT WORK</p><h2>Golfie</h2></div>
            <div className="monolith-project-intro"><p>Modeling golf mechanics with computer vision, physics, and interactive 3D.</p><ProjectSiteLink href="https://golfie-sim.vercel.app/" project="Golfie" /></div>
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
            <aside><div><span>02 · {supportingProjects[0].type}</span><h3>{supportingProjects[0].name}</h3><ProjectSiteLink href="https://www.juno.rest/" project="Juno" /></div><p>{supportingProjects[0].detail}</p><strong>{supportingProjects[0].result}<small>{supportingProjects[0].resultLabel}</small></strong></aside>
            <div className="monolith-demo-frame"><JunoSourceDemo /></div>
          </QuietReveal>
          <QuietReveal className="monolith-demo-project monolith-demo-project--previous monolith-demo-project--sate">
            <aside><div><span>03 · {supportingProjects[1].type}</span><h3>{supportingProjects[1].name}</h3><ProjectSiteLink href="https://satelab.vercel.app/" project="Sate" /></div><p>{supportingProjects[1].detail}</p><strong>{supportingProjects[1].result}<small>{supportingProjects[1].resultLabel}</small></strong></aside>
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
