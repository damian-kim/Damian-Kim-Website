import { useState, type FormEvent } from 'react';

const EMAIL = 'damiank0428@gmail.com';

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const subject = String(data.get('subject') ?? '').trim();
    const replyTo = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const honeypot = String(data.get('_honey') ?? '').trim();

    if (honeypot) return;

    setStatus('sending');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: replyTo,
          _subject: subject,
          message,
          _template: 'table',
        }),
      });

      if (!response.ok) throw new Error('Message delivery failed');

      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="monolith-contact" id="monolith-contact" aria-labelledby="contact-title">
      <div className="monolith-contact-orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="monolith-contact-layout">
        <div className="monolith-contact-copy">
          <span>CONTACT</span>
          <h2 id="contact-title">Let&apos;s make something work.</h2>
          <p>Have a project, research question, or engineering problem worth unpacking? Send the details and I&apos;ll get back to you.</p>
          <address className="monolith-contact-list">
            <a href={`mailto:${EMAIL}`}><span>Email</span><strong>{EMAIL}</strong></a>
            <a href="tel:5078841666"><span>Phone</span><strong>507-884-1666</strong></a>
            <a href="https://www.linkedin.com/in/damian-kim-56287a202" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>Damian Kim</strong></a>
            <div><span>Based in</span><strong>Durham, North Carolina</strong></div>
          </address>
        </div>

        <form className="monolith-contact-form" onSubmit={sendEmail} aria-describedby="contact-form-note">
          <div className="monolith-form-heading"><span>NEW MESSAGE</span><small>All fields required</small></div>
          <label className="monolith-form-honey" aria-hidden="true">
            <span>Leave this blank</span>
            <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
          </label>
          <label>
            <span>Your email</span>
            <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Subject</span>
            <input type="text" name="subject" placeholder="What would you like to discuss?" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={7} placeholder="A little context goes a long way..." required />
          </label>
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending...' : 'Send message'} <span aria-hidden="true">-&gt;</span>
          </button>
          <p id="contact-form-note" className={`monolith-form-status monolith-form-status--${status}`} aria-live="polite">
            {status === 'sent' && 'Message sent. Thanks — I’ll be in touch.'}
            {status === 'error' && 'Something went wrong. Please try again or email me directly.'}
            {(status === 'idle' || status === 'sending') && 'Your message is sent directly from this form.'}
          </p>
        </form>
      </div>

      <footer>
        <a className="monolith-mark" href="#monolith-top" aria-label="Damian Kim, back to top">DK<span>Damian Kim</span></a>
        <a href="/galaxy.html">Box galaxy experiment <span aria-hidden="true">-&gt;</span></a>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  );
}
