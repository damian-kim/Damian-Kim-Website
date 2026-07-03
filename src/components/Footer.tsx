export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <p>&copy; {new Date().getFullYear()} Damian Kim. Built with React, TypeScript, and Vite (numerical RK4 math integrations).</p>
                <div className="footer-links">
                    <a href="#about">About</a>
                    <a href="#physics-sandbox">Physics Sandbox</a>
                    <a href="#experience">Experience</a>
                    <a href="#projects">Projects</a>
                </div>
            </div>
        </footer>
    );
}
