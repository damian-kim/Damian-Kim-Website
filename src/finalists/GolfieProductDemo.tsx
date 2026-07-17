import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ShotSimulatorView } from '../golfie/components/ShotSimulatorView';
import '../golfie/components/Header.css';
import type { MetricSource, MetricValue, TrajectoryPayload } from '../golfie/lib/types';
import { calculateTrajectory3D } from '../utils/physics';

const DESIGN_WIDTH = 1600;
const DESIGN_HEIGHT = 730;

function metric(value: number | null, source: MetricSource, confidence: number, notes: string): MetricValue {
  return { value, source, confidence, notes };
}

export default function GolfieProductDemo({ compact = false }: { compact?: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const payload = useMemo<TrajectoryPayload>(() => {
    const simulated = calculateTrajectory3D(50.8, 14.8, 6, 3200, 0, 0.24, 9.81)
      .map((point) => ({ ...point, confidence: 0.66 }));
    const airborne = simulated.filter((point) => point.y > 0.02);
    const measured = airborne.filter((_, index) => index % 18 === 0).slice(0, 18);
    const fitted = airborne.filter((_, index) => index % 4 === 0).slice(0, 90);
    const landing = simulated[simulated.length - 1];
    const carryPoint = simulated.findLast((point, index) => index > 0 && point.y <= 0.02 && simulated[index - 1].y > 0.02);
    const apex = Math.max(...simulated.map((point) => point.y));

    return {
      session_id: 'sample',
      club: 'Driver',
      is_placeholder: false,
      warnings: [],
      notes: 'Portfolio replay powered by the production Golfie range renderer.',
      measured_points: measured,
      fitted_points: fitted,
      simulated_trajectory: simulated,
      metrics: {
        ball_speed_mps: metric(50.8, 'estimated', 0.66, 'Estimated from the first stereo-reconstructed ball observations.'),
        launch_angle_deg: metric(14.8, 'estimated', 0.66, 'Estimated from the first stereo-reconstructed ball observations.'),
        horizontal_launch_deg: metric(6, 'estimated', 0.65, 'Target line inferred from Camera A down-the-line orientation.'),
        carry_m: metric(carryPoint?.x ?? 93.1, 'estimated', 0.65, 'Drag-only flight estimate to first ground contact.'),
        total_m: metric(landing?.x ?? 132.8, 'experimental', 0.3, 'Experimental fairway bounce and rollout estimate.'),
        apex_m: metric(apex, 'estimated', 0.65, 'Peak height from the fitted trajectory.'),
        side_deviation_m: metric(landing?.z ?? 0, 'estimated', 0.6, 'Lateral finish relative to the target line.'),
        backspin_rpm: metric(3200, 'experimental', 0.3, 'Physics launch-fit input.'),
        sidespin_rpm: metric(null, 'not_available', 0, ''),
        spin_axis_deg: metric(null, 'not_available', 0, ''),
        club_speed_mps: metric(null, 'not_available', 0, ''),
        smash_factor: metric(null, 'not_available', 0, ''),
      },
    };
  }, []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const updateScale = () => setScale(frame.clientWidth / DESIGN_WIDTH);
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className={`golfie-product-demo${compact ? ' golfie-product-demo--compact' : ''}`}
      aria-label="Interactive Golfie shot simulator"
    >
      <div
        className="golfie-product-demo__stage"
        style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})` }}
      >
        <header className="app-header">
          <div className="app-header__row">
            <span className="app-header__wordmark">GOLFIE</span>
            <nav className="app-header__nav" aria-label="Golfie application sections">
              <span className="app-header__link">Upload</span>
              <span className="app-header__link">Calibrate</span>
              <span className="app-header__link app-header__link--active">Demo range</span>
              <span className="app-header__link">Course map</span>
            </nav>
          </div>
        </header>
        <div className="golfie-product-demo__simulator">
          <button className="golfie-product-demo__back" type="button">← Back to review</button>
          <ShotSimulatorView
            payload={payload}
            title="Shot Simulator"
            subtitle="Telemetry & trajectory replay · Session 8497991969EC"
          />
        </div>
      </div>
    </div>
  );
}
