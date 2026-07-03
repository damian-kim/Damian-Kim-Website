// 3D Runge-Kutta 4th Order (RK4) integration for projectile mechanics
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
    // spin vector: [omega_x, omega_y, omega_z]
    // backspin is rotation about Z, sidespin is rotation about Y
    const omegaY = sidespin * Math.PI / 30.0;
    const omegaZ = backspin * Math.PI / 30.0;
    
    // Cross product: w = omega x v
    // wx = omegaY * vz - omegaZ * vy
    // wy = omegaZ * vx
    // wz = -omegaY * vx
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
    backspin: number,
    sidespin: number,
    Cd: number,
    gravity: number
): ScenePoint[] {
    const angleRad = angleDeg * Math.PI / 180.0;
    
    // Initial state: [x, y, z, vx, vy, vz]
    // Launching down the +X fairway
    let state: [number, number, number, number, number, number] = [
        0.0, 
        0.0, 
        0.0, 
        v0 * Math.cos(angleRad), 
        v0 * Math.sin(angleRad),
        0.0 // initial lateral velocity is 0
    ];

    const path: ScenePoint[] = [{ x: state[0], y: state[1], z: state[2], t: 0.0 }];
    const dt = 0.015;
    let t = 0.0;
    const maxDuration = 30.0;

    while (state[1] >= 0.0 && t < maxDuration) {
        state = rk4Step3D(state, dt, Cd, backspin, sidespin, gravity);
        t += dt;
        path.push({ x: state[0], y: state[1], z: state[2], t });
    }

    // exact landing correction
    if (state[1] < 0.0 && path.length > 1) {
        const before = path[path.length - 2];
        const after = path[path.length - 1];
        
        const ratio = (0.0 - before.y) / (after.y - before.y);
        const finalX = before.x + ratio * (after.x - before.x);
        const finalZ = before.z + ratio * (after.z - before.z);
        const finalT = before.t + ratio * (after.t - before.t);

        path[path.length - 1] = {
            x: finalX,
            y: 0.0,
            z: finalZ,
            t: finalT
        };
    }

    return path;
}
