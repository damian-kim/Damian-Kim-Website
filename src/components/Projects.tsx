import { useState } from 'react';
import { JunoDemo, SateDemo } from '../finalists/ProjectDemos';

interface ProjectProps {
    index: string;
    title: string;
    description: string;
    features: string[];
    tech: string[];
    codeSnippet: string;
}

export default function Projects() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [viewMode, setViewMode] = useState<'demo' | 'code'>('demo');

    const projects: ProjectProps[] = [
        {
            index: "01",
            title: "Juno (VoIP App)",
            description: "A low-latency voice and video calling application designed for high performance under restricted bandwidths. Features custom real-time services like AI transcription and game synchronization inside active call rooms.",
            features: [
                "Delivered sub-200ms US-to-China latency utilizing Agora RTC SDK configurations.",
                "Engineered a screen-sharing server rendering stable 1080p 30fps video with local persistence.",
                "Developed a WebSocket-based live subtitling pipeline integrating Deepgram (SST), Google Cloud Translation, and TTS outputs.",
                "Created a multiplayer Wordle game running directly inside call rooms using synchronized Zustand stores."
            ],
            tech: ["Agora RTC", "WebSockets", "Deepgram", "Zustand", "React", "TypeScript"],
            codeSnippet: `// WebSocket Audio Subtitling Pipeline
const socket = new WebSocket('wss://api.deepgram.com');
mediaRecorder.ondataavailable = async (e) => {
  if (e.data.size > 0 && socket.readyState === 1) {
    socket.send(e.data);
  }
};

socket.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  const transcript = data.channel.alternatives[0].transcript;
  if (transcript) handleTranscription(transcript);
};`
        },
        {
            index: "02",
            title: "Sate App",
            description: "A Tinder-style swipe interface for group dining discovery that resolves the 'where should we eat' conflict via collaborative filtering recommendation models.",
            features: [
                "Built a full-stack Flask application using MongoDB backend and swiping interfaces.",
                "Engineered and tested a weighted group recommendation model incorporating negative user feedback loops.",
                "Achieved ~65% higher consensus accuracy in survey testing compared to baseline random recommendations."
            ],
            tech: ["Flask", "MongoDB", "Python", "Recommendation Systems"],
            codeSnippet: `# Dining Group Collaborative Consensus
def calculate_consensus(votes, weights):
    scores = defaultdict(float)
    for user, vote in votes.items():
        for rest_id, preference in vote.items():
            # Apply negative feedback adjustments
            factor = -1.5 if preference < 0 else 1.0
            scores[rest_id] += preference * weights[user] * factor
            
    return max(scores, key=scores.get)`
        }
    ];

    const handleNext = () => {
        setActiveSlide((prev) => (prev + 1) % projects.length);
    };

    const handlePrev = () => {
        setActiveSlide((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const progressWidth = `${((activeSlide + 1) / projects.length) * 100}%`;

    return (
        <section id="projects" className="projects-section section bg-alt">
            <div className="container">
                <div className="section-header">
                    <div className="badge">Featured Cases</div>
                    <h2 className="section-title">Selected Projects</h2>
                    <p className="section-subtitle">Engineering applications showcasing real-time systems, API integrations, and algorithmic solutions.</p>
                </div>

                {/* Case Study Slider */}
                <div className="slider-container">
                    <div className="slide-track">
                        {projects.map((proj, idx) => {
                            const isActive = idx === activeSlide;
                            return (
                                <div 
                                    key={idx} 
                                    className={`slide-item ${isActive ? 'active' : ''}`}
                                    style={!isActive ? { display: 'none' } : {}}
                                >
                                    {/* Left Details Panel */}
                                    <div className="slide-details-panel">
                                        <div className="slide-index">{proj.index} / 0{projects.length}</div>
                                        <h3 className="slide-title">{proj.title}</h3>
                                        <p className="slide-desc">{proj.description}</p>
                                        
                                        <ul className="slide-bullets">
                                            {proj.features.map((feat, fIdx) => (
                                                <li key={fIdx}>{feat}</li>
                                            ))}
                                        </ul>

                                        <div className="slide-tech-wrapper">
                                            {proj.tech.map((t, tIdx) => (
                                                <span key={tIdx} className="badge">{t}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Visual Panel (Live Interactive Demo & Code Switcher) */}
                                    <div className="slide-visual-panel">
                                        <div className="slide-mode-toggle" style={{ padding: '8px 12px', display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <button 
                                                type="button" 
                                                className={`badge ${viewMode === 'demo' ? 'active' : ''}`}
                                                style={{ cursor: 'pointer', background: viewMode === 'demo' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'demo' ? '#000' : 'inherit' }}
                                                onClick={() => setViewMode('demo')}
                                            >
                                                ⚡ Live Demo
                                            </button>
                                            <button 
                                                type="button" 
                                                className={`badge ${viewMode === 'code' ? 'active' : ''}`}
                                                style={{ cursor: 'pointer', background: viewMode === 'code' ? 'var(--color-primary)' : 'transparent', color: viewMode === 'code' ? '#000' : 'inherit' }}
                                                onClick={() => setViewMode('code')}
                                            >
                                                📄 Code Blueprint
                                            </button>
                                        </div>

                                        {viewMode === 'demo' ? (
                                            <div className="slide-demo-wrapper" style={{ height: '100%', minHeight: '480px' }}>
                                                {idx === 0 ? <JunoDemo tone="flight" /> : <SateDemo tone="flight" />}
                                            </div>
                                        ) : (
                                            <pre className="slide-code-visual">
                                                <code>{proj.codeSnippet}</code>
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Slider Navigation Footer */}
                    <div className="slider-footer">
                        <div className="slider-nav-meta">
                            Case 0{activeSlide + 1}
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="slider-progress-bar">
                            <div 
                                className="slider-progress-fill" 
                                style={{ width: progressWidth }}
                            ></div>
                        </div>

                        <div className="slider-arrows">
                            <button 
                                className="btn-icon" 
                                onClick={handlePrev}
                                aria-label="Previous Case Study"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                            </button>
                            <button 
                                className="btn-icon" 
                                onClick={handleNext}
                                aria-label="Next Case Study"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
