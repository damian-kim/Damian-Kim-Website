import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animate, createScope, stagger } from 'animejs';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { directions } from './directions';
import { ConceptVisual } from './Visuals';

function initialDirection() {
  const requested = new URLSearchParams(window.location.search).get('direction');
  const index = directions.findIndex((direction) => direction.id === requested);
  return index >= 0 ? index : 0;
}

function initialShortlist() {
  try {
    const saved = JSON.parse(window.localStorage.getItem('dk-concept-shortlist') ?? '[]');
    return new Set<string>(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set<string>();
  }
}

export default function ConceptLab() {
  const [activeIndex, setActiveIndex] = useState(initialDirection);
  const [shortlist, setShortlist] = useState<Set<string>>(initialShortlist);
  const [focusMode, setFocusMode] = useState(false);
  const [toast, setToast] = useState('');
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const direction = directions[activeIndex];

  const goTo = useCallback((index: number) => {
    const normalized = (index + directions.length) % directions.length;
    setActiveIndex(normalized);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('direction', direction.id);
    window.history.replaceState({}, '', url);
    document.title = `${String(activeIndex + 1).padStart(2, '0')} ${direction.name} — Damian Kim Design Lab`;
  }, [activeIndex, direction]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;

      if (event.key === 'ArrowRight') goTo(activeIndex + 1);
      if (event.key === 'ArrowLeft') goTo(activeIndex - 1);
      if (event.key.toLowerCase() === 'f') setFocusMode((value) => !value);
      if (event.key.toLowerCase() === 's') toggleShortlist(direction.id);
      if (/^[1-9]$/.test(event.key)) goTo(Number(event.key) - 1);
      if (event.key === '0') goTo(9);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, direction.id, goTo]);

  useEffect(() => {
    if (reducedMotion || !stageRef.current) return;

    const scope = createScope({ root: stageRef }).add(() => {
      animate('[data-anime]', {
        opacity: [0, 1],
        y: [18, 0],
        duration: 760,
        delay: stagger(55),
        ease: 'out(4)',
      });
    });

    return () => scope.revert();
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    window.localStorage.setItem('dk-concept-shortlist', JSON.stringify([...shortlist]));
  }, [shortlist]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const toggleShortlist = (id: string) => {
    setShortlist((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const shortlistedDirections = useMemo(
    () => directions.filter((item) => shortlist.has(item.id)),
    [shortlist],
  );

  const copyShortlist = async () => {
    const selected = shortlistedDirections.length ? shortlistedDirections : [direction];
    const brief = selected
      .map((item, index) => `${index + 1}. ${item.name} — ${item.thesis}`)
      .join('\n');

    try {
      await navigator.clipboard.writeText(`Damian Kim portfolio shortlist\n\n${brief}`);
      setToast(shortlistedDirections.length ? 'Shortlist copied' : 'Current direction copied');
    } catch {
      setToast('Clipboard unavailable');
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`concept-lab${focusMode ? ' concept-lab--focus' : ''}`}>
        <header className="lab-header">
          <a className="lab-brand" href="/" aria-label="Return to current portfolio">
            <span>DK</span>
            <div><strong>Portfolio Design Lab</strong><small>10 coded directions · v1.0</small></div>
          </a>
          <div className="lab-progress" aria-label={`Direction ${activeIndex + 1} of ${directions.length}`}>
            {directions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === activeIndex ? 'active' : ''}
                onClick={() => goTo(index)}
                aria-label={`Open ${item.name}`}
              ><i /></button>
            ))}
          </div>
          <div className="lab-tools">
            <span className="lab-short-count">{shortlist.size} shortlisted</span>
            <button type="button" onClick={copyShortlist}>Copy selection</button>
            <button type="button" onClick={() => setFocusMode((value) => !value)} aria-pressed={focusMode}>
              {focusMode ? 'Exit focus' : 'Focus'} <kbd>F</kbd>
            </button>
          </div>
        </header>

        <div className="lab-workspace">
          <nav className="lab-rail" aria-label="Design directions">
            {directions.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === activeIndex ? 'active' : ''}
                onClick={() => goTo(index)}
                aria-current={index === activeIndex ? 'page' : undefined}
                title={item.name}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <i style={{ '--item-accent': item.accent } as React.CSSProperties} />
              </button>
            ))}
          </nav>

          <main className="lab-stage-shell">
            <div
              className="lab-stage"
              ref={stageRef}
              onPointerMove={handlePointerMove}
              style={{ '--concept-accent': direction.accent } as React.CSSProperties}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  className="lab-canvas"
                  key={direction.id}
                  initial={{ opacity: 0, scale: reducedMotion ? 1 : .985, filter: reducedMotion ? 'none' : 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.01, filter: reducedMotion ? 'none' : 'blur(6px)' }}
                  transition={{ duration: reducedMotion ? 0 : .42, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ConceptVisual id={direction.id} reducedMotion={reducedMotion} />
                </motion.div>
              </AnimatePresence>
              <div className="lab-pointer-glow" aria-hidden="true" />
              <button className="stage-arrow stage-arrow--previous" type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous direction">←</button>
              <button className="stage-arrow stage-arrow--next" type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next direction">→</button>
              <div className="stage-label">
                <span>LIVE CONCEPT</span>
                <strong>{String(activeIndex + 1).padStart(2, '0')} / {String(directions.length).padStart(2, '0')}</strong>
              </div>
            </div>
            <div className="lab-mobile-controls">
              <button type="button" onClick={() => goTo(activeIndex - 1)}>← Previous</button>
              <span>{activeIndex + 1} / {directions.length}</span>
              <button type="button" onClick={() => goTo(activeIndex + 1)}>Next →</button>
            </div>
          </main>

          <aside className="lab-inspector">
            <div className="inspector-heading">
              <span style={{ color: direction.accent }}>{String(activeIndex + 1).padStart(2, '0')}</span>
              <small>{direction.label}</small>
              <h1>{direction.name}</h1>
            </div>

            <p className="inspector-thesis">{direction.thesis}</p>

            <dl className="inspector-specs">
              <div><dt>First impression</dt><dd>{direction.firstImpression}</dd></div>
              <div><dt>Motion grammar</dt><dd>{direction.motion}</dd></div>
              <div><dt>Visual system</dt><dd>{direction.system}</dd></div>
              <div><dt>Typography</dt><dd>{direction.type}</dd></div>
            </dl>

            <div className="inspector-fit">
              <div><span>Best for</span><p>{direction.bestFor}</p></div>
              <div><span>Design risk</span><p>{direction.watchOut}</p></div>
            </div>

            <div className="inspector-stack">
              {direction.stack.map((item) => <span key={item}>{item}</span>)}
            </div>

            <button
              className={`shortlist-button${shortlist.has(direction.id) ? ' active' : ''}`}
              type="button"
              onClick={() => toggleShortlist(direction.id)}
              aria-pressed={shortlist.has(direction.id)}
            >
              <span>{shortlist.has(direction.id) ? 'Shortlisted' : 'Add to shortlist'}</span>
              <kbd>S</kbd>
            </button>

            <div className="inspector-keyboard">
              <span><kbd>←</kbd><kbd>→</kbd> navigate</span>
              <span><kbd>1</kbd>—<kbd>0</kbd> jump</span>
            </div>
          </aside>
        </div>

        <div className={`lab-toast${toast ? ' visible' : ''}`} role="status" aria-live="polite">{toast}</div>
      </div>
    </MotionConfig>
  );
}
