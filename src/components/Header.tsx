import { useState, useEffect } from 'react';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Active section highlighting logic
            const sections = document.querySelectorAll('section');
            let current = 'about';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id') || 'about';
                }
            });
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container container">
                <a href="#" className="logo" onClick={closeMenu}>
                    <span className="logo-bold">Damian</span>
                    <span className="logo-light">Kim</span>
                </a>
                
                <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                    <a 
                        href="#about" 
                        className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        About
                    </a>
                    <a 
                        href="#physics-sandbox" 
                        className={`nav-link ${activeSection === 'physics-sandbox' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Physics Sandbox
                    </a>
                    <a 
                        href="#experience" 
                        className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Experience
                    </a>
                    <a 
                        href="#projects" 
                        className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Projects
                    </a>
                    <a 
                        href="#education" 
                        className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}
                        onClick={closeMenu}
                    >
                        Education &amp; Skills
                    </a>
                    <a 
                        href="#contact" 
                        className="nav-link nav-btn"
                        onClick={closeMenu}
                    >
                        Contact
                    </a>
                </nav>

                <button 
                    className="menu-toggle" 
                    onClick={toggleMenu} 
                    aria-label="Toggle Menu"
                >
                    {!menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    )}
                </button>
            </div>
        </header>
    );
}
