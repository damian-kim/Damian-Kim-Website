import { useState, useEffect } from 'react';

export default function Hero() {
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [reveal, setReveal] = useState(false);

    useEffect(() => {
        // Trigger line reveal animations shortly after mounting
        const timer = setTimeout(() => setReveal(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText('damiank0428@gmail.com').then(() => {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        });
    };

    const handleCopyPhone = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText('507-884-1666').then(() => {
            setCopiedPhone(true);
            setTimeout(() => setCopiedPhone(false), 2000);
        });
    };

    return (
        <section id="about" className="hero-section section">
            <div className="container hero-grid">
                <div className="hero-content">
                    <div className="badge">Duke CS &amp; Math Double Major</div>
                    
                    <h1 className="hero-title">
                        <span className="reveal-wrapper">
                            <span className={`reveal-text ${reveal ? 'animated' : ''}`}>
                                Engineering with
                            </span>
                        </span>
                        <span className="reveal-wrapper">
                            <span className={`reveal-text ${reveal ? 'animated' : ''} text-gradient`}>
                                Mathematical
                            </span>
                        </span>
                        <span className="reveal-wrapper">
                            <span className={`reveal-text ${reveal ? 'animated' : ''}`}>
                                Precision.
                            </span>
                        </span>
                    </h1>

                    <p className="hero-subtitle">
                        I build performant systems, custom physics models, and intelligent pipelines. Currently, I'm developing <strong>Golfie</strong>, a stereo-vision trajectory reconstruction app, and tutoring student minds in Discrete Mathematics.
                    </p>
                    <div className="hero-cta-group">
                        <a href="#physics-sandbox" className="btn btn-primary">Run Physics Sandbox</a>
                        <a href="#projects" className="btn btn-secondary">View My Work</a>
                    </div>
                    <div className="quick-contact">
                        <a 
                            href="mailto:damiank0428@gmail.com" 
                            className="contact-item" 
                            onClick={handleCopyEmail}
                            title="Click to copy email"
                            style={copiedEmail ? { borderColor: 'var(--accent-teal)' } : {}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span>damiank0428@gmail.com</span>
                            <span 
                                className="tooltip" 
                                style={{ visibility: copiedEmail ? 'visible' : 'hidden', opacity: copiedEmail ? 1 : 0 }}
                            >
                                Copied!
                            </span>
                        </a>
                        <a 
                            href="tel:507-884-1666" 
                            className="contact-item" 
                            onClick={handleCopyPhone}
                            title="Click to copy phone number"
                            style={copiedPhone ? { borderColor: 'var(--accent-teal)' } : {}}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>507-884-1666</span>
                            <span 
                                className="tooltip" 
                                style={{ visibility: copiedPhone ? 'visible' : 'hidden', opacity: copiedPhone ? 1 : 0 }}
                            >
                                Copied!
                            </span>
                        </a>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="visual-card">
                        <div className="card-header-bar">
                            <span className="circle red"></span>
                            <span className="circle yellow"></span>
                            <span className="circle green"></span>
                            <span className="file-name">trajectory_solver.py</span>
                        </div>
                        <pre className="code-editor"><code>
<span className="code-keyword">import</span> numpy <span className="code-keyword">as</span> np{"\n\n"}
<span className="code-keyword">def</span> <span className="code-function">rk4_step</span>(y, t, dt, deriv):{"\n"}
    {"  "}k1 = deriv(y, t){"\n"}
    {"  "}k2 = deriv(y + <span className="code-number">0.5</span>*dt*k1, t + <span className="code-number">0.5</span>*dt){"\n"}
    {"  "}k3 = deriv(y + <span className="code-number">0.5</span>*dt*k2, t + <span className="code-number">0.5</span>*dt){"\n"}
    {"  "}k4 = deriv(y + dt*k3, t + dt){"\n"}
    {"  "}<span className="code-keyword">return</span> y + (dt/<span className="code-number">6.0</span>) * (k1 + <span className="code-number">2.0</span>*k2 + <span className="code-number">2.0</span>*k3 + k4){"\n\n"}
<span className="code-comment"># Physics Parameters</span>{"\n"}
g = <span className="code-number">9.81</span>      <span className="code-comment"># Gravity (m/s^2)</span>{"\n"}
rho = <span className="code-number">1.225</span>   <span className="code-comment"># Air density (kg/m^3)</span>{"\n"}
Cd = <span className="code-number">0.24</span>     <span className="code-comment"># Drag Coefficient</span>{"\n"}
Spin = <span className="code-number">2800</span>   <span className="code-comment"># Backspin (RPM)</span>
                        </code></pre>
                        <div className="visual-badge">
                            <span className="math-symbol">∑</span> Math &amp; Code Integrated
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
