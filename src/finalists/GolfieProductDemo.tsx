import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ShotSimulatorView } from '../golfie/components/ShotSimulatorView';
import '../golfie/components/Header.css';
import type { MetricSource, MetricValue, TrajectoryPayload } from '../golfie/lib/types';
import { calculateTrajectory3D } from '../utils/physics';
import { GolfieSourceSwingDemo } from './RealProductDemos';

const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 730;
type Parameters = { velocity: number; angle: number; direction: number; backspin: number; sidespin: number; drag: number };
const SAMPLE: Parameters = { velocity: 45, angle: 15, direction: 0, backspin: 3000, sidespin: 0, drag: .24 };
const REAL: Parameters = { velocity: 50.8, angle: 14.8, direction: 6, backspin: 3200, sidespin: -180, drag: .24 };

function metric(value: number | null, source: MetricSource, confidence: number, notes: string): MetricValue { return { value, source, confidence, notes }; }

function makePayload(parameters: Parameters, real: boolean): TrajectoryPayload {
  const simulated = calculateTrajectory3D(parameters.velocity, parameters.angle, parameters.direction, parameters.backspin, parameters.sidespin, parameters.drag, 9.81).map((point) => ({ ...point, confidence: real ? .66 : 1 }));
  const airborne = simulated.filter((point) => point.y > .02);
  const landing = simulated.at(-1);
  const carryPoint = simulated.findLast((point, index) => index > 0 && point.y <= .02 && simulated[index - 1].y > .02);
  const source: MetricSource = real ? 'estimated' : 'synthetic';
  const stereoWindow = real ? airborne.filter((point) => point.t <= .3 && point.x <= 14) : [];
  const measuredPoints = stereoWindow.filter((_, index) => index % 2 === 0);
  const handoffTime = measuredPoints.at(-1)?.t ?? 0;
  const fittedContinuation = real ? airborne.filter((point) => point.t > handoffTime).filter((_, index) => index % 4 === 0) : [];
  const fittedPoints = measuredPoints.length > 0 ? [measuredPoints[measuredPoints.length - 1], ...fittedContinuation] : [];
  return { session_id: 'sample', club: 'Driver', is_placeholder: !real, warnings: [], notes: real ? 'Stereo points include only synchronized frames where both cameras see the ball; physics extrapolates after the shared view ends.' : 'Adjustable synthetic shot; not connected to captured swing footage.', measured_points: measuredPoints, fitted_points: fittedPoints, simulated_trajectory: simulated, metrics: { ball_speed_mps: metric(parameters.velocity, source, real ? .66 : 1, 'Launch input.'), launch_angle_deg: metric(parameters.angle, source, real ? .66 : 1, 'Launch input.'), horizontal_launch_deg: metric(parameters.direction, source, real ? .65 : 1, 'Launch direction.'), carry_m: metric(carryPoint?.x ?? 0, source, real ? .65 : 1, 'First ground contact.'), total_m: metric(landing?.x ?? 0, real ? 'experimental' : 'synthetic', real ? .3 : 1, 'Bounce and rollout estimate.'), apex_m: metric(Math.max(...simulated.map((point) => point.y)), source, real ? .65 : 1, 'Peak trajectory height.'), side_deviation_m: metric(landing?.z ?? 0, source, real ? .6 : 1, 'Lateral finish.'), backspin_rpm: metric(parameters.backspin, source, real ? .3 : 1, 'Physics input.'), sidespin_rpm: metric(parameters.sidespin, source, real ? .3 : 1, 'Physics input.'), spin_axis_deg: metric(null, 'not_available', 0, ''), club_speed_mps: metric(null, 'not_available', 0, ''), smash_factor: metric(null, 'not_available', 0, '') } };
}

export default function GolfieProductDemo({ compact = false }: { compact?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<'sample' | 'real'>('real');
  const [view, setView] = useState<'flight' | 'swing'>('flight');
  const [parameters, setParameters] = useState(SAMPLE);
  const [playKey, setPlayKey] = useState(0);
  const payload = useMemo(() => makePayload(mode === 'real' ? REAL : parameters, mode === 'real'), [mode, parameters]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let animationFrame = 0;
    const update = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const availableWidth = Math.max(0, frame.clientWidth - 2);
        const availableHeight = Math.max(0, frame.clientHeight - 2);
        setScale(Math.min(availableWidth / DESIGN_WIDTH, availableHeight / DESIGN_HEIGHT));
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  const controls = [
    ['velocity', 'Velocity', 20, 75, 1, 'm/s'], ['angle', 'Angle', 5, 35, 1, 'deg'], ['direction', 'Direction', -15, 15, 1, 'deg'], ['backspin', 'Backspin', 0, 6500, 100, 'rpm'], ['sidespin', 'Sidespin', -2500, 2500, 100, 'rpm'], ['drag', 'Drag', .1, .5, .01, 'Cd'],
  ] as const;

  const sampleControls = <div className="portfolio-parameter-sidebar">
    <div className="portfolio-parameter-sidebar__title">Custom Shot</div>
    <div className="portfolio-parameter-sidebar__grid">
      {controls.map(([key, label, min, max, step, unit]) => <label key={key}><span>{label}<b>{parameters[key]} {unit}</b></span><input type="range" min={min} max={max} step={step} value={parameters[key]} onChange={(event) => setParameters((current) => ({ ...current, [key]: Number(event.target.value) }))} /></label>)}
    </div>
    <button onClick={() => setPlayKey((value) => value + 1)}>Replay customized shot</button>
  </div>;

  return <div ref={frameRef} className={`golfie-product-demo${compact ? ' golfie-product-demo--compact' : ''}`} aria-label="Interactive Golfie shot simulator">
    <div className="golfie-product-demo__stage" style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})` }}>
      <header className="app-header"><div className="app-header__row"><nav className="app-header__nav golfie-view-selector" role="tablist" aria-label="Golfie demo view"><button type="button" role="tab" aria-selected={view === 'flight'} className={`app-header__link ${view === 'flight' ? 'app-header__link--active' : ''}`} onClick={() => setView('flight')}>Ball flight</button><button type="button" role="tab" aria-selected={view === 'swing'} className={`app-header__link ${view === 'swing' ? 'app-header__link--active' : ''}`} onClick={() => setView('swing')}>YOLO swing comparison</button></nav></div></header>
      {view === 'flight' ? (
        <div className="golfie-product-demo__simulator"><ShotSimulatorView key={`${mode}-${playKey}`} payload={payload} title={mode === 'sample' ? 'Custom Shot Lab' : 'Real Shot Replay'} subtitle={mode === 'sample' ? 'Adjustable synthetic trajectory' : 'Measured session 8497991969EC'} sidebarControls={mode === 'sample' ? sampleControls : undefined} playbackRate={0.58} ballVisibilityScale={1.8} emphasizeBall />
          <div className="portfolio-shot-modes"><button className={mode === 'real' ? 'active' : ''} onClick={() => setMode('real')}>01 Real shot<small>Swing-derived + YOLO</small></button><button className={mode === 'sample' ? 'active' : ''} onClick={() => setMode('sample')}>02 Custom shot<small>Adjustable physics</small></button></div>
        </div>
      ) : (
        <div className="golfie-product-demo__swing"><GolfieSourceSwingDemo /></div>
      )}
    </div>
  </div>;
}
