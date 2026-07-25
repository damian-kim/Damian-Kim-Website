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
  return { session_id: 'sample', club: 'Driver', is_placeholder: !real, warnings: [], notes: real ? 'Real session 8497991969EC reconstructed from dual-camera swing footage.' : 'Adjustable synthetic shot; not connected to captured swing footage.', measured_points: real ? airborne.filter((_, index) => index % 18 === 0).slice(0, 18) : [], fitted_points: real ? airborne.filter((_, index) => index % 4 === 0).slice(0, 90) : [], simulated_trajectory: simulated, metrics: { ball_speed_mps: metric(parameters.velocity, source, real ? .66 : 1, 'Launch input.'), launch_angle_deg: metric(parameters.angle, source, real ? .66 : 1, 'Launch input.'), horizontal_launch_deg: metric(parameters.direction, source, real ? .65 : 1, 'Launch direction.'), carry_m: metric(carryPoint?.x ?? 0, source, real ? .65 : 1, 'First ground contact.'), total_m: metric(landing?.x ?? 0, real ? 'experimental' : 'synthetic', real ? .3 : 1, 'Bounce and rollout estimate.'), apex_m: metric(Math.max(...simulated.map((point) => point.y)), source, real ? .65 : 1, 'Peak trajectory height.'), side_deviation_m: metric(landing?.z ?? 0, source, real ? .6 : 1, 'Lateral finish.'), backspin_rpm: metric(parameters.backspin, source, real ? .3 : 1, 'Physics input.'), sidespin_rpm: metric(parameters.sidespin, source, real ? .3 : 1, 'Physics input.'), spin_axis_deg: metric(null, 'not_available', 0, ''), club_speed_mps: metric(null, 'not_available', 0, ''), smash_factor: metric(null, 'not_available', 0, '') } };
}

export default function GolfieProductDemo({ compact = false }: { compact?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<'sample' | 'real'>('sample');
  const [parameters, setParameters] = useState(SAMPLE);
  const [playKey, setPlayKey] = useState(0);
  const [showSwing, setShowSwing] = useState(false);
  const payload = useMemo(() => makePayload(mode === 'real' ? REAL : parameters, mode === 'real'), [mode, parameters]);

  useLayoutEffect(() => { const frame = frameRef.current; if (!frame) return; const update = () => setScale(frame.clientWidth / DESIGN_WIDTH); update(); const observer = new ResizeObserver(update); observer.observe(frame); return () => observer.disconnect(); }, []);

  const controls = [
    ['velocity', 'Velocity', 20, 75, 1, 'm/s'], ['angle', 'Angle', 5, 35, 1, 'deg'], ['direction', 'Direction', -15, 15, 1, 'deg'], ['backspin', 'Backspin', 0, 6500, 100, 'rpm'], ['sidespin', 'Sidespin', -2500, 2500, 100, 'rpm'], ['drag', 'Drag', .1, .5, .01, 'Cd'],
  ] as const;

  return <div ref={frameRef} className={`golfie-product-demo${compact ? ' golfie-product-demo--compact' : ''}`} aria-label="Interactive Golfie shot simulator">
    <div className="golfie-product-demo__stage" style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})` }}>
      <header className="app-header"><div className="app-header__row"><span className="app-header__wordmark">GOLFIE</span><nav className="app-header__nav"><span className="app-header__link">Upload</span><span className="app-header__link">Calibrate</span><span className="app-header__link app-header__link--active">Demo range</span><span className="app-header__link">Course map</span></nav></div></header>
      <div className="golfie-product-demo__simulator"><ShotSimulatorView key={`${mode}-${playKey}`} payload={payload} title={mode === 'sample' ? 'Sample Shot Lab' : 'Real Shot Replay'} subtitle={mode === 'sample' ? 'Adjustable synthetic trajectory' : 'Measured session 8497991969EC'} />
        <div className="portfolio-shot-modes"><button className={mode === 'sample' ? 'active' : ''} onClick={() => setMode('sample')}>01 Sample shot<small>Adjustable physics</small></button><button className={mode === 'real' ? 'active' : ''} onClick={() => setMode('real')}>02 Real shot<small>Swing-derived + YOLO</small></button></div>
        {mode === 'sample' ? <div className="portfolio-parameter-dock">{controls.map(([key, label, min, max, step, unit]) => <label key={key}><span>{label}<b>{parameters[key]} {unit}</b></span><input type="range" min={min} max={max} step={step} value={parameters[key]} onChange={(event) => setParameters((current) => ({ ...current, [key]: Number(event.target.value) }))} /></label>)}<button onClick={() => setPlayKey((value) => value + 1)}>Replay customized shot</button></div> : <div className="portfolio-real-shot-actions"><span>Parameters locked to stereo reconstruction</span><button onClick={() => setShowSwing(true)}>Open YOLO swing comparison</button></div>}
      </div>
    </div>
    {showSwing && <div className="portfolio-swing-modal"><button onClick={() => setShowSwing(false)}>Close comparison x</button><GolfieSourceSwingDemo /></div>}
  </div>;
}
