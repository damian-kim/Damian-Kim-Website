import { useState, useMemo } from 'react';
import { calculateTrajectory3D } from '../utils/physics';
import DrivingRangeScene from './DrivingRangeScene';

export default function PhysicsSandbox() {
    // Parameter States
    const [velocity, setVelocity] = useState(45);
    const [angle, setAngle] = useState(15);
    const [direction, setDirection] = useState(0); // -20 to 20 degrees (left/right)
    const [backspin, setBackspin] = useState(3000);
    const [sidespin, setSidespin] = useState(0); // -2000 to 2000 RPM
    const [drag, setDrag] = useState(0.24);
    const [gravity, setGravity] = useState(9.81);

    // Animation control token
    const [playToken, setPlayToken] = useState(0);

    // Compute 3D trajectory path when parameters change
    const path = useMemo(() => {
        return calculateTrajectory3D(velocity, angle, direction, backspin, sidespin, drag, gravity);
    }, [velocity, angle, direction, backspin, sidespin, drag, gravity]);

    // Compute metrics
    const metrics = useMemo(() => {
        if (path.length === 0) return { distance: 0, peak: 0, time: 0 };
        const landing = path[path.length - 1];
        const peak = Math.max(...path.map(p => p.y));
        return {
            distance: landing.x,
            peak: peak,
            time: landing.t
        };
    }, [path]);

    const handleLaunch = () => {
        setPlayToken(prev => prev + 1);
    };

    const handleReset = () => {
        setVelocity(45);
        setAngle(15);
        setDirection(0);
        setBackspin(3000);
        setSidespin(0);
        setDrag(0.24);
        setGravity(9.81);
        setPlayToken(0);
    };

    const getSidespinLabel = (val: number) => {
        if (val === 0) return '0 RPM (Straight)';
        if (val < 0) return `${Math.abs(val)} RPM (Draw / Hook)`;
        return `${val} RPM (Fade / Slice)`;
    };

    const getDirectionLabel = (val: number) => {
        if (val === 0) return '0° (Straight)';
        if (val < 0) return `${Math.abs(val)}° Left`;
        return `${val}° Right`;
    };

    return (
        <section id="physics-sandbox" className="physics-section section bg-alt">
            <div className="container">
                <div className="section-header text-center">
                    <div className="badge">Interactive Engineering</div>
                    <h2 className="section-title">3D Projectile Simulator</h2>
                    <p className="section-subtitle">
                        An interactive 3D driving range powered by React Three Fiber and Three.js. Drag sliders to adjust initial velocity, 3D spin axes, drag, and gravity to see numerical RK4 equations solved in real-time.
                    </p>
                </div>

                <div className="sandbox-grid">
                    {/* 3D Canvas Scene */}
                    <div className="canvas-container">
                        <div className="canvas-toolbar">
                            <div className="trajectory-metrics">
                                <span className="metric">Distance: <strong id="metric-dist">{metrics.distance.toFixed(1)} m</strong></span>
                                <span className="metric">Peak Height: <strong id="metric-peak">{metrics.peak.toFixed(1)} m</strong></span>
                                <span className="metric">Hang Time: <strong id="metric-time">{metrics.time.toFixed(2)}s</strong></span>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                Drag to orbit | Scroll to zoom
                            </div>
                        </div>

                        {/* R3F Driving Range Canvas wrapper */}
                        <DrivingRangeScene simulated={path} playToken={playToken} />

                        <div className="canvas-controls">
                            <button 
                                id="btn-launch" 
                                className="btn btn-primary btn-icon-text"
                                onClick={handleLaunch}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Launch Ball
                            </button>
                            <button 
                                id="btn-reset" 
                                className="btn btn-secondary btn-icon-text"
                                onClick={handleReset}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 4v6h-6"></path>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Simulator Controls */}
                    <div className="control-panel">
                        <h3>Parameters</h3>
                        <p className="panel-desc">Modify inputs to recalculate acceleration equations.</p>
                        
                        <div className="control-group">
                            <div className="control-label">
                                <label htmlFor="param-velocity">Launch Velocity</label>
                                <span className="val-display" id="val-velocity">{velocity} m/s</span>
                            </div>
                            <input 
                                type="range" 
                                id="param-velocity" 
                                min="10" 
                                max="80" 
                                step="1" 
                                value={velocity}
                                onChange={(e) => setVelocity(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-label">
                                <label htmlFor="param-angle">Launch Angle</label>
                                <span className="val-display" id="val-angle">{angle}°</span>
                            </div>
                            <input 
                                type="range" 
                                id="param-angle" 
                                min="5" 
                                max="80" 
                                step="1" 
                                value={angle}
                                onChange={(e) => setAngle(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-label">
                                <label htmlFor="param-direction">Launch Direction</label>
                                <span className="val-display" id="val-direction" style={{ color: direction === 0 ? 'var(--text-primary)' : direction < 0 ? '#ef4444' : '#3b82f6' }}>
                                    {getDirectionLabel(direction)}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                id="param-direction" 
                                min="-20" 
                                max="20" 
                                step="1" 
                                value={direction}
                                onChange={(e) => setDirection(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-label">
                                <label htmlFor="param-spin">Backspin Rate</label>
                                <span className="val-display" id="val-spin">{backspin} RPM</span>
                            </div>
                            <input 
                                type="range" 
                                id="param-spin" 
                                min="0" 
                                max="6000" 
                                step="100" 
                                value={backspin}
                                onChange={(e) => setBackspin(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-label">
                                <label htmlFor="param-sidespin">Sidespin Rate</label>
                                <span className="val-display" id="val-sidespin" style={{ color: sidespin === 0 ? 'var(--text-primary)' : sidespin < 0 ? '#ef4444' : '#3b82f6' }}>
                                    {getSidespinLabel(sidespin)}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                id="param-sidespin" 
                                min="-2000" 
                                max="2000" 
                                step="100" 
                                value={sidespin}
                                onChange={(e) => setSidespin(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-label">
                                <label htmlFor="param-drag">Drag Coefficient (C<sub>d</sub>)</label>
                                <span className="val-display" id="val-drag">{drag.toFixed(2)}</span>
                            </div>
                            <input 
                                type="range" 
                                id="param-drag" 
                                min="0.0" 
                                max="0.6" 
                                step="0.01" 
                                value={drag}
                                onChange={(e) => setDrag(parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="control-group">
                            <div className="control-label">
                                <label htmlFor="param-gravity">Gravity (g)</label>
                                <span className="val-display" id="val-gravity">{gravity.toFixed(1)} m/s²</span>
                            </div>
                            <input 
                                type="range" 
                                id="param-gravity" 
                                min="1" 
                                max="25" 
                                step="0.1" 
                                value={gravity}
                                onChange={(e) => setGravity(parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="physics-explanation-box">
                            <h4>Governing Mechanics</h4>
                            <p>{"State vectors $\\vec{s} = [x, y, z, v_x, v_y, v_z]$ update iteratively over $dt$ using RK4. Acceleration is given by:"}</p>
                            <div className="formula">
                                {"$$\\vec{a} = \\vec{g} - \\frac{1}{2m} \\rho C_d A |\\vec{v}|\\vec{v} + \\frac{1}{2m} C_l \\rho A d \\frac{\\vec{\\omega} \\times \\vec{v}}{|\\vec{\\omega} \\times \\vec{v}|}$$"}
                            </div>
                            <p className="notes">Adjusting sidespin changes the vertical/horizontal components of the cross product vector, causing the ball to hook or slice in 3D space.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
