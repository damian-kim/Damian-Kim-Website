// 3D Runge-Kutta 4th Order (RK4) integration for projectile mechanics with bouncing and rolling friction
import type { ScenePoint } from '../lib/types';

// Advances state using RK4 solver in 3D: [x, y, z, vx, vy, vz]
export function getDerivatives3D(
    state: [number, number, number, number, number, number], // [x, y, z, vx, vy, vz]
    Cd: number,
    backspin: number, // RPM (rotation about Z)
    sidespin: number, // RPM (rotation about Y)
    gravity: number
): [number, number, number, number, number, number] {
    const vx = state[3];
    const vy = state[4];
    const vz = state[5];
    const v = Math.sqrt(vx * vx + vy * vy + vz * vz);

    if (v === 0) {
        return [0, 0, 0, 0, -gravity, 0];
    }

    // Golf ball specs
    const m = 0.04593; // kg
    const r = 0.02133; // m
    const A = Math.PI * r * r;
    const rho = 1.225; // kg/m^3

    // 1. Gravity Force: acts downward on Y axis

    // 2. Aerodynamic Drag Force (opposite to velocity direction)
    const Fd = 0.5 * rho * Cd * A * v * v;
    const adx = -(Fd / m) * (vx / v);
    const ady = -(Fd / m) * (vy / v);
    const adz = -(Fd / m) * (vz / v);

    // 3. Magnus Lift Force (cross product of angular velocity and velocity)
    const omegaY = sidespin * Math.PI / 30.0;
    const omegaZ = backspin * Math.PI / 30.0;
    
    // Cross product: w = omega x v
    const wx = omegaY * vz - omegaZ * vy;
    const wy = omegaZ * vx;
    const wz = -omegaY * vx;
    const wLen = Math.sqrt(wx * wx + wy * wy + wz * wz);

    let alx = 0;
    let aly = 0;
    let alz = 0;

    if (wLen > 0) {
        const totalSpinRpm = Math.sqrt(backspin * backspin + sidespin * sidespin);
        const Cl = Math.min(0.4, 0.05 + totalSpinRpm / 12000.0);
        const Fl = 0.5 * rho * Cl * A * v * v;
        
        // Force direction is w / wLen
        alx = (Fl / m) * (wx / wLen);
        aly = (Fl / m) * (wy / wLen);
        alz = (Fl / m) * (wz / wLen);
    }

    // Summing accelerations
    const ax = adx + alx;
    const ay = -gravity + ady + aly;
    const az = adz + alz;

    return [vx, vy, vz, ax, ay, az];
}

export function rk4Step3D(
    state: [number, number, number, number, number, number],
    dt: number,
    Cd: number,
    backspin: number,
    sidespin: number,
    gravity: number
): [number, number, number, number, number, number] {
    const k1 = getDerivatives3D(state, Cd, backspin, sidespin, gravity);

    const s2: [number, number, number, number, number, number] = [
        state[0] + 0.5 * dt * k1[0],
        state[1] + 0.5 * dt * k1[1],
        state[2] + 0.5 * dt * k1[2],
        state[3] + 0.5 * dt * k1[3],
        state[4] + 0.5 * dt * k1[4],
        state[5] + 0.5 * dt * k1[5]
    ];
    const k2 = getDerivatives3D(s2, Cd, backspin, sidespin, gravity);

    const s3: [number, number, number, number, number, number] = [
        state[0] + 0.5 * dt * k2[0],
        state[1] + 0.5 * dt * k2[1],
        state[2] + 0.5 * dt * k2[2],
        state[3] + 0.5 * dt * k2[3],
        state[4] + 0.5 * dt * k2[4],
        state[5] + 0.5 * dt * k2[5]
    ];
    const k3 = getDerivatives3D(s3, Cd, backspin, sidespin, gravity);

    const s4: [number, number, number, number, number, number] = [
        state[0] + dt * k3[0],
        state[1] + dt * k3[1],
        state[2] + dt * k3[2],
        state[3] + dt * k3[3],
        state[4] + dt * k3[4],
        state[5] + dt * k3[5]
    ];
    const k4 = getDerivatives3D(s4, Cd, backspin, sidespin, gravity);

    return [
        state[0] + (dt / 6.0) * (k1[0] + 2.0 * k2[0] + 2.0 * k3[0] + k4[0]),
        state[1] + (dt / 6.0) * (k1[1] + 2.0 * k2[1] + 2.0 * k3[1] + k4[1]),
        state[2] + (dt / 6.0) * (k1[2] + 2.0 * k2[2] + 2.0 * k3[2] + k4[2]),
        state[3] + (dt / 6.0) * (k1[3] + 2.0 * k2[3] + 2.0 * k3[3] + k4[3]),
        state[4] + (dt / 6.0) * (k1[4] + 2.0 * k2[4] + 2.0 * k3[4] + k4[4]),
        state[5] + (dt / 6.0) * (k1[5] + 2.0 * k2[5] + 2.0 * k3[5] + k4[5])
    ];
}

export function calculateTrajectory3D(
    v0: number,
    angleDeg: number,
    yawDeg: number, // horizontal launch direction (degrees left/right)
    backspin: number,
    sidespin: number,
    Cd: number,
    gravity: number
): ScenePoint[] {
    const angleRad = angleDeg * Math.PI / 180.0;
    const yawRad = yawDeg * Math.PI / 180.0;
    
    // Initial state: [x, y, z, vx, vy, vz]
    // Launching down the +X fairway, with yaw angle deviating left/right
    const vx = v0 * Math.cos(angleRad) * Math.cos(yawRad);
    const vy = v0 * Math.sin(angleRad);
    const vz = v0 * Math.cos(angleRad) * Math.sin(yawRad);

    let state: [number, number, number, number, number, number] = [
        0.0, 
        0.0, 
        0.0, 
        vx, 
        vy,
        vz
    ];

    const path: ScenePoint[] = [{ x: state[0], y: state[1], z: state[2], t: 0.0 }];
    const dt = 0.015;
    let t = 0.0;
    const maxDuration = 35.0; // Slightly increased to allow complete bounce + roll duration

    let currentBackspin = backspin;
    let currentSidespin = sidespin;
    let bounceCount = 0;
    const maxBounces = 6;

    while (t < maxDuration) {
        state = rk4Step3D(state, dt, Cd, currentBackspin, currentSidespin, gravity);
        t += dt;

        // Ground collision check
        if (state[1] < 0.0) {
            state[1] = 0.0; // lock ball vertically to turf surface
            
            const vy = state[4];

            // If vertical velocity is small or max bounces reached, transition to roll
            if (Math.abs(vy) < 0.8 || bounceCount >= maxBounces) {
                state[4] = 0.0; // kill vertical velocity

                // Calculate rolling speed
                const rollingSpeed = Math.sqrt(state[3] * state[3] + state[5] * state[5]);
                
                if (rollingSpeed < 0.2) {
                    // Ball comes to rest
                    state[3] = 0.0;
                    state[5] = 0.0;
                    path.push({ x: state[0], y: state[1], z: state[2], t });
                    break;
                } else {
                    // Apply rolling friction coefficient (friction decelerates the rolling ball)
                    const frictionCoeff = 0.08; // grass roll resistance
                    const frictionDecel = frictionCoeff * gravity * dt;
                    const ratio = Math.max(0, (rollingSpeed - frictionDecel) / rollingSpeed);
                    state[3] *= ratio;
                    state[5] *= ratio;
                }
            } else {
                // Bounce reflection: reverse vertical speed and apply coefficient of restitution (e.g. 0.42 for turf)
                state[4] = -vy * 0.42;

                // Apply impact friction: deduct horizontal speed components
                state[3] *= 0.72;
                state[5] *= 0.72;
                
                bounceCount++;
            }

            // Spin decays on impact
            currentBackspin *= 0.45;
            currentSidespin *= 0.45;
        }

        path.push({ x: state[0], y: state[1], z: state[2], t });
    }

    return path;
}
