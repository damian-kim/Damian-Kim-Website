import { useState } from 'react';

type SkillCategory = 'all' | 'lang' | 'framework' | 'math';

interface Skill {
    name: string;
    category: 'lang' | 'framework' | 'math';
}

export default function EducationSkills() {
    const [filter, setFilter] = useState<SkillCategory>('all');

    const courses = [
        "Theory & Algorithms of ML",
        "Design & Analysis of Algorithms",
        "Applied Stochastic Processes",
        "Bayesian & Modern Statistics",
        "Statistical Computing",
        "Mathematical Finance",
        "Algorithmic Trading",
        "Computer Vision",
        "Regression Analysis",
        "Database Systems",
        "Computer Systems",
        "Discrete Mathematics"
    ];

    const skills: Skill[] = [
        // Languages
        { name: "Python", category: "lang" },
        { name: "TypeScript", category: "lang" },
        { name: "JavaScript", category: "lang" },
        { name: "Java", category: "lang" },
        { name: "SQL", category: "lang" },
        { name: "R", category: "lang" },
        { name: "HTML/CSS", category: "lang" },

        // Frameworks & Tools
        { name: "React", category: "framework" },
        { name: "Next.js", category: "framework" },
        { name: "Flask", category: "framework" },
        { name: "FastAPI", category: "framework" },
        { name: "OpenCV", category: "framework" },
        { name: "TensorFlow", category: "framework" },
        { name: "Keras", category: "framework" },
        { name: "Git", category: "framework" },
        { name: "Azure DevOps", category: "framework" },
        { name: "GCP (BigQuery / Vertex AI)", category: "framework" },
        { name: "MongoDB", category: "framework" },

        // Math & Stats
        { name: "NumPy", category: "math" },
        { name: "SciPy", category: "math" },
        { name: "Pandas", category: "math" },
        { name: "Scikit-Learn", category: "math" },
        { name: "Numerical Integration (RK4)", category: "math" },
        { name: "Least-Squares Fitting", category: "math" },
        { name: "Stochastic Modeling", category: "math" }
    ];

    const handleFilterChange = (category: SkillCategory) => {
        setFilter(category);
    };

    return (
        <section id="education" className="education-section section">
            <div className="container education-grid">
                {/* Education Card */}
                <div className="education-info">
                    <div className="badge">Academic Journey</div>
                    <h2 className="section-title">Education</h2>
                    
                    <div className="edu-card">
                        <div className="edu-card-header">
                            <div className="edu-logo-placeholder">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                                </svg>
                            </div>
                            <div className="edu-details">
                                <h3>Duke University</h3>
                                <p className="edu-degree">Bachelor of Science in Computer Science &amp; Mathematics</p>
                                <p className="edu-meta">Class of 2027 | GPA: <strong>3.8</strong></p>
                            </div>
                        </div>
                        
                        <div className="coursework-box">
                            <h4>Relevant Coursework</h4>
                            <div className="course-list">
                                {courses.map((course, idx) => (
                                    <span key={idx} className="course">{course}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Interactive Filter */}
                <div className="skills-info">
                    <div className="badge">Technical Expertise</div>
                    <h2 className="section-title">Skills &amp; Technologies</h2>
                    <p className="skills-instruction">Click categories to filter our focus.</p>

                    <div className="skills-filter-tabs">
                        <button 
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'lang' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('lang')}
                        >
                            Languages
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'framework' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('framework')}
                        >
                            Frameworks &amp; Tools
                        </button>
                        <button 
                            className={`filter-tab ${filter === 'math' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('math')}
                        >
                            Math &amp; Stats
                        </button>
                    </div>

                    <div className="skills-wrapper">
                        {skills.map((skill, idx) => {
                            const isVisible = filter === 'all' || skill.category === filter;
                            return (
                                <div 
                                    key={idx} 
                                    className={`skill-pill ${isVisible ? '' : 'hidden'}`}
                                    style={!isVisible ? { display: 'none' } : {}}
                                >
                                    {skill.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
