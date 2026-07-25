import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import FlightLabPage from './FlightLabPage';
import QuietMonolithPage from './QuietMonolithPage';

type Finalist = 'flight' | 'monolith';

function initialFinalist(): Finalist {
  return new URLSearchParams(window.location.search).get('direction') === 'flight'
    ? 'flight'
    : 'monolith';
}

export default function FinalistsApp() {
  const [finalist, setFinalist] = useState<Finalist>(initialFinalist);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('direction', finalist);
    window.history.replaceState({}, '', url);
    document.documentElement.dataset.finalist = finalist;
    document.title = `${finalist === 'flight' ? 'The Flight Lab' : 'Quiet Monolith'} — Damian Kim`;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [finalist]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="finalists-app">
        <aside className="finalist-switcher" aria-label="Portfolio finalist selector">
          <a href="/concepts.html">← All 10</a>
          <div>
            <button
              type="button"
              className={finalist === 'flight' ? 'active' : ''}
              onClick={() => setFinalist('flight')}
              aria-pressed={finalist === 'flight'}
            >
              <span>01</span> Flight Lab
            </button>
            <button
              type="button"
              className={finalist === 'monolith' ? 'active' : ''}
              onClick={() => setFinalist('monolith')}
              aria-pressed={finalist === 'monolith'}
            >
              <span>02</span> Quiet Monolith
            </button>
          </div>
          <span>Detailed finalists</span>
        </aside>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={finalist}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .32 }}
          >
            {finalist === 'flight' ? <FlightLabPage /> : <QuietMonolithPage />}
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
