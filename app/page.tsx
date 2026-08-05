'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Formspree endpoint — replace YOUR_FORM_ID with the ID from your Formspree dashboard.
// https://formspree.io/forms — free tier is plenty for a portfolio contact form.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required autoComplete="name" />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      <p className={`form-status ${status === 'sent' ? 'success' : ''}`} role="status">
        {status === 'sent' && 'Message sent — thanks, I\u2019ll get back to you soon.'}
        {status === 'error' && 'Something went wrong. Try emailing me directly instead.'}
      </p>
    </form>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ paddingTop: '64px' }}>

      <section className={`hero ${loaded ? 'loaded' : ''}`} id="top">
        <div className="hero-media">
          {/*
            Drop a black & white photo of vintage computer gear at
            /public/images/hero-vintage-tech.jpg — an old terminal, a
            circuit board, a rack of drives. It's rendered in grayscale
            regardless, so a color photo works fine too.
          */}
          <Image
            src="/images/hero-vintage-tech.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-inner">
          <div className="label">Cybersecurity · SOC Analyst</div>
          <h1>Brian <span className="accent-word">Gaines</span></h1>
          <p className="hero-desc">
            Threat detection is my job. Breaking my own network is my hobby. The overlap is useful.
          </p>
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-inner reveal">
          <div className="label">About</div>
          <h2>Background</h2>
          <div className="about-grid">
            <div className="about-bio">
              <p>I served as a Navy Mass Communications Specialist before pursuing graduate research on the ethical and philosophical implications of digital surveillance. That path — military communications, then academic inquiry — now feeds into SOC analysis: translating dense technical material into incident reports and briefings a blue team can move on quickly.</p>
              <p>I currently build and sometimes break security infrastructure in a homelab that runs the gamut from digital to physical security.</p>
              <p>Current focus: SOC operations, SIEM architecture, threat detection, and the intersection of AI tooling with defensive security.</p>
              {/* Drop your resume PDF at /public/resume.pdf — opens in a new tab so it can be previewed before downloading */}
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="bio-resume-link">
                View / download résumé (PDF)
              </a>
            </div>
            <div className="facts-strip">
              <div className="fact-tile wide">
                <span className="fact-label">Focus</span>
                <span className="fact-value">SOC / Threat Detection</span>
              </div>
              <div className="fact-tile">
                <span className="fact-label">Scripting</span>
                <span className="fact-value">Python (in progress)</span>
              </div>
              <div className="fact-tile">
                <span className="fact-label">Learning</span>
                <span className="fact-value">SIEM administration</span>
              </div>
              <div className="fact-tile">
                <span className="fact-label">Lab</span>
                <span className="fact-value">Homelab — digital &amp; physical security</span>
              </div>
              <div className="fact-tile">
                <span className="fact-label">Certs</span>
                <span className="fact-value">CompTIA Security+ (in progress)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-inner reveal">
          <div className="label">Work</div>
          <h2>Selected Projects</h2>
          <p className="section-lede">A mix of physical, web, and AI-assisted security work — mostly built and broken in my own homelab.</p>
          <div className="bento">
            <a href="#" className="bento-tile featured">
              <span className="bento-tag">AI + Security</span>
              <span className="bento-title">AI-Powered Log Analyzer</span>
              <p className="bento-desc">Connecting homelab SIEM data to AI tooling for automated threat pattern detection across Wazuh alerts.</p>
              <div className="bento-tech">
                <span className="bento-chip">Python</span>
                <span className="bento-chip">Wazuh</span>
                <span className="bento-chip">Claude API</span>
              </div>
              <span className="bento-arrow">View project →</span>
            </a>
            <a href="#" className="bento-tile wide">
              <span className="bento-tag">Physical Security</span>
              <span className="bento-title">RFID Badge Cloning Assessment</span>
              <p className="bento-desc">Evaluated access control vulnerabilities using Flipper Zero against 13.56MHz NFC systems.</p>
              <span className="bento-arrow">View project →</span>
            </a>
            <a href="#" className="bento-tile">
              <span className="bento-tag">Web Security</span>
              <span className="bento-title">OWASP Juice Shop</span>
              <p className="bento-desc">Injection, broken auth, and XSS assessment.</p>
              <span className="bento-arrow">View →</span>
            </a>
            <a href="https://github.com/briangaines" className="bento-tile cta">
              <span className="bento-tag">More</span>
              <span className="bento-title">See everything on GitHub</span>
              <span className="bento-arrow">github.com/briangaines →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="writing">
        <div className="section-inner reveal">
          <div className="label">Writing</div>
          <h2>Notes</h2>
          <div className="post-list">
            <a href="#" className="post-row">
              <div className="post-main">
                <span className="post-title">Surveillance Aesthetics as Career Path</span>
                <span className="post-desc">How a PhD dissertation on surveillance became a cybersecurity career. Academic theory meets applied praxis.</span>
              </div>
              <span className="post-meta">Apr 20, 2026 · 8 min</span>
              <span className="post-arrow">Read →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="contact" style={{ borderBottom: 'none' }}>
        <div className="section-inner reveal">
          <div className="label">Contact</div>
          <h2>Get in Touch</h2>
          <div className="contact-layout">
            <div className="contact-links">
              <a href="mailto:brian@briangaines.io" className="contact-link">
                <span className="fact-label">Email</span>
                <span className="fact-value">brian@briangaines.io</span>
              </a>
              <a href="https://github.com/briangaines" className="contact-link">
                <span className="fact-label">GitHub</span>
                <span className="fact-value">github.com/briangaines</span>
              </a>
              <a href="https://linkedin.com/in/briangaines" className="contact-link">
                <span className="fact-label">LinkedIn</span>
                <span className="fact-value">linkedin.com/in/briangaines</span>
              </a>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-left">
            <span>© 2026 Brian Gaines</span>
            <span>Last updated April 2026</span>
          </div>
          <div className="footer-right">
            <a href="#">RSS Feed</a>
          </div>
        </div>
      </footer>

    </main>
  );
}
