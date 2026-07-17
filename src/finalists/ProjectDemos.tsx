import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import GolfieProductDemo from './GolfieProductDemo';

type DemoTone = 'flight' | 'monolith';

export function GolfieDemo({ compact = false }: { tone?: DemoTone; compact?: boolean }) {
  return <GolfieProductDemo compact={compact} />;
}

const junoMoments = [
  { label: 'Room connected', source: 'Damian and Mei joined the call.', translation: 'Media streams are synchronized.' },
  { label: 'Speech detected', source: 'The model is tracking the ball.', translation: '模型正在追踪高尔夫球。' },
  { label: 'Screen shared', source: 'Trajectory solver · 1080p / 30fps', translation: 'Local recording is active.' },
  { label: 'Game synchronized', source: 'WORDLE · Round 03 · 2 players', translation: 'Shared state updated for both clients.' },
];

export function JunoDemo({ tone = 'flight' }: { tone?: DemoTone }) {
  const [moment, setMoment] = useState(1);
  const [captions, setCaptions] = useState(true);
  const [translation, setTranslation] = useState(true);
  const [sharing, setSharing] = useState(false);
  const current = junoMoments[moment];

  const advance = () => {
    const next = (moment + 1) % junoMoments.length;
    setMoment(next);
    setSharing(next === 2);
  };

  return (
    <div className={`project-demo juno-demo demo-tone--${tone}`}>
      <header className="demo-toolbar"><div><i /><span>JUNO ROOM</span><small>INTERACTION PREVIEW</small></div><span>US ↔ CHINA · &lt;200 MS</span></header>
      <div className="juno-stage">
        <div className="juno-participants">
          <div className="juno-participant"><span>DK</span><small>Damian · Durham</small><i className="juno-speaking" /></div>
          <div className="juno-participant"><span>ML</span><small>Mei · Shanghai</small></div>
          {sharing && <motion.div className="juno-share" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}><header>trajectory_solver.ts</header><svg viewBox="0 0 300 110"><path d="M8 96C65 94 79 19 154 27S244 86 292 79" /></svg></motion.div>}
        </div>
        <div className="juno-waveform" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 50)}%` }} />)}</div>
        <AnimatePresence mode="wait">
          <motion.div className="juno-transcript" key={moment} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <span>{current.label}</span>
            {captions && <p>{current.source}</p>}
            {translation && <small>{current.translation}</small>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="juno-controls">
        <button type="button" className={captions ? 'active' : ''} onClick={() => setCaptions((value) => !value)}>CC Captions</button>
        <button type="button" className={translation ? 'active' : ''} onClick={() => setTranslation((value) => !value)}>文 Translate</button>
        <button type="button" className={sharing ? 'active' : ''} onClick={() => setSharing((value) => !value)}>▣ Share</button>
        <button type="button" className="juno-advance" onClick={advance}>Next event →</button>
      </div>
    </div>
  );
}

const restaurants = [
  { name: 'Miso House', type: 'Japanese', price: '$$', match: 91, accent: '01' },
  { name: 'Oak & Ember', type: 'New American', price: '$$$', match: 76, accent: '02' },
  { name: 'La Palma', type: 'Mexican', price: '$$', match: 84, accent: '03' },
];

export function SateDemo({ tone = 'flight' }: { tone?: DemoTone }) {
  const [index, setIndex] = useState(0);
  const [decision, setDecision] = useState<'pass' | 'like' | null>(null);
  const [votes, setVotes] = useState(4);
  const current = restaurants[index];

  const vote = (nextDecision: 'pass' | 'like') => {
    setDecision(nextDecision);
    if (nextDecision === 'like') setVotes((value) => Math.min(6, value + 1));
    window.setTimeout(() => {
      setIndex((value) => (value + 1) % restaurants.length);
      setDecision(null);
    }, 260);
  };

  return (
    <div className={`project-demo sate-demo demo-tone--${tone}`}>
      <header className="demo-toolbar"><div><i /><span>SATE GROUP</span><small>INTERACTION PREVIEW</small></div><span>6 FRIENDS · DINNER</span></header>
      <div className="sate-workspace">
        <div className="sate-group-panel">
          <span>GROUP SIGNAL</span>
          <div className="sate-avatars">{['DK', 'AL', 'JS', 'MN', 'RK', 'TY'].map((name, avatarIndex) => <i key={name} className={avatarIndex < votes ? 'voted' : ''}>{name}</i>)}</div>
          <div className="sate-consensus"><label><span>Consensus</span><b>{current.match}%</b></label><i><span style={{ width: `${current.match}%` }} /></i></div>
          <small>Weighted positive and negative feedback updates the group ranking.</small>
        </div>
        <div className="sate-card-stage">
          <AnimatePresence mode="wait">
            <motion.article
              className="sate-card"
              key={current.name}
              initial={{ opacity: 0, scale: .96 }}
              animate={{ opacity: 1, scale: 1, x: decision === 'pass' ? -80 : decision === 'like' ? 80 : 0, rotate: decision === 'pass' ? -5 : decision === 'like' ? 5 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .24 }}
            >
              <div className="sate-card-visual"><span>{current.accent}</span><div><i /><i /><i /></div></div>
              <header><div><h3>{current.name}</h3><p>{current.type} · {current.price}</p></div><strong>{current.match}%</strong></header>
              <footer><span>12 min away</span><span>Open until 10</span></footer>
            </motion.article>
          </AnimatePresence>
          <div className="sate-actions"><button type="button" onClick={() => vote('pass')} aria-label="Pass on restaurant">×</button><button type="button" onClick={() => vote('like')} aria-label="Like restaurant">♥</button></div>
        </div>
      </div>
    </div>
  );
}
