interface TimelineItemProps {
    date: string;
    location: string;
    role: string;
    company: string;
    companyUrl?: string;
    bullets: string[];
    tags: string[];
}

function TimelineCard({ date, location, role, company, companyUrl, bullets, tags }: TimelineItemProps) {
    return (
        <div className="timeline-item">
            <div className="timeline-meta">
                <span className="timeline-date">{date}</span>
                <span className="timeline-location">{location}</span>
            </div>
            <div className="timeline-content-card">
                <div className="card-header">
                    <h3 className="role-title">{role}</h3>
                    <h4 className="company-name">
                        {companyUrl ? (
                            <a href={companyUrl}>{company}</a>
                        ) : (
                            company
                        )}
                    </h4>
                </div>
                <ul className="experience-bullets">
                    {bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                    ))}
                </ul>
                <div className="tech-tags">
                    {tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Experience() {
    const experiences: TimelineItemProps[] = [
        {
            date: "May 2026 – Present",
            location: "Durham, NC",
            role: "Founder & Software Engineer",
            company: "Golfie (Golf Simulation Software)",
            companyUrl: "#physics-sandbox",
            bullets: [
                "Architected the complete pipeline for simulating and reconstructing 3D golf ball trajectories from dual-camera iPhone video streams.",
                "Built a custom physics engine in Python/NumPy using RK4 numerical integration to model gravity, drag, and Magnus lift forces.",
                "Created a computer vision stereo pipeline in OpenCV for camera calibration, triangulation, and launch parameter estimation.",
                "Developed an audio-based video sync system using FFmpeg and cross-correlation to align independent camera feeds.",
                "Engineered a 2D ball-detection algorithm utilizing median background modeling, contour convex hulls, and circularity metrics.",
                "Formulated golf ball launch speed, angle, and spin estimation algorithms using SciPy non-linear least-squares fitting.",
                "Generated an interactive 3D driving range with React, TypeScript, and Three.js to render simulated ball trajectory curves dynamically."
            ],
            tags: ["Python", "NumPy", "SciPy", "OpenCV", "Three.js", "TypeScript", "React"]
        },
        {
            date: "Jan 2026 – Apr 2026",
            location: "Durham, NC",
            role: "Teaching Assistant (Discrete Math)",
            company: "Duke University",
            bullets: [
                "Taught weekly recitations, held office hours, and graded/edited exams for a Discrete Mathematics course at Duke, improving students' conceptual understanding of graph theory, logic, and proof techniques."
            ],
            tags: ["Discrete Math", "Graph Theory", "Combinatorics", "Pedagogy"]
        },
        {
            date: "June 2023 – Aug 2024",
            location: "Rochester, MN",
            role: "SWE Intern (AI FAST Team)",
            company: "Mayo Clinic",
            bullets: [
                "Engineered scalable backend integrations of proprietary ML APIs with data processing pipelines using Python and REST frameworks, enabling efficient deployment and versioning of AI models in production.",
                "Automated Exploratory Data Analysis (EDA) pipelines by refactoring complex Jupyter notebooks into production-ready Python scripts.",
                "Assisted in the team's transition from Git to Azure DevOps, redesigning source control structures and CI/CD automation workflows.",
                "Created cloud-based data query pipelines on GCP using BigQuery and Vertex AI, replacing legacy on-premise SQL servers.",
                "Implemented frequency-based caching and data clustering strategies for a 2+ TB radiology imaging dataset, optimizing repeated query execution to reduce average scan volume by 20x and latency by 15–70%."
            ],
            tags: ["Python", "GCP", "BigQuery", "Vertex AI", "REST APIs", "Azure DevOps", "CI/CD"]
        },
        {
            date: "June – Aug 2021",
            location: "Hampton, VA",
            role: "Summer Research Mentee",
            company: "NASA Langley",
            bullets: [
                "Increased polymer composite void analysis accuracy by creating and training a Keras TensorFlow-based CNN on cross-sectional images, surpassing manual ImageJ analysis precision.",
                "Identified specific neural network failure modes and proposed AI architecture improvements for broader materials research applications."
            ],
            tags: ["TensorFlow", "Keras", "CNN", "Computer Vision", "Python"]
        }
    ];

    return (
        <section id="experience" className="experience-section section">
            <div className="container">
                <div className="section-header text-center">
                    <div className="badge">Career Milestones</div>
                    <h2 className="section-title">Professional Experience</h2>
                    <p className="section-subtitle">A timeline of software engineering internships, academic leadership, and startup building.</p>
                </div>

                <div className="timeline">
                    {experiences.map((exp, idx) => (
                        <TimelineCard key={idx} {...exp} />
                    ))}
                </div>
            </div>
        </section>
    );
}
