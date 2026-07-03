import { useState } from 'react';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        setTimeout(() => {
            setSending(false);
            setFeedback({
                text: 'Message sent! Thank you for reaching out, Damian will contact you shortly.',
                success: true
            });
            setName('');
            setEmail('');
            setMessage('');

            // Hide feedback after 6 seconds
            setTimeout(() => {
                setFeedback(null);
            }, 6000);
        }, 1200);
    };

    return (
        <section id="contact" className="contact-section section bg-alt">
            <div className="container contact-grid">
                <div className="contact-text">
                    <div className="badge">Let's Connect</div>
                    <h2 className="section-title">Get in Touch</h2>
                    <p className="section-subtitle">
                        I am currently looking for summer 2027 Software Engineering internships. Feel free to reach out if you'd like to talk about computer vision, mathematics, or golf simulation!
                    </p>
                    
                    <div className="contact-details-list">
                        <div className="detail-item">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h4>Email</h4>
                                <a href="mailto:damiank0428@gmail.com">damiank0428@gmail.com</a>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                            </div>
                            <div>
                                <h4>Phone</h4>
                                <a href="tel:507-884-1666">507-884-1666</a>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                            </div>
                            <div>
                                <h4>GitHub</h4>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer">github.com/damiankim</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-container">
                    <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="form-name">Name</label>
                            <input 
                                type="text" 
                                id="form-name" 
                                required 
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="form-email">Email Address</label>
                            <input 
                                type="email" 
                                id="form-email" 
                                required 
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="form-message">Message</label>
                            <textarea 
                                id="form-message" 
                                rows={5} 
                                required 
                                placeholder="Hi Damian, I saw your golf simulator and would love to chat..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            id="btn-submit-message" 
                            className="btn btn-primary btn-block"
                            disabled={sending}
                        >
                            {sending ? 'Sending Message...' : 'Send Message'}
                        </button>
                        
                        {feedback && (
                            <div className={`form-feedback ${feedback.success ? 'success' : 'error'}`}>
                                {feedback.text}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
