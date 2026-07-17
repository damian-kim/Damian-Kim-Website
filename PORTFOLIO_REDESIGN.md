# Damian Kim Portfolio — Design Exploration

## The core recommendation

The portfolio should stop presenting Damian as a student with a list of technologies and start presenting him as a founder-engineer who turns difficult models into working products.

Golfie is the strongest evidence. It combines product invention, stereo computer vision, numerical physics, audio synchronization, parameter fitting, TypeScript, and interactive 3D rendering. That story should occupy roughly 60% of the homepage. Juno, Sate, Mayo, NASA, Duke, and the broader skill set should support the claim rather than compete with it.

The recommended direction is **01 — The Flight Lab**. It has the best combination of:

- A visual language that could only belong to this portfolio
- A clear founder/product narrative
- A spectacular but legible first screen
- A natural reason for every animation
- A direct path from the hero into the existing simulator
- A feasible production scope with graceful mobile and reduced-motion versions

The strongest alternative is **02 — Twin Lens** if the goal is to position Damian more narrowly as a computer-vision specialist. **10 — Quiet Monolith** is the premium, lower-information alternative if timeless restraint matters more than technical density.

## What is worth preserving

- The working RK4 trajectory engine and Three.js driving range
- Golfie’s real stereo-reconstruction problem
- Quantified proof:
  - Juno: sub-200 ms US-to-China latency
  - Sate: roughly 65% higher consensus accuracy
  - Mayo: 20× lower repeated scan volume and 15–70% lower latency
- The combination of computer science, mathematics, design, and teaching
- The current React/Vite foundation if we want a fast iterative build; a framework migration is not necessary to achieve the design

## Current-site audit

### Story and hierarchy

The current page uses a familiar résumé sequence: student badge, developer headline, code editor, sandbox, work timeline, project carousel, skills, contact form. It communicates competence but not the “could build the next great startup” quality in the brief.

Golfie appears in three disconnected ways—a hero mention, a simulator, and a timeline entry—instead of one flagship case study. The project section then excludes it and leads with Juno and Sate. This fragments the best story.

The proposed homepage order is:

1. A one-sentence founder thesis
2. Golfie’s product promise
3. A guided explanation of the dual-camera problem
4. A lightweight trajectory interaction
5. The full Golfie Lab, lazy-loaded on intent or viewport entry
6. Juno and Sate as two supporting systems
7. Mayo and NASA as evidence of production and research range
8. Three operating principles
9. A direct, trustworthy contact ending

Detailed education, coursework, technologies, and complete employment bullets belong on the résumé or an About page.

### Trust problems to fix before launch

- The contact form reports success but does not send a message.
- The visible Damian GitHub label links to the GitHub homepage.
- Hero mail and phone links prevent their normal actions and silently depend on clipboard access.
- There is no LinkedIn link, résumé asset, working demo link, or repository link.
- Several source strings contain mojibake such as `â€“`, `â€”`, and `Â°`.
- The favicon and README are still template artifacts.

### Interaction and responsive problems

- The project carousel’s absolute slides can lose their containing height at tablet breakpoints.
- The mobile canvas height rule targets an unused element; the actual R3F wrapper retains an inline 400 px height.
- The carousel’s inline `display: none` prevents the CSS opacity transition from doing useful work.
- The hero’s “Math & Code” badge is positioned outside a card that clips overflow.
- The mobile menu needs expanded-state semantics, Escape handling, focus management, and scroll locking.
- The WebGL experience has no reduced-motion or accessible static fallback.

### Performance problems

- The original main JavaScript bundle is roughly 1.16 MB minified / 320 KB gzip.
- Three.js and the simulator are eagerly loaded on the homepage.
- The grass scene uses about 120,000 four-blade clumps, producing roughly 4.8 million triangles before the shadow pass.
- Grass animation runs continuously, even if the section is offscreen.
- Ball animation updates React state on frames, triggering repeated scene work.
- MathJax is globally loaded to render one equation.
- Multiple font families are fetched even though most are not used.

The final build should lazy-load Golfie’s WebGL code, use device-adaptive quality tiers, pause offscreen rendering, render a static/mobile alternative, and keep the opening hero independent of Three.js.

## Ten directions

### 01 — The Flight Lab

**Positioning:** Flagship product story.

**Thesis:** Turn Golfie into undeniable proof that Damian can invent, engineer, and ship a difficult product from first principles.

**First screen:** A golf ball launches through a sparse editorial trajectory field. The arc writes part of the headline and resolves into live telemetry: apex, carry, spin, and drag. The final resting point becomes the entrance to the Golfie story.

**Visual system:** OLED black, phosphor lime, fine measurement grids, large humanist typography, compact instrument labels.

**Motion grammar:** Every major transition follows launch, apex, and settle. Anime.js draws the path and sequences telemetry. Motion owns state, scroll-linked transitions, layout changes, and gestures.

**Information architecture:** Hero → Golfie promise → dual-camera problem → vision pipeline → physics model → live lab → supporting projects → production proof → contact.

**Best quality:** Most ownable overall story.

**Risk:** The full simulator must not slow or visually dominate the narrative.

### 02 — Twin Lens

**Positioning:** Computer-vision cinema.

**Thesis:** Make the act of seeing, synchronizing, and reconstructing reality the portfolio’s central metaphor.

**First screen:** Two camera planes search independently, acquire one golf ball, and draw triangulation rays. The reconstructed point expands into the headline.

**Visual system:** Ink black, ultraviolet, split-screen composition, circular optics, crop marks, camera metadata.

**Motion grammar:** Reticles acquire targets; panels drift at different optical depths; focus states snap into precision. On mobile, the two feeds alternate rather than compress side by side.

**Best quality:** The most specifically connected to Damian’s computer-vision work.

**Risk:** It can position Damian too narrowly if the later page does not broaden into product and systems work.

### 03 — Systems Foundry

**Positioning:** Editorial engineering.

**Thesis:** Present every product as a machine made of constraints, decisions, failures, and outcomes.

**First screen:** Oversized serif typography and an animated assembly diagram make the homepage feel like the cover of a premium engineering journal.

**Visual system:** Warm mineral paper, carbon black, safety orange, visible rules, diagrams, radical typographic scale.

**Motion grammar:** Mechanical wipes, stepped counters, ruler ticks, conveyor-like project transitions.

**Best quality:** Excellent case-study readability and mature product judgment.

**Risk:** Less immediately futuristic than the darker concepts.

### 04 — Project Orbit

**Positioning:** Spatial portfolio map.

**Thesis:** Show that the projects belong to one practice connecting sensing, modeling, real-time systems, and product craft.

**First screen:** Golfie, Juno, Sate, Mayo, and NASA orbit a Damian core. Choosing one reorganizes the relationships and opens a conventional case-study page.

**Visual system:** Deep navy, ice blue, radial coordinates, semantic nodes, restrained glass used only to convey depth.

**Motion grammar:** Inertial orbits, magnetic selection, semantic zoom, shared-element transitions.

**Best quality:** Memorable nonlinear exploration.

**Risk:** Must include an obvious linear index and keyboard/mobile alternative.

### 05 — Kinetic Thesis

**Positioning:** Typography as interface.

**Thesis:** Make Damian’s point of view—not a technology list—the first thing visitors remember.

**First screen:** “I MAKE HARD THINGS REAL” continually recomposes around a live Golfie project fragment.

**Visual system:** White, near-black, signal red, oversized variable type, cropped edges, intentional negative space.

**Motion grammar:** Variable-font compression, masked word swaps, sharp editorial cuts, scroll-controlled type choreography.

**Best quality:** The highest creative-technology confidence with comparatively little asset dependency.

**Risk:** The copy needs to be excellent; the layout makes every weak sentence visible.

### 06 — Founder OS

**Positioning:** Productive operating environment.

**Thesis:** Treat projects, experiments, writing, and contact as tools inside Damian’s live workspace.

**First screen:** A calm desktop assembles around an active Golfie process. A system window reports “Vision calibrated,” “Physics online,” and “Founder mode active.”

**Visual system:** Graphite, warm amber, compact utilities, tactile panels, a quiet command surface.

**Motion grammar:** Spring windows, command-palette morphs, contextual previews, keyboard-first navigation.

**Best quality:** Highly usable, playful, and product-like.

**Risk:** Desktop metaphors become gimmicks quickly. Mobile needs a purpose-built application shell, not miniature windows.

### 07 — Build Chronicle

**Positioning:** Evidence-led narrative.

**Thesis:** Let artifacts, dated experiments, and decisions prove growth without reading like a résumé.

**First screen:** A field note opens in the middle of the Golfie question: “Can two phones see one flight?” A pinned trajectory experiment answers it.

**Visual system:** Mineral paper, bottle green, serif narrative typography, marginalia, stamps, technical sketches.

**Motion grammar:** Quiet page turns, sticky annotations, ink-line drawings, and scroll reveals.

**Best quality:** Authenticity, depth, and an excellent foundation for writing.

**Risk:** Needs real process artifacts and strict editing.

### 08 — Optical Field

**Positioning:** Experimental product art.

**Thesis:** Translate computer vision into a softer design world of focus, refraction, and changing perception.

**First screen:** A translucent optical object bends the grid and headline beneath it as it follows the pointer.

**Visual system:** Porcelain, charcoal, spectral violet, gallery spacing, refractive geometry.

**Motion grammar:** Slow lens drift, focus pulls, chromatic edge separation, liquid transitions.

**Best quality:** The most art-directed expression without cliché developer imagery.

**Risk:** Shader and filter effects need strong performance fallbacks and can compete with evidence.

### 09 — Telemetry Deck

**Positioning:** Live systems proof.

**Thesis:** Make the portfolio feel like a sophisticated product already running rather than a page describing old work.

**First screen:** Trajectory telemetry streams into modular instruments while a launch event updates the entire layout.

**Visual system:** Black, cool gray, cyan, modular cards, technical numerals, real data with disciplined hierarchy.

**Motion grammar:** Data ticks, waveform traces, scan sweeps, modular rearrangement, precise state transitions.

**Best quality:** Maximum engineering credibility and a natural home for interactive evidence.

**Risk:** Fake analytics would immediately reduce trust. Every chart must convey real, explainable data.

### 10 — Quiet Monolith

**Positioning:** Cinematic restraint.

**Thesis:** Create confidence with one object, one sentence, and immaculate pacing.

**First screen:** A solitary golf ball emerges from darkness. Its dimples become a constellation of projects as the visitor moves into the site.

**Visual system:** True black, bone white, pale gold, sculptural light, monumental type, extreme negative space.

**Motion grammar:** Long cinematic easing, material shifts, scroll-directed camera moves, near-silent microinteractions.

**Best quality:** The most timeless and premium direction.

**Risk:** Requires excellent 3D art direction and ruthless content reduction.

## Selection matrix

| Direction | Ownability | Recruiter clarity | Technical proof | Build risk |
|---|---:|---:|---:|---:|
| Flight Lab | 5/5 | 5/5 | 5/5 | Medium |
| Twin Lens | 5/5 | 4/5 | 5/5 | Medium-high |
| Systems Foundry | 4/5 | 5/5 | 4/5 | Medium |
| Project Orbit | 4/5 | 3/5 | 4/5 | High |
| Kinetic Thesis | 4/5 | 4/5 | 3/5 | Medium |
| Founder OS | 4/5 | 4/5 | 4/5 | High |
| Build Chronicle | 4/5 | 5/5 | 4/5 | Medium |
| Optical Field | 4/5 | 3/5 | 3/5 | High |
| Telemetry Deck | 4/5 | 4/5 | 5/5 | Medium-high |
| Quiet Monolith | 4/5 | 5/5 | 3/5 | High |

## Recommended production component hierarchy

```text
PortfolioApp
├── MotionProvider
│   ├── reduced-motion policy
│   ├── shared easing tokens
│   └── route transition boundary
├── GlobalNavigation
│   ├── Project index
│   ├── About
│   ├── Contact / copy email
│   └── Command palette
├── HomePage
│   ├── FlightHero
│   │   ├── Founder thesis
│   │   ├── TrajectorySequence
│   │   └── HeroActions
│   ├── GolfieStory
│   │   ├── ProductPromise
│   │   ├── StereoVisionExplainer
│   │   ├── PhysicsExplainer
│   │   ├── OutcomeEvidence
│   │   └── LazyGolfieLab
│   ├── SupportingProjects
│   │   ├── JunoCasePreview
│   │   └── SateCasePreview
│   ├── ProductionProof
│   │   ├── Mayo
│   │   └── NASA
│   ├── OperatingPrinciples
│   └── ContactClosing
├── ProjectPage
│   ├── ProjectHero
│   ├── ContextAndRole
│   ├── ArchitectureStory
│   ├── DecisionsAndTradeoffs
│   ├── ProductMedia
│   ├── Outcomes
│   └── NextProject
└── GlobalFooter
```

Content should live in typed data rather than inside UI components. A project schema should include title, one-line promise, role, dates, status, problem, constraints, architecture, decisions, technologies, media, quantified results, repository/demo visibility, and related projects.

## Motion and frontend tooling

- **Motion** should own React state transitions, layout animation, route transitions, gestures, and scroll values.
- **Anime.js** should own authored sequences such as the hero launch, SVG path drawing, telemetry staging, and split-text choreography.
- Motion and Anime.js should never animate the same property on the same element.
- **Kokonut UI** can contribute one to three source-owned primitives after a complete visual reskin. It should not become the visible design system.
- **Bklit UI** is appropriate for real Golfie or case-study charts. It should not create decorative fake dashboards.
- **Manus** is a useful reference for sparse task-first navigation and progressive disclosure, not a frontend dependency.
- **Ubernatural** is useful as a lesson in cohesive kinetic type and art direction. Its layouts, assets, and choreography should not be copied.

Motion timing targets:

- Microinteractions: 180–260 ms
- Component transitions: 350–500 ms
- Page transitions: 450–700 ms
- Opening choreography: 900–1,400 ms, never blocking navigation

Reduced motion should remove parallax, cursor effects, continuous canvas animation, autoplay media, and large transforms while preserving hierarchy and state changes.

## What is needed for the final build

- Correct GitHub and LinkedIn URLs
- A résumé PDF
- Confirmation of whether the phone number should be public
- Golfie screenshots or short screen recordings
- If available, sample synchronized iPhone footage
- Juno and Sate screenshots
- Repository and demo visibility for each project
- Any confidential details that must not appear
- A preferred contact method or a real form endpoint

## Design-lab controls

Open `concepts.html` from the local development server. Use the arrow keys to navigate, 1–0 to jump directly, `F` for an immersive view, and `S` to shortlist a direction. The shortlist is saved locally and can be copied as a short brief.

## Detailed finalist prototypes

`finalists.html` contains complete, scrollable homepage prototypes for **The Flight Lab** and **Quiet Monolith**. The fixed selector switches between them while preserving the same content and proof points.

The Flight Lab prototype includes:

- A full trajectory-led hero sequence
- A Golfie flagship narrative
- Dual-camera stereo-vision visualization
- Six-stage system pipeline
- An interactive trajectory lab driven by the repository’s real RK4 physics model
- Juno and Sate outcome stories
- Duke, Mayo, and NASA production proof
- Operating principles and a working email contact path

The Quiet Monolith prototype includes:

- A cinematic sculptural hero
- A slow editorial thesis section
- A sticky Golfie narrative organized around See, Model, and Ship
- Minimal supporting-project presentations
- A quieter experience timeline and operating-principles section
- A restrained cinematic contact ending

Use the finalists to answer one question: should the portfolio’s first impression be **an instrument you can operate** or **an object and point of view you want to understand**? Flight Lab communicates more engineering evidence sooner. Quiet Monolith communicates more confidence and taste with less information.

### Demo-first revision

Both finalists now prioritize the projects over the visual concept itself. Large display typography has been reduced and the first viewport is anchored by an interactive Golfie model. Juno and Sate are presented as operable interaction previews instead of text-only project cards:

- **Golfie:** real trajectory calculations from the repository’s RK4 engine, adjustable velocity, launch angle, and backspin, plus capture/reconstruction/simulation stages.
- **Juno:** an interactive call-room preview for captions, translation, screen sharing, and synchronized room events. It demonstrates the product flow but is not a connection to the production calling service.
- **Sate:** an interactive group-voting preview with changing restaurant candidates, group participation, and consensus state. It demonstrates the recommendation interaction but does not reproduce the original trained model.

This distinction should remain explicit in the final site: Golfie is a live model; Juno and Sate are product interaction reconstructions until authentic screenshots, recordings, or deployable demos are supplied.
