import { useCallback, useEffect, useRef, useState } from 'react';
import './realProductDemos.css';

export function JunoSourceDemo() {
  const [launched, setLaunched] = useState(false);

  return (
    <div className="juno-live-embed">
      <header><div><i /> JUNO <small>LIVE APPLICATION BUILD</small></div><span>E:\Juno\juno · Agora RTC</span></header>
      {launched ? (
        <iframe
          src="/demos/juno/index.html?embed=portfolio"
          title="Interactive Juno voice and video application"
          allow="microphone; camera; display-capture; autoplay"
        />
      ) : (
        <div className="juno-live-launch">
          <div>
            <h3>Step inside Juno.</h3>
            <button type="button" onClick={() => setLaunched(true)}>Try it out</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SateSourceDemo() {
  return (
    <div className="sate-live-embed">
      <header><div><i /> SATE <small>LIVE APPLICATION BUILD</small></div><span>GROUP RESTAURANT RECOMMENDATIONS</span></header>
      <iframe
        src="/demos/sate/index.html"
        title="Interactive Sate restaurant recommendation application"
        allow="geolocation"
      />
    </div>
  );
}

type Camera = 'camera_a' | 'camera_b';
type VideoKind = 'stripped' | 'replay_original';
const GOLFIE_ASSET_ROOT = '/demos/golfie/8497991969ec';
const SPEEDS = [0.25, 0.5, 1, 1.5, 2];

type CoachStatus = 'priority' | 'refine' | 'strength';
interface CoachFinding {
  id: string;
  phase: string;
  time: number;
  title: string;
  status: CoachStatus;
  confidence: number;
  summary: string;
  evidence: string[];
  impact: string;
  fixes: string[];
  drill: string;
  checkpoint: string;
}

const COACH_FINDINGS: CoachFinding[] = [
  { id: 'address-balance', phase: '01 · Address', time: .20, title: 'Pressure begins slightly trail-side', status: 'refine', confidence: 78, summary: 'The posture center starts behind the midpoint of the stance, adding a small lateral recovery before rotation can begin.', evidence: ['Posture center trails stance midpoint', 'Lead knee begins less flexed than trail knee', 'Shoulder line is stable'], impact: 'A centered athletic start makes the first move rotational instead of compensatory and improves low-point consistency.', fixes: ['Feel pressure under both shoelaces, not the heels', 'Let the lead hip sit one inch closer to target', 'Keep sternum centered while preserving spine tilt'], drill: 'Hold address for three breaths, then make waist-high rehearsals without letting the center marker drift.', checkpoint: 'At address, the posture-center line should fall between the ankles and remain there through the first 20% of the takeaway.' },
  { id: 'takeaway-width', phase: '02 · Takeaway', time: .58, title: 'Hands separate from torso too early', status: 'priority', confidence: 88, summary: 'Arm travel outpaces the shoulder turn in the opening move, reducing connection and narrowing the return path.', evidence: ['Hand path advances before shoulder-axis change', 'Trail elbow begins folding early', 'Hip axis remains quiet'], impact: 'An arm-led takeaway makes the transition steeper and forces timing corrections approaching impact.', fixes: ['Move chest, hands, and club away as one unit', 'Keep the trail elbow soft rather than actively folding', 'Stop the rehearsal when the hands reach trail thigh'], drill: 'Place a glove under the trail armpit and make ten slow takeaways to lead-arm-parallel without dropping it.', checkpoint: 'At shaft-parallel, the hands should remain in front of the chest and the shoulder axis should already show visible turn.' },
  { id: 'top-width', phase: '03 · Top', time: .92, title: 'Top position loses arm width', status: 'priority', confidence: 84, summary: 'The elbow spacing contracts near the top while the hands continue traveling, creating a longer arm swing than the torso turn supports.', evidence: ['Elbow triangle narrows late', 'Hands continue after hip turn plateaus', 'Lead arm moves across the shoulder line'], impact: 'Lost width can steepen the first move down and make face control dependent on late hand action.', fixes: ['Finish the backswing when shoulder turn finishes', 'Feel the hands stay farther from the trail ear', 'Maintain the elbow triangle established at lead-arm-parallel'], drill: 'Make three-quarter pause swings: stop at the top for two seconds, confirm width, then rotate through at half speed.', checkpoint: 'At the top, hands should remain outside the head silhouette and elbow spacing should not collapse from the previous frame.' },
  { id: 'transition-sequence', phase: '04 · Transition', time: 1.20, title: 'Upper and lower body start down together', status: 'priority', confidence: 81, summary: 'The shoulder and hip axes begin unwinding in the same interval, leaving limited pelvis-first separation.', evidence: ['Shoulder-axis change begins with hip-axis change', 'Posture center moves before lead-knee stabilization', 'Trail elbow remains behind torso'], impact: 'A simultaneous transition reduces available rotational speed and encourages the club and arms to work outward.', fixes: ['Start down with pressure into the lead foot', 'Let the belt buckle begin opening before the chest', 'Allow the hands to fall while the pelvis starts rotating'], drill: 'Use a step-through drill: begin with feet together, step toward target before the backswing completes, then swing through.', checkpoint: 'One to two frames into transition, the hip axis should open while the shoulder axis remains briefly closed.' },
  { id: 'impact-posture', phase: '05 · Delivery', time: 1.48, title: 'Pelvis moves toward the ball through delivery', status: 'refine', confidence: 76, summary: 'The hip center advances toward the address line as the legs extend, reducing space for the hands through impact.', evidence: ['Hip depth decreases from transition', 'Knee flex reduces before the hands reach impact', 'Torso becomes more upright'], impact: 'Early extension can crowd the handle, alter strike height, and make face delivery inconsistent.', fixes: ['Keep the trail hip back as the lead hip clears', 'Rotate around the lead heel instead of pushing the pelvis forward', 'Maintain chest inclination until after contact'], drill: 'Set a chair lightly against the hips and make slow swings while keeping one hip in contact through impact.', checkpoint: 'At delivery, the lead hip should replace the trail hip against the reference line rather than both hips moving away from it.' },
  { id: 'finish-balance', phase: '06 · Finish', time: 1.88, title: 'Balanced finish is a repeatable strength', status: 'strength', confidence: 91, summary: 'The swing reaches a tall, supported finish with the torso stacked over the lead side and no late recovery step.', evidence: ['Center finishes over lead leg', 'Trail foot releases', 'Shoulders complete rotation'], impact: 'A stable finish is evidence that momentum is being managed through the full motion.', fixes: ['Preserve this finish while changing transition', 'Hold the pose for two seconds after each drill swing', 'Do not chase speed until the finish remains stable'], drill: 'Hit sets of five at 70% speed and score only whether the finish can be held for a two-count.', checkpoint: 'Chest faces the target, trail heel is released, and balance remains entirely supported by the lead side.' },
];

const SWING_SCORE_COMPONENTS = [
  { label: 'Setup', score: 84, weight: 20 },
  { label: 'Structure', score: 72, weight: 25 },
  { label: 'Sequence', score: 65, weight: 35 },
  { label: 'Balance', score: 92, weight: 20 },
];
const SWING_COMPOSITE_SCORE = Math.round(SWING_SCORE_COMPONENTS.reduce((total, component) => total + component.score * component.weight / 100, 0));

const COACH_DIAGRAMS: Record<string, { current: string; target: string; cue: string; focus: 'center' | 'arms' | 'hips' | 'posture' | 'finish' }> = {
  'address-balance': { current: 'Pressure trails center', target: 'Pressure between feet', cue: 'Move the center line forward without losing spine tilt.', focus: 'center' },
  'takeaway-width': { current: 'Hands leave the chest', target: 'Chest and hands move together', cue: 'Keep the arm triangle connected through shaft-parallel.', focus: 'arms' },
  'top-width': { current: 'Elbow triangle narrows', target: 'Width stays intact', cue: 'End the arm swing when the shoulder turn ends.', focus: 'arms' },
  'transition-sequence': { current: 'Chest and hips start together', target: 'Pelvis leads briefly', cue: 'Shift pressure, open the hips, then release the chest.', focus: 'hips' },
  'impact-posture': { current: 'Pelvis moves toward ball', target: 'Lead hip replaces trail hip', cue: 'Keep hip depth while rotating around the lead heel.', focus: 'posture' },
  'finish-balance': { current: 'Good lead-side support', target: 'Preserve this finish', cue: 'Hold the stacked finish while rehearsing earlier changes.', focus: 'finish' },
};

function CoachFixDiagram({ findingId }: { findingId: string }) {
  const diagram = COACH_DIAGRAMS[findingId];
  const armsCurrent = diagram.focus === 'arms' ? '82,56 98,28 107,58' : '72,58 51,78 39,100';
  const armsTarget = diagram.focus === 'arms' ? '245,57 270,25 293,58' : '245,58 225,78 214,99';
  const currentBodyX = diagram.focus === 'posture' ? 101 : diagram.focus === 'center' ? 94 : 88;
  const targetBodyX = 265;
  return <div className="golfie-fix-diagram"><div><span>MOVEMENT MAP</span><strong>{diagram.cue}</strong></div><svg viewBox="0 0 350 170" role="img" aria-label={`${diagram.current}. Target: ${diagram.target}.`}><line className="diagram-reference" x1="175" y1="16" x2="175" y2="151" /><g className="diagram-current"><text x="20" y="18">CURRENT</text><circle cx={currentBodyX} cy="38" r="10" /><line x1={currentBodyX} y1="49" x2={currentBodyX + (diagram.focus === 'posture' ? 8 : 0)} y2="103" /><line x1={currentBodyX - 24} y1="58" x2={currentBodyX + 24} y2="58" /><line x1={currentBodyX - 18} y1="102" x2={currentBodyX + 18} y2="102" /><polyline points={armsCurrent} /><line x1={currentBodyX - 14} y1="103" x2={currentBodyX - 27} y2="146" /><line x1={currentBodyX + 14} y1="103" x2={currentBodyX + 27} y2="146" />{diagram.focus === 'hips' && <path className="diagram-emphasis" d="M62 112 Q91 130 121 105" />}{diagram.focus === 'center' && <line className="diagram-emphasis" x1="106" y1="47" x2="106" y2="145" />}</g><path className="diagram-arrow" d="M145 84 H202 M194 76 L203 84 L194 92" /><g className="diagram-target"><text x="222" y="18">TARGET</text><circle cx={targetBodyX} cy="38" r="10" /><line x1={targetBodyX} y1="49" x2={targetBodyX} y2="103" /><line x1={targetBodyX - 24} y1="58" x2={targetBodyX + 24} y2="58" /><line x1={targetBodyX - 18} y1="102" x2={targetBodyX + 18} y2="102" /><polyline points={armsTarget} /><line x1={targetBodyX - 14} y1="103" x2={targetBodyX - 27} y2="146" /><line x1={targetBodyX + 14} y1="103" x2={targetBodyX + 27} y2="146" />{diagram.focus === 'hips' && <path className="diagram-emphasis" d="M239 109 Q267 93 293 106" />}{diagram.focus === 'posture' && <path className="diagram-emphasis" d="M242 108 Q265 96 289 101" />}{diagram.focus === 'finish' && <line className="diagram-emphasis" x1="265" y1="49" x2="265" y2="146" />}</g><text className="diagram-caption" x="20" y="163">{diagram.current}</text><text className="diagram-caption" x="222" y="163">{diagram.target}</text></svg></div>;
}

export function GolfieSourceSwingDemo() {
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const [mode, setMode] = useState<'comparison' | 'coach'>('comparison');
  const [findingIndex, setFindingIndex] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const frameRate = 30;
  const finding = COACH_FINDINGS[findingIndex];

  const register = (key: string) => (node: HTMLVideoElement | null) => {
    if (node) videos.current.set(key, node); else videos.current.delete(key);
  };
  const src = (camera: Camera, kind: VideoKind) => `${GOLFIE_ASSET_ROOT}/${camera}_${kind}.mp4`;
  const seekAll = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(next, duration));
    videos.current.forEach((video) => {
      if (Number.isFinite(video.duration)) video.currentTime = Math.min(bounded, video.duration);
    });
    setTime(bounded);
  }, [duration]);
  const setAllPlaying = useCallback((next: boolean) => {
    setPlaying(next);
    videos.current.forEach((video) => {
      video.playbackRate = speed;
      if (next) void video.play().catch(() => setPlaying(false)); else video.pause();
    });
  }, [speed]);
  const syncFromMaster = (master: HTMLVideoElement) => {
    setTime(master.currentTime);
    videos.current.forEach((video) => {
      if (video !== master && Math.abs(video.currentTime - master.currentTime) > .06) {
        video.currentTime = Math.min(master.currentTime, video.duration || master.currentTime);
      }
    });
  };
  const chooseFinding = (index: number) => {
    setFindingIndex(index);
    setAllPlaying(false);
    window.setTimeout(() => seekAll(COACH_FINDINGS[index].time), 0);
  };

  useEffect(() => {
    videos.current.forEach((video) => { video.playbackRate = speed; });
  }, [speed]);
  useEffect(() => {
    setAllPlaying(false);
    const timer = window.setTimeout(() => seekAll(mode === 'coach' ? finding.time : time), 0);
    return () => window.clearTimeout(timer);
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const videoSurface = (camera: Camera, kind: VideoKind, master = false, className = '') => (
    <figure className={className} key={`${camera}-${kind}`}>
      <figcaption><span>{camera === 'camera_a' ? 'DOWN THE LINE' : 'FACE ON'}</span><small>{kind === 'stripped' ? 'YOLO CAPTURE' : 'ORIGINAL'}</small></figcaption>
      <video
        ref={register(`${mode}-${camera}-${kind}`)}
        src={src(camera, kind)}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(event) => {
          event.currentTarget.playbackRate = speed;
          if (master) setDuration(event.currentTarget.duration || 1);
        }}
        onTimeUpdate={master ? (event) => syncFromMaster(event.currentTarget) : undefined}
        onEnded={master ? () => setAllPlaying(false) : undefined}
      />
      <i className="golfie-studio-scanline" />
    </figure>
  );

  const coachOverlaySurface = (camera: Camera, master = false, className = '') => (
    <figure className={`${className} golfie-studio-overlay-video`} key={`coach-overlay-${camera}`}>
      <figcaption><span>{camera === 'camera_a' ? 'DOWN THE LINE' : 'FACE ON'}</span><small>ORIGINAL + YOLO POSE</small></figcaption>
      <video
        ref={register(`coach-${camera}-original`)}
        src={src(camera, 'replay_original')}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(event) => {
          event.currentTarget.playbackRate = speed;
          if (master) setDuration(event.currentTarget.duration || 1);
        }}
        onTimeUpdate={master ? (event) => syncFromMaster(event.currentTarget) : undefined}
        onEnded={master ? () => setAllPlaying(false) : undefined}
      />
      <video ref={register(`coach-${camera}-pose`)} className="golfie-studio-pose-layer" src={src(camera, 'stripped')} muted playsInline preload="metadata" />
      <i className="golfie-studio-scanline" />
    </figure>
  );

  if (mode === 'coach') {
    return (
      <div className="golfie-studio golfie-studio--coach">
        <header className="golfie-studio-header">
          <button type="button" className="golfie-studio-back" onClick={() => setMode('comparison')}>← Swing lab</button>
          <div><span>GOLFIE</span><strong>AI COACH</strong></div>
          <small>SESSION 8497991969EC · 30 FPS</small>
        </header>
        <main className="golfie-studio-coach">
          <nav className="golfie-studio-phases" aria-label="Swing phases">
            <span>SWING PHASES</span>
            {COACH_FINDINGS.map((item, index) => (
              <button type="button" className={index === findingIndex ? 'active' : ''} key={item.id} onClick={() => chooseFinding(index)}>
                <b>{String(index + 1).padStart(2, '0')}</b><div><small>{item.phase.split('·')[1]}</small><strong>{item.title}</strong></div><i className={`status-${item.status}`}>{item.status}</i>
              </button>
            ))}
          </nav>
          <section className="golfie-studio-review">
            {coachOverlaySurface('camera_b', true, 'golfie-studio-review__main')}
            {coachOverlaySurface('camera_a', false, 'golfie-studio-review__secondary')}
            <div className="golfie-studio-review__marker"><span>{String(findingIndex + 1).padStart(2, '0')}</span><i /><small>{finding.phase.replace('·', '/')}</small></div>
            <div className="golfie-studio-review__controls">
              <button type="button" onClick={() => seekAll(time - 1 / frameRate)}>│◀</button>
              <button type="button" className="golfie-studio-play" onClick={() => setAllPlaying(!playing)}>{playing ? 'Pause review' : 'Play through'}</button>
              <button type="button" onClick={() => seekAll(time + 1 / frameRate)}>▶│</button>
              <span>{time.toFixed(2)}s</span>
            </div>
          </section>
          <article className="golfie-studio-insight">
            <div className="golfie-studio-insight__eyebrow"><span className={`status-${finding.status}`}>{finding.status}</span><small>{finding.phase}</small></div>
            <h1>{finding.title}</h1>
            <p>{finding.summary}</p>
            <div className="golfie-studio-impact"><span>WHY IT MATTERS</span><strong>{finding.impact}</strong></div>
            <div className="golfie-studio-fix"><span>HOW TO FIX IT</span><ol>{finding.fixes.map((item) => <li key={item}>{item}</li>)}</ol></div>
            <div className="golfie-studio-drill"><span>DRILL</span><strong>{finding.drill}</strong></div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="golfie-studio golfie-studio--comparison">
      <header className="golfie-studio-header">
        <div><span>GOLFIE</span><strong>SWING LAB</strong></div>
        <strong className="golfie-studio-header__comparison">YOLO CAPTURE / ORIGINAL VIDEO</strong>
        <small>DUAL-CAMERA SESSION · 8497991969EC</small>
      </header>
      <main className="golfie-studio-comparison">
        <section className="golfie-studio-canvas">
          <div className="golfie-studio-camera-pair"><h2>CAMERA A · DOWN THE LINE</h2><div>{videoSurface('camera_a', 'stripped')}{videoSurface('camera_a', 'replay_original', true)}</div></div>
          <div className="golfie-studio-camera-pair"><h2>CAMERA B · FACE ON</h2><div>{videoSurface('camera_b', 'stripped')}{videoSurface('camera_b', 'replay_original')}</div></div>
        </section>
        <aside className="golfie-studio-session">
          <span>COMPOSITE SWING SCORE</span>
          <div className="golfie-studio-score"><strong>{SWING_COMPOSITE_SCORE}</strong><small>/ 100</small></div>
          <div className="golfie-studio-score-breakdown">
            {SWING_SCORE_COMPONENTS.map((component) => <div key={component.label}><span><b>{component.label}</b><small>{component.weight}% weight</small><strong>{component.score}</strong></span><i><b style={{ width: `${component.score}%` }} /></i></div>)}
          </div>
          <p className="golfie-studio-score-formula">Weighted form score · setup 20% · structure 25% · sequence 35% · balance 20%</p>
        </aside>
      </main>
      <div className="golfie-studio-timeline"><span>{time.toFixed(2)}s</span><input aria-label="Replay position" type="range" min="0" max={duration} step={1 / frameRate} value={Math.min(time, duration)} onChange={(event) => { setAllPlaying(false); seekAll(Number(event.target.value)); }} /><span>{duration.toFixed(2)}s</span></div>
      <footer className="golfie-studio-footer">
        <div><button type="button" onClick={() => seekAll(time - 1 / frameRate)}>│◀</button><button type="button" className="golfie-studio-play" onClick={() => setAllPlaying(!playing)}>{playing ? 'Pause' : 'Play swing'}</button><button type="button" onClick={() => seekAll(time + 1 / frameRate)}>▶│</button><label>Speed<select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>{SPEEDS.map((value) => <option key={value} value={value}>{value}×</option>)}</select></label></div>
        <button type="button" className="golfie-studio-coach-cta" onClick={() => { setMode('coach'); chooseFinding(1); }}><span>OPEN AI COACH</span><strong>Break it down</strong><i>→</i></button>
      </footer>
    </div>
  );
}

export function GolfieSourceSwingDemoLegacy() {
  const videos = useRef(new Map<string, HTMLVideoElement>());
  const [page, setPage] = useState<'comparison' | 'coach' | 'issue'>('comparison');
  const [findingIndex, setFindingIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [pauseAt, setPauseAt] = useState<number | null>(null);
  const frameRate = 30;

  const register = (key: string) => (node: HTMLVideoElement | null) => {
    if (node) videos.current.set(key, node); else videos.current.delete(key);
  };
  const seekAll = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(next, duration));
    videos.current.forEach((video) => { if (Number.isFinite(video.duration)) video.currentTime = Math.min(bounded, video.duration); });
    setTime(bounded);
  }, [duration]);
  const setAllPlaying = useCallback((next: boolean) => {
    setPlaying(next);
    videos.current.forEach((video) => {
      video.playbackRate = speed;
      if (next) void video.play().catch(() => setPlaying(false)); else video.pause();
    });
  }, [speed]);

  useEffect(() => { videos.current.forEach((video) => { video.playbackRate = speed; }); }, [speed]);

  useEffect(() => {
    if (page === 'comparison') return;
    setAllPlaying(false);
    const timer = window.setTimeout(() => seekAll(COACH_FINDINGS[findingIndex].time), 0);
    return () => window.clearTimeout(timer);
  }, [findingIndex, page, seekAll, setAllPlaying]);

  const syncFromMaster = (master: HTMLVideoElement) => {
    setTime(master.currentTime);
    videos.current.forEach((video) => {
      if (video !== master && Math.abs(video.currentTime - master.currentTime) > .06) video.currentTime = Math.min(master.currentTime, video.duration || master.currentTime);
    });
    if (pauseAt !== null && master.currentTime >= pauseAt) {
      setPauseAt(null);
      setAllPlaying(false);
      seekAll(COACH_FINDINGS[findingIndex].time);
    }
  };
  const selectFinding = (index: number) => { setFindingIndex(index); setPage('coach'); };
  const reviewFinding = () => {
    const finding = COACH_FINDINGS[findingIndex];
    setAllPlaying(false);
    seekAll(Math.max(0, finding.time - .32));
    setPauseAt(Math.min(duration, finding.time + .12));
    window.setTimeout(() => setAllPlaying(true), 30);
  };

  const src = (camera: Camera, kind: VideoKind) => `${GOLFIE_ASSET_ROOT}/${camera}_${kind}.mp4`;
  const finding = COACH_FINDINGS[findingIndex];

  if (page !== 'comparison') {
    return (
      <div className="golfie-source-swing golfie-source-swing--coach">
        <header><div><i /> GOLFIE AI COACH <small>POSE + TEMPORAL ANALYSIS</small></div><button type="button" className="golfie-coach-back" onClick={() => setPage(page === 'issue' ? 'coach' : 'comparison')}>← {page === 'issue' ? 'Coach overview' : 'Swing comparison'}</button></header>
        {page === 'coach' ? (
          <main className="golfie-coach">
            <section className="golfie-coach-summary"><div><span>SESSION ANALYSIS</span><h2>Six checkpoints.<br />Three priorities.</h2><p>Dual-view pose tracking evaluates posture center, joint spacing, shoulder–hip sequencing, balance, and change across adjacent frames.</p></div><div className="golfie-coach-score"><strong>74</strong><span>FORM SCORE</span><small>Highest priority: transition sequence</small></div></section>
            <section className="golfie-coach-workspace">
              <div className="golfie-coach-viewer">
                <div>{(['camera_a', 'camera_b'] as Camera[]).map((camera, cameraIndex) => <figure key={camera}><figcaption>{camera === 'camera_a' ? 'Down the line' : 'Face on'} · {finding.time.toFixed(2)}s</figcaption><video ref={register(`coach-${camera}`)} src={src(camera, 'stripped')} muted playsInline preload="metadata" onLoadedMetadata={(event) => { event.currentTarget.playbackRate = speed; if (cameraIndex === 0) setDuration(event.currentTarget.duration || 1); }} onTimeUpdate={cameraIndex === 0 ? (event) => syncFromMaster(event.currentTarget) : undefined} /></figure>)}</div>
                <div className="golfie-coach-transport"><button type="button" onClick={() => selectFinding(Math.max(0, findingIndex - 1))} disabled={findingIndex === 0}>← Previous</button><button type="button" className="golfie-coach-review" onClick={reviewFinding}>{playing ? 'Reviewing…' : 'Play into checkpoint'}</button><button type="button" onClick={() => selectFinding(Math.min(COACH_FINDINGS.length - 1, findingIndex + 1))} disabled={findingIndex === COACH_FINDINGS.length - 1}>Next →</button></div>
              </div>
              <article className="golfie-coach-finding"><div className="golfie-coach-finding-meta"><span className={`status-${finding.status}`}>{finding.status}</span><span>{finding.confidence}% confidence</span><span>Frame {Math.round(finding.time * frameRate)}</span></div><small>{finding.phase}</small><h2>{finding.title}</h2><p>{finding.summary}</p><ul>{finding.evidence.map((item) => <li key={item}>{item}</li>)}</ul><a href={`#golfie-coach-${finding.id}`} onClick={(event) => { event.preventDefault(); setPage('issue'); }}>Open issue &amp; fix guide →</a></article>
            </section>
            <nav className="golfie-coach-checkpoints" aria-label="AI coach checkpoints">{COACH_FINDINGS.map((item, index) => <button type="button" className={index === findingIndex ? 'active' : ''} key={item.id} onClick={() => selectFinding(index)}><span>{String(index + 1).padStart(2, '0')}</span><div><small>{item.phase.split('·')[1]}</small><strong>{item.title}</strong></div><i className={`status-${item.status}`}>{item.status}</i></button>)}</nav>
            <p className="golfie-coach-disclaimer">AI-estimated coaching cues from 2D pose geometry. Camera perspective and occlusion can affect confidence; use the findings as practice hypotheses, not injury or medical guidance.</p>
          </main>
        ) : (
          <main className="golfie-issue-page" id={`golfie-coach-${finding.id}`}>
            <header><div><span>{finding.phase}</span><h1>{finding.title}</h1><p>{finding.summary}</p></div><div><strong>{finding.confidence}%</strong><span>MODEL CONFIDENCE</span></div></header>
            <section className="golfie-issue-frame"><figure><video ref={register('issue-camera-b')} src={src('camera_b', 'stripped')} muted playsInline preload="metadata" onLoadedMetadata={(event) => { event.currentTarget.currentTime = Math.min(finding.time, event.currentTarget.duration); }} /><figcaption>Face-on diagnostic frame · {finding.time.toFixed(2)} seconds</figcaption></figure><div><span>WHY IT MATTERS</span><p>{finding.impact}</p><span>MODEL EVIDENCE</span><ul>{finding.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div></section>
            <section className="golfie-issue-fix"><div><span>HOW TO FIX IT</span><ol>{finding.fixes.map((item) => <li key={item}>{item}</li>)}</ol></div><div><CoachFixDiagram findingId={finding.id} /><div className="golfie-drill-copy"><span>RECOMMENDED DRILL</span><h2>{finding.drill}</h2><span>SUCCESS CHECKPOINT</span><p>{finding.checkpoint}</p></div></div></section>
            <footer><button type="button" onClick={() => setFindingIndex(Math.max(0, findingIndex - 1))} disabled={findingIndex === 0}>← Previous issue</button><button type="button" onClick={() => setFindingIndex(Math.min(COACH_FINDINGS.length - 1, findingIndex + 1))} disabled={findingIndex === COACH_FINDINGS.length - 1}>Next issue →</button></footer>
          </main>
        )}
      </div>
    );
  }
  return (
    <div className="golfie-source-swing">
      <header><div><i /> GOLFIE VISION <small>SESSION 8497991969EC</small></div><span>REAL PROCESSED OUTPUT · 30 FPS</span></header>
      <div className="golfie-source-legend">
        <span><i className="key-left" />Anatomical left arm</span><span><i className="key-right" />Anatomical right arm</span><span><i className="key-shoulder" />Shoulder axis</span><span><i className="key-hips" />Hip axis</span><span><i className="key-center" />2D posture center</span>
      </div>
      <div className="golfie-source-cameras">
        {(['camera_a', 'camera_b'] as Camera[]).map((camera, cameraIndex) => (
          <section key={camera}><h3>{camera === 'camera_a' ? 'Camera A · Down the line' : 'Camera B · Face on'}</h3>
            <figure><figcaption>Body + pose analysis</figcaption><video ref={register(`${camera}-analysis`)} src={src(camera, 'stripped')} muted playsInline preload="metadata" onLoadedMetadata={(event) => { event.currentTarget.playbackRate = speed; if (cameraIndex === 0) setDuration(event.currentTarget.duration || 1); }} onTimeUpdate={cameraIndex === 0 ? (event) => syncFromMaster(event.currentTarget) : undefined} onEnded={cameraIndex === 0 ? () => setAllPlaying(false) : undefined} /></figure>
            <figure><figcaption>Original uploaded frames</figcaption><video ref={register(`${camera}-original`)} src={src(camera, 'replay_original')} muted playsInline preload="metadata" /></figure>
          </section>
        ))}
      </div>
      <div className="golfie-source-timeline"><input aria-label="Replay position" type="range" min="0" max={duration} step={1 / frameRate} value={Math.min(time, duration)} onChange={(event) => { setAllPlaying(false); seekAll(Number(event.target.value)); }} /><span>{time.toFixed(2)}s / {duration.toFixed(2)}s</span></div>
      <footer><div><button type="button" onClick={() => { setAllPlaying(false); seekAll(time - 1 / frameRate); }}>│◀</button><button type="button" className="golfie-source-play" onClick={() => setAllPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button><button type="button" onClick={() => { setAllPlaying(false); seekAll(time + 1 / frameRate); }}>▶│</button></div><button type="button" className="golfie-source-coach-cta" onClick={() => { setFindingIndex(0); setPage('coach'); }}><small>AI FORM ANALYSIS</small><strong>Open AI Coach</strong><i>→</i></button><label>Speed<select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>{SPEEDS.map((value) => <option key={value} value={value}>{value}×</option>)}</select></label></footer>
    </div>
  );
}
