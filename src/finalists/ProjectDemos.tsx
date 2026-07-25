import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import GolfieProductDemo from './GolfieProductDemo';

type DemoTone = 'flight' | 'monolith';

export function GolfieDemo({ compact = false }: { tone?: DemoTone; compact?: boolean }) {
  return <GolfieProductDemo compact={compact} />;
}

/* ==========================================================================
   JUNO DEMO — High performance cross-border VoIP, AI transcription & translation,
   screen share, and in-room game synchronization.
   ========================================================================== */

interface JunoSpeechScenario {
  id: string;
  speaker: string;
  location: string;
  source: string;
  translation: string;
  confidence: number;
}

const junoPresets: JunoSpeechScenario[] = [
  {
    id: 'p1',
    speaker: 'Damian',
    location: 'Durham, NC',
    source: "Let's verify the low-latency socket synchronization across the ocean.",
    translation: '让我们验证跨洋低延迟套接字同步。',
    confidence: 0.985,
  },
  {
    id: 'p2',
    speaker: 'Mei',
    location: 'Shanghai',
    source: 'The RK4 physics solver estimated an apex of 27.4 meters.',
    translation: 'RK4 物理求解器推算最高点为 27.4 米。',
    confidence: 0.978,
  },
  {
    id: 'p3',
    speaker: 'Damian',
    location: 'Durham, NC',
    source: 'Deepgram audio stream is running over Agora RTC virtual channel.',
    translation: 'Deepgram 音频流运行在 Agora RTC 虚拟通道上。',
    confidence: 0.992,
  },
];

const codeStreams = [
  {
    name: 'agora_bridge.rs',
    language: 'rust',
    code: `// Low-latency Opus Packet Router (Agora RTC -> Deepgram WS)
pub async fn route_audio_chunk(client_id: u32, pcm_frame: &[i16]) -> Result<()> {
    let opus_encoded = OPUS_ENCODER.lock().encode(pcm_frame)?;
    let packet = RtcFrame { id: client_id, payload: opus_encoded, ts: now_us() };
    TRANSLATION_CHANNEL.send(packet).await?;
    Ok(())
}`,
  },
  {
    name: 'trajectory_solver.ts',
    language: 'typescript',
    code: `// RK4 Integration for Ball Trajectory Simulation
export function rk4Step(state: PhysicsState, dt: number): PhysicsState {
  const k1 = getDerivatives(state);
  const k2 = getDerivatives(addState(state, multiplyState(k1, dt / 2)));
  const k3 = getDerivatives(addState(state, multiplyState(k2, dt / 2)));
  const k4 = getDerivatives(addState(state, multiplyState(k3, dt)));
  return combineRK4(state, k1, k2, k3, k4, dt);
}`,
  },
];

export function JunoDemo({ tone = 'flight' }: { tone?: DemoTone }) {
  const [activeTab, setActiveTab] = useState<'voice' | 'screenshare' | 'game'>('voice');
  
  // Voice & Translation State
  const [currentScenario, setCurrentScenario] = useState<JunoSpeechScenario>(junoPresets[0]);
  const [customText, setCustomText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [ping, setPing] = useState(164);

  // Screen Share State
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);

  // Game (Wordle) State
  const [wordleInput, setWordleInput] = useState('');
  const [wordleGuesses, setWordleGuesses] = useState<string[]>(['MODEL']);
  const [gameLog, setGameLog] = useState<{ op: string; data: string; latency: number }[]>([
    { op: 'STATE_SYNC', data: 'Room state initialized', latency: 14 },
    { op: 'GUESS_SUBMIT', data: 'Client DK guessed MODEL (1/5)', latency: 16 },
  ]);

  // Jitter Ping Simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPing(160 + Math.floor(Math.random() * 12));
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const handleSimulateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    setIsSpeaking(true);
    setCurrentScenario({
      id: `custom-${Date.now()}`,
      speaker: 'Damian',
      location: 'Durham, NC',
      source: customText.trim(),
      translation: `[AI Translate] ${customText.trim()}`,
      confidence: 0.991,
    });
    setCustomText('');
  };

  const handleWordleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wordleInput.length !== 5 || wordleGuesses.length >= 4) return;
    const word = wordleInput.toUpperCase();
    setWordleGuesses((prev) => [...prev, word]);
    setGameLog((prev) => [
      { op: 'GUESS_SUBMIT', data: `Client DK guessed ${word}`, latency: 14 + Math.floor(Math.random() * 6) },
      ...prev,
    ]);
    setWordleInput('');
  };

  return (
    <div className={`project-demo juno-demo demo-tone--${tone}`}>
      {/* Juno Header / RTC Status Bar */}
      <header className="demo-toolbar juno-header-bar">
        <div className="juno-title-group">
          <i className="juno-live-dot" />
          <span>JUNO RTC</span>
          <small>US ↔ CHINA ENGINE</small>
        </div>
        <div className="juno-nav-tabs">
          <button
            type="button"
            className={activeTab === 'voice' ? 'active' : ''}
            onClick={() => setActiveTab('voice')}
          >
            🎙️ Voice & AI
          </button>
          <button
            type="button"
            className={activeTab === 'screenshare' ? 'active' : ''}
            onClick={() => setActiveTab('screenshare')}
          >
            ▣ Screen Share
          </button>
          <button
            type="button"
            className={activeTab === 'game' ? 'active' : ''}
            onClick={() => setActiveTab('game')}
          >
            🎮 Sync Game
          </button>
        </div>
        <div className="juno-telemetry-badge">
          <span>⚡ {ping} ms</span>
          <small>OPUS 64KBPS</small>
        </div>
      </header>

      {/* Main Juno Stage Area */}
      <div className="juno-stage-body">
        {activeTab === 'voice' && (
          <div className="juno-voice-view">
            {/* Participants Grid */}
            <div className="juno-participants">
              <div className={`juno-participant ${currentScenario.speaker === 'Damian' ? 'speaking' : ''}`}>
                <div className="juno-avatar">DK</div>
                <div className="juno-user-info">
                  <strong>Damian Kim</strong>
                  <small>Durham, NC · Host</small>
                </div>
                {currentScenario.speaker === 'Damian' && isSpeaking && <i className="juno-speaking-indicator" />}
              </div>

              <div className={`juno-participant ${currentScenario.speaker === 'Mei' ? 'speaking' : ''}`}>
                <div className="juno-avatar juno-avatar--remote">ML</div>
                <div className="juno-user-info">
                  <strong>Mei Lin</strong>
                  <small>Shanghai, CN · Remote</small>
                </div>
                {currentScenario.speaker === 'Mei' && isSpeaking && <i className="juno-speaking-indicator" />}
              </div>
            </div>

            {/* Audio Waveform Display */}
            <div className="juno-waveform-bar" aria-hidden="true">
              {Array.from({ length: 32 }, (_, index) => (
                <i
                  key={index}
                  style={{
                    height: isSpeaking ? `${20 + ((index * 19 + Date.now() / 100) % 75)}%` : '15%',
                    opacity: isSpeaking ? 0.9 : 0.35,
                  }}
                />
              ))}
            </div>

            {/* Subtitle & Translation Stream Output */}
            <div className="juno-transcript-panel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScenario.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="juno-transcript-card"
                >
                  <div className="juno-transcript-meta">
                    <span>{currentScenario.speaker} ({currentScenario.location})</span>
                    <small>CONF: {(currentScenario.confidence * 100).toFixed(1)}% · DEEPGRAM STT</small>
                  </div>
                  {captionsEnabled && <p className="juno-speech-text">"{currentScenario.source}"</p>}
                  {translationEnabled && (
                    <div className="juno-translation-box">
                      <span className="juno-translate-icon">文</span>
                      <p>{currentScenario.translation}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Preset Buttons & Custom Speech Input */}
            <div className="juno-speech-controls">
              <div className="juno-preset-buttons">
                <span className="juno-control-label">SPEECH SCENARIOS:</span>
                {junoPresets.map((preset, idx) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={currentScenario.id === preset.id ? 'active' : ''}
                    onClick={() => {
                      setIsSpeaking(true);
                      setCurrentScenario(preset);
                    }}
                  >
                    Scenario #{idx + 1}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSimulateCustom} className="juno-custom-input-form">
                <input
                  type="text"
                  placeholder="Type custom speech to simulate real-time STT + Neural Translation..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
                <button type="submit">Stream Speech →</button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'screenshare' && (
          <div className="juno-screenshare-view">
            <div className="juno-share-header">
              <div className="juno-share-tabs">
                {codeStreams.map((stream, idx) => (
                  <button
                    key={stream.name}
                    type="button"
                    className={selectedStreamIndex === idx ? 'active' : ''}
                    onClick={() => setSelectedStreamIndex(idx)}
                  >
                    📄 {stream.name}
                  </button>
                ))}
              </div>
              <div className="juno-share-metrics">
                <span>1080p @ 30 FPS</span>
                <span>H.264 · 1.8 Mbps</span>
              </div>
            </div>
            <div className="juno-code-editor-stage">
              <pre className="juno-code-display">
                <code>{codeStreams[selectedStreamIndex].code}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'game' && (
          <div className="juno-game-view">
            <div className="juno-game-stage">
              <div className="juno-wordle-box">
                <header className="juno-wordle-header">
                  <span>IN-CALL WORDLE · SYNCED ZUSTAND STATE</span>
                  <small>WEBSOCKET PING: 14ms</small>
                </header>

                <div className="juno-wordle-grid">
                  {Array.from({ length: 4 }).map((_, rowIdx) => {
                    const guess = wordleGuesses[rowIdx] || (rowIdx === wordleGuesses.length ? wordleInput.padEnd(5, ' ') : '     ');
                    return (
                      <div key={rowIdx} className="juno-wordle-row">
                        {guess.split('').map((letter, colIdx) => (
                          <div
                            key={colIdx}
                            className={`juno-wordle-tile ${rowIdx < wordleGuesses.length ? 'submitted' : ''}`}
                          >
                            {letter !== ' ' ? letter : ''}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleWordleSubmit} className="juno-wordle-input">
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="Enter 5-letter guess..."
                    value={wordleInput}
                    onChange={(e) => setWordleInput(e.target.value)}
                  />
                  <button type="submit" disabled={wordleInput.length !== 5}>Submit Guess</button>
                </form>
              </div>

              <div className="juno-game-log-panel">
                <span>REAL-TIME WEBSOCKET LOG</span>
                <div className="juno-log-list">
                  {gameLog.map((log, idx) => (
                    <div key={idx} className="juno-log-item">
                      <strong className="juno-log-op">[{log.op}]</strong>
                      <span className="juno-log-data">{log.data}</span>
                      <small className="juno-log-latency">+{log.latency}ms</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Juno Footer Controls */}
      <footer className="juno-bottom-controls">
        <button
          type="button"
          className={captionsEnabled ? 'active' : ''}
          onClick={() => setCaptionsEnabled((v) => !v)}
        >
          {captionsEnabled ? 'CC Captions ON' : 'CC Captions OFF'}
        </button>
        <button
          type="button"
          className={translationEnabled ? 'active' : ''}
          onClick={() => setTranslationEnabled((v) => !v)}
        >
          {translationEnabled ? '文 Neural Translate EN/ZH' : '文 Translation OFF'}
        </button>
        <button
          type="button"
          className={isSpeaking ? 'active' : ''}
          onClick={() => setIsSpeaking((v) => !v)}
        >
          {isSpeaking ? '🔊 Audio Stream Active' : '🔇 Muted'}
        </button>
      </footer>
    </div>
  );
}

/* ==========================================================================
   SATE DEMO — Group Recommendation System with weighted collaborative consensus
   model, negative feedback loops, and preference matrix inspection.
   ========================================================================== */

interface GroupMember {
  id: string;
  name: string;
  initials: string;
  weight: number;
  dietary: string;
  favCuisine: string;
}

const groupMembers: GroupMember[] = [
  { id: 'm1', name: 'Damian', initials: 'DK', weight: 1.0, dietary: 'None', favCuisine: 'Japanese' },
  { id: 'm2', name: 'Alex', initials: 'AL', weight: 1.0, dietary: 'Vegetarian (Veto Meat)', favCuisine: 'Plant-based' },
  { id: 'm3', name: 'Jessica', initials: 'JS', weight: 1.2, dietary: 'Low Spice', favCuisine: 'Mexican' },
  { id: 'm4', name: 'Marcus', initials: 'MN', weight: 1.0, dietary: 'Gluten Sensitive', favCuisine: 'American' },
  { id: 'm5', name: 'Riya', initials: 'RK', weight: 1.0, dietary: 'Budget $', favCuisine: 'Ramen' },
  { id: 'm6', name: 'Tyler', initials: 'TY', weight: 0.8, dietary: 'Late Night', favCuisine: 'Flexible' },
];

interface Restaurant {
  id: string;
  name: string;
  type: string;
  price: string;
  distance: string;
  hours: string;
  isVegFriendly: boolean;
  isGlutenFree: boolean;
  baseMatchScore: number;
  dietaryConflict?: string;
  description: string;
  tags: string[];
}

const restaurantList: Restaurant[] = [
  {
    id: 'r1',
    name: 'Miso House',
    type: 'Japanese & Sushi',
    price: '$$',
    distance: '0.8 mi',
    hours: 'Open until 10 PM',
    isVegFriendly: true,
    isGlutenFree: true,
    baseMatchScore: 92,
    description: 'Fresh sushi, vegetarian rolls, craft ramen, and gluten-free tamari options.',
    tags: ['Veg Options', 'Gluten-Free', 'High Group Balance'],
  },
  {
    id: 'r2',
    name: 'Verde Kitchen',
    type: 'Plant-Based Fusion',
    price: '$$',
    distance: '1.2 mi',
    hours: 'Open until 9 PM',
    isVegFriendly: true,
    isGlutenFree: true,
    baseMatchScore: 88,
    description: '100% organic bowls, plant-based tacos, fresh juices, and gluten-free pastries.',
    tags: ['100% Vegetarian', 'Alex Favorite', 'Organic'],
  },
  {
    id: 'r3',
    name: 'La Palma Tacos',
    type: 'Authentic Mexican',
    price: '$',
    distance: '0.5 mi',
    hours: 'Open until 11 PM',
    isVegFriendly: true,
    isGlutenFree: true,
    baseMatchScore: 85,
    description: 'Hand-pressed corn tortillas, street tacos, guacamole, and mild/spicy salsas.',
    tags: ['Budget Friendly', 'Jessica Favorite', 'Late Night'],
  },
  {
    id: 'r4',
    name: 'Oak & Ember',
    type: 'Prime Steakhouse & Grill',
    price: '$$$',
    distance: '2.4 mi',
    hours: 'Open until 10 PM',
    isVegFriendly: false,
    isGlutenFree: false,
    baseMatchScore: 42,
    dietaryConflict: 'Strict Meat Focus — Alex (Vegetarian) Veto Penalty Active (-1.5x)',
    description: 'Dry-aged ribeyes, wood-fired chops, heavy cream sides, and craft bourbon.',
    tags: ['Meat Heavy', 'Veto Warning (-1.5x)', 'High Price'],
  },
  {
    id: 'r5',
    name: 'Ramen Kazoku',
    type: 'Craft Noodle Bar',
    price: '$',
    distance: '1.0 mi',
    hours: 'Open until 12 AM',
    isVegFriendly: true,
    isGlutenFree: false,
    baseMatchScore: 86,
    description: 'Rich tonkotsu, creamy vegan broth, spicy miso, and crispy gyoza.',
    tags: ['Late Night', 'Veg Broth', 'Riya Favorite'],
  },
];

export function SateDemo({ tone = 'flight' }: { tone?: DemoTone }) {
  const [activeView, setActiveView] = useState<'swipe' | 'matrix' | 'inspector'>('swipe');
  const [activeVoterIndex, setActiveVoterIndex] = useState(0); // Default to Damian (DK)
  const [deckIndex, setDeckIndex] = useState(0);
  
  // Votes map: memberId -> restaurantId -> vote ('pass' | 'like' | 'superlike')
  const [votes, setVotes] = useState<Record<string, Record<string, 'pass' | 'like' | 'superlike'>>>({
    m2: { r4: 'pass' }, // Alex vetoes Steakhouse
    m3: { r3: 'like' }, // Jessica likes Mexican
  });

  // Hyperparameters
  const [vetoMultiplier, setVetoMultiplier] = useState(1.5);
  const [pickyEaterWeight, setPickyEaterWeight] = useState(1.2);

  const activeVoter = groupMembers[activeVoterIndex];
  const currentRestaurant = restaurantList[deckIndex];

  // Calculate live dynamic group consensus for each restaurant
  const calculatedConsensus = useMemo(() => {
    const scores: Record<string, { totalScore: number; consensusPct: number; reason: string }> = {};

    restaurantList.forEach((rest) => {
      let rawScore = rest.baseMatchScore;
      let reason = 'Balanced preference across group members.';

      groupMembers.forEach((member) => {
        const vote = votes[member.id]?.[rest.id];
        const w = member.id === 'm3' ? pickyEaterWeight : member.weight;

        if (vote === 'pass') {
          rawScore -= 35 * vetoMultiplier * w;
          reason = `${member.name} voted Pass -> Applied -${(vetoMultiplier).toFixed(1)}x veto penalty.`;
        } else if (vote === 'like') {
          rawScore += 18 * w;
        } else if (vote === 'superlike') {
          rawScore += 30 * w;
        }

        // Apply strict dietary penalty if vegetarian at non-veg restaurant
        if (member.dietary.includes('Vegetarian') && !rest.isVegFriendly) {
          rawScore -= 40 * vetoMultiplier;
          reason = `Dietary Conflict: ${member.name} is Vegetarian. Steakhouse penalized.`;
        }
      });

      const consensusPct = Math.max(10, Math.min(99, Math.round(rawScore)));
      scores[rest.id] = { totalScore: rawScore, consensusPct, reason };
    });

    return scores;
  }, [votes, vetoMultiplier, pickyEaterWeight]);

  const handleVote = (voteType: 'pass' | 'like' | 'superlike') => {
    setVotes((prev) => ({
      ...prev,
      [activeVoter.id]: {
        ...(prev[activeVoter.id] || {}),
        [currentRestaurant.id]: voteType,
      },
    }));

    // Advance deck
    setDeckIndex((prev) => (prev + 1) % restaurantList.length);
  };

  const currentMatch = calculatedConsensus[currentRestaurant.id];

  return (
    <div className={`project-demo sate-demo demo-tone--${tone}`}>
      {/* Sate Header */}
      <header className="demo-toolbar sate-header-bar">
        <div className="sate-title-group">
          <i className="sate-live-dot" />
          <span>SATE ENGINE</span>
          <small>GROUP CONSENSUS RECOMMENDATION MODEL</small>
        </div>
        <div className="sate-view-tabs">
          <button
            type="button"
            className={activeView === 'swipe' ? 'active' : ''}
            onClick={() => setActiveView('swipe')}
          >
            🎴 Deck & Vote
          </button>
          <button
            type="button"
            className={activeView === 'matrix' ? 'active' : ''}
            onClick={() => setActiveView('matrix')}
          >
            📊 Group Matrix
          </button>
          <button
            type="button"
            className={activeView === 'inspector' ? 'active' : ''}
            onClick={() => setActiveView('inspector')}
          >
            🧮 Model Math
          </button>
        </div>
        <div className="sate-metric-badge">
          <span>+65% ACCURACY</span>
          <small>VS RANDOM</small>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="sate-workspace">
        {/* Left Side: Group Signal Panel */}
        <div className="sate-group-panel">
          <span className="sate-panel-title">GROUP SIGNAL & ACTIVE VOTER</span>
          <p className="sate-subtext">Click any member to switch voting perspective:</p>

          <div className="sate-voter-selector">
            {groupMembers.map((member, idx) => {
              const isSelected = idx === activeVoterIndex;
              const hasVotedCurrent = votes[member.id]?.[currentRestaurant.id];
              return (
                <button
                  key={member.id}
                  type="button"
                  className={`sate-avatar-btn ${isSelected ? 'selected' : ''} ${hasVotedCurrent ? 'voted' : ''}`}
                  onClick={() => setActiveVoterIndex(idx)}
                >
                  <span className="sate-avatar-initials">{member.initials}</span>
                  <small>{member.name}</small>
                  {hasVotedCurrent && <i className="sate-vote-icon">{hasVotedCurrent === 'pass' ? '❌' : '❤️'}</i>}
                </button>
              );
            })}
          </div>

          <div className="sate-active-voter-card">
            <strong>Voting as: {activeVoter.name} ({activeVoter.initials})</strong>
            <small>Dietary: {activeVoter.dietary} · Weight: {activeVoter.weight}x</small>
          </div>

          <div className="sate-consensus-box">
            <div className="sate-consensus-header">
              <span>MODEL CONSENSUS</span>
              <strong>{currentMatch.consensusPct}% Match</strong>
            </div>
            <div className="sate-consensus-track">
              <motion.div
                className="sate-consensus-fill"
                animate={{ width: `${currentMatch.consensusPct}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <small className="sate-model-explanation">{currentMatch.reason}</small>
          </div>
        </div>

        {/* Right Side: Tab Views */}
        <div className="sate-stage-content">
          {activeView === 'swipe' && (
            <div className="sate-swipe-view">
              <AnimatePresence mode="wait">
                <motion.article
                  key={currentRestaurant.id}
                  className="sate-card"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <header className="sate-card-header">
                    <div>
                      <h3>{currentRestaurant.name}</h3>
                      <p>{currentRestaurant.type} · {currentRestaurant.price} · {currentRestaurant.distance}</p>
                    </div>
                    <div className="sate-consensus-badge">
                      <span>{currentMatch.consensusPct}%</span>
                      <small>Consensus</small>
                    </div>
                  </header>

                  <p className="sate-card-desc">{currentRestaurant.description}</p>

                  <div className="sate-card-tags">
                    {currentRestaurant.tags.map((tag) => (
                      <span key={tag} className="sate-tag">{tag}</span>
                    ))}
                  </div>

                  {currentRestaurant.dietaryConflict && (
                    <div className="sate-conflict-alert">
                      ⚠️ {currentRestaurant.dietaryConflict}
                    </div>
                  )}

                  <footer className="sate-card-footer">
                    <span>{currentRestaurant.hours}</span>
                    <span>6 Group Signals Active</span>
                  </footer>
                </motion.article>
              </AnimatePresence>

              {/* Swipe Action Buttons */}
              <div className="sate-actions-bar">
                <button
                  type="button"
                  className="sate-btn-pass"
                  onClick={() => handleVote('pass')}
                >
                  ❌ Veto Pass (-1.5x)
                </button>
                <button
                  type="button"
                  className="sate-btn-like"
                  onClick={() => handleVote('like')}
                >
                  ❤️ Like (+1.0x)
                </button>
                <button
                  type="button"
                  className="sate-btn-super"
                  onClick={() => handleVote('superlike')}
                >
                  ⭐ Superlike (+2.0x)
                </button>
              </div>
            </div>
          )}

          {activeView === 'matrix' && (
            <div className="sate-matrix-view">
              <span className="sate-panel-title">GROUP UTILITY MATRIX & RANKING</span>
              <div className="sate-matrix-table">
                <header className="sate-table-header">
                  <span>Restaurant</span>
                  <span>Match</span>
                  <span>Signal Breakdown</span>
                </header>
                {restaurantList.map((rest) => {
                  const match = calculatedConsensus[rest.id];
                  return (
                    <div key={rest.id} className="sate-table-row">
                      <div className="sate-row-info">
                        <strong>{rest.name}</strong>
                        <small>{rest.type}</small>
                      </div>
                      <div className="sate-row-pct">{match.consensusPct}%</div>
                      <div className="sate-row-votes">
                        {groupMembers.map((m) => {
                          const v = votes[m.id]?.[rest.id];
                          return (
                            <span key={m.id} className={`sate-vote-chip ${v || 'pending'}`}>
                              {m.initials}: {v === 'pass' ? '❌' : v === 'like' ? '❤️' : v === 'superlike' ? '⭐' : '—'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeView === 'inspector' && (
            <div className="sate-inspector-view">
              <span className="sate-panel-title">MODEL FORMULATION & HYPERPARAMETERS</span>

              <div className="sate-formula-card">
                <code>
                  Score(r) = Σ [ w_u * Preference(u, r) * Penalty(u, r) ] / Σ w_u
                </code>
                <p>
                  Standard averaging fails when 1 person has a strict dietary allergy or veto.
                  Sate applies a non-linear negative multiplier (-1.5x to -3.0x) when any group member passes, preventing irrecoverable group conflicts.
                </p>
              </div>

              <div className="sate-slider-group">
                <label>
                  <span>Veto Multiplier Penalty ({vetoMultiplier.toFixed(1)}x):</span>
                  <input
                    type="range"
                    min={1.0}
                    max={3.0}
                    step={0.1}
                    value={vetoMultiplier}
                    onChange={(e) => setVetoMultiplier(parseFloat(e.target.value))}
                  />
                </label>

                <label>
                  <span>Picky Eater Weight Boost ({pickyEaterWeight.toFixed(1)}x):</span>
                  <input
                    type="range"
                    min={1.0}
                    max={2.0}
                    step={0.1}
                    value={pickyEaterWeight}
                    onChange={(e) => setPickyEaterWeight(parseFloat(e.target.value))}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
