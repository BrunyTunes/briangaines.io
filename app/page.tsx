'use client';

import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    const nav = document.querySelector('nav');
    const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('data-section') === e.target.id) a.classList.add('active');
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const nums = document.querySelectorAll('.section-bg-num');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    const numObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), 150); numObs.unobserve(e.target); } });
    }, { threshold: 0.05 });
    reveals.forEach(r => revealObs.observe(r));
    nums.forEach(n => numObs.observe(n));
    return () => { revealObs.disconnect(); numObs.disconnect(); };
  }, []);

  useEffect(() => {
    let raf: number;
    const touts: ReturnType<typeof setTimeout>[] = [];

    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
    function easeInOut(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
    function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

    function run() {
      const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const W = canvas.width = window.innerWidth;
      const H = canvas.height = window.innerHeight;
      const isDark = document.documentElement.classList.contains('dark');
      const fgColor = isDark ? '#FAF8F3' : '#1A1A1A';

      touts.push(setTimeout(() => {
        const label = document.querySelector('.section-label') as HTMLElement;
        if (label) { label.style.opacity = '1'; label.style.transform = 'translateY(0)'; }
      }, 400));

      const nameEl = document.getElementById('heroName') as HTMLElement;
      if (!nameEl) return;
      nameEl.style.opacity = '0';
      nameEl.style.transition = 'none';
      const gaines = document.getElementById('nameGaines') as HTMLElement;
      if (gaines) { gaines.style.transition = 'none'; gaines.style.transform = 'translateY(0)'; }

      requestAnimationFrame(() => {
        const rect = nameEl.getBoundingClientRect();
        const computedFs = parseFloat(window.getComputedStyle(nameEl).fontSize);
        const off = new OffscreenCanvas(W, H);
        const offCtx = off.getContext('2d')!;
        offCtx.font = `700 ${computedFs}px 'Outfit', sans-serif`;
        offCtx.fillStyle = '#fff';
        offCtx.textBaseline = 'top';
        offCtx.fillText('Brian Gaines', rect.left, rect.top);
        const imgData = offCtx.getImageData(0, 0, W, H);
        const step = 8;
        const targets: { tx: number; ty: number }[] = [];
        for (let y = rect.top - 4; y < rect.bottom + 4; y += step) {
          for (let x = rect.left - 4; x < rect.right + 4; x += step) {
            const idx = (Math.floor(y) * W + Math.floor(x)) * 4;
            if (imgData.data[idx + 3] > 60) targets.push({ tx: x, ty: y });
          }
        }
        const particles = targets.map(t => {
          const angle = Math.random() * Math.PI * 2;
          const dist = 200 + Math.random() * Math.max(W, H) * 0.7;
          return { sx: t.tx + Math.cos(angle) * dist, sy: t.ty + Math.sin(angle) * dist, tx: t.tx, ty: t.ty, char: Math.random() > 0.5 ? '1' : '0', delay: Math.random() * 0.35, driftPhase: Math.random() * Math.PI * 2, size: step * (0.55 + Math.random() * 0.3) };
        });
        const CONVERGE = 2200, HOLD = 300, CROSSFADE = 1200;
        let startTime: number | null = null;
        let phase = 'converge';
        let phaseStart: number | null = null;

        function draw(ts: number) {
          if (!startTime) startTime = ts;
          const elapsed = ts - startTime;
          ctx.clearRect(0, 0, W, H);
          if (phase === 'converge') {
            const progress = clamp(elapsed / CONVERGE, 0, 1);
            particles.forEach(p => {
              const lp = clamp((progress - p.delay) / (1 - p.delay), 0, 1);
              const et = easeOut(lp);
              ctx.globalAlpha = clamp(lp * 1.8, 0, 0.9);
              ctx.fillStyle = fgColor;
              ctx.font = `400 ${p.size}px 'Fira Code', monospace`;
              ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(p.char, lerp(p.sx, p.tx, et), lerp(p.sy, p.ty, et));
            });
            ctx.globalAlpha = 1;
            if (progress >= 1) { phase = 'hold'; phaseStart = ts; }
          } else if (phase === 'hold') {
            particles.forEach(p => {
              ctx.globalAlpha = 0.9; ctx.fillStyle = fgColor;
              ctx.font = `400 ${p.size}px 'Fira Code', monospace`;
              ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(p.char, p.tx, p.ty);
            });
            ctx.globalAlpha = 1;
            if (ts - phaseStart! > HOLD) { phase = 'crossfade'; phaseStart = ts; nameEl.style.transition = `opacity ${CROSSFADE}ms ease`; }
          } else if (phase === 'crossfade') {
            const progress = clamp((ts - phaseStart!) / CROSSFADE, 0, 1);
            const et = easeInOut(progress);
            particles.forEach(p => {
              const t = (ts - phaseStart!) / 1000;
              const dx = Math.sin(t * 1.5 + p.driftPhase) * et * 2;
              const dy = Math.cos(t * 1.2 + p.driftPhase) * et * 1.5;
              ctx.globalAlpha = (1 - et) * 0.9; ctx.fillStyle = fgColor;
              ctx.font = `400 ${p.size}px 'Fira Code', monospace`;
              ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
              ctx.fillText(p.char, p.tx + dx, p.ty + dy);
            });
            ctx.globalAlpha = 1;
            nameEl.style.opacity = et.toString();
            if (progress >= 1) {
              ctx.clearRect(0, 0, W, H);
              nameEl.style.opacity = '1';
              touts.push(setTimeout(() => {
                if (gaines) { gaines.style.transition = 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)'; gaines.style.transform = 'translateY(3px)'; }
                const desc = document.getElementById('heroDesc') as HTMLElement;
                if (desc) { desc.style.opacity = '1'; desc.style.transform = 'translateY(0)'; }
              }, 150));
              return;
            }
          }
          raf = requestAnimationFrame(draw);
        }
        raf = requestAnimationFrame(draw);
      });
    }

    document.fonts.ready.then(run);
    return () => { cancelAnimationFrame(raf); touts.forEach(clearTimeout); };
  }, []);

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main style={{ paddingTop: '64px' }}>

      <section className="hero">
        <canvas id="heroCanvas" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="section-label">briangaines.io</div>
          <h1 id="heroName" style={{ opacity: 0 }}>
            Brian <span id="nameGaines" style={{ display: 'inline-block' }}>Gaines</span>
          </h1>
          <p id="heroDesc" className="hero-desc" style={{ opacity: 0, transform: 'translateY(18px)', transition: 'opacity 600ms ease, transform 600ms ease' }}>
            Threat detection is my job. Breaking my own network is my hobby. The overlap is useful.
          </p>
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-bg-num">01</div>
        <div className="section-inner reveal">
          <div className="section-number">01 / About</div>
          <h2>Background</h2>
          <div className="about-grid">
            <div className="about-bio">
              <p>Started in academic rhetoric — PhD work on surveillance theory at Virginia Tech. When the higher education market collapsed, I took the theoretical toolkit somewhere it could do real work.</p>
              <p>Now building security infrastructure in a homelab I call The Sprawl. Studying for an AAS in Cybersecurity at Tri-County. Deploying the same critical frameworks I used to write about.</p>
              <p>Current focus: SOC operations, SIEM architecture, threat detection, and the intersection of AI tooling with defensive security.</p>
            </div>
            <div className="skills-grid">
              {[
                ['Focus', 'SOC / Threat Detection'],
                ['SIEM', 'Splunk, Wazuh, ELK'],
                ['Scripting', 'Python, Bash, PowerShell'],
                ['Platforms', 'Linux, Windows Server'],
                ['Labs', 'Proxmox, Homelab'],
                ['Certs', 'CompTIA Sec+ (in progress)'],
              ].map(([label, value]) => (
                <div key={label} className="skill-cell">
                  <span className="skill-label">{label}</span>
                  <span className="skill-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="portfolio">
        <div className="section-bg-num">02</div>
        <div className="section-inner reveal">
          <div className="section-number">02 / Portfolio</div>
          <h2>Projects</h2>
          <div className="project-grid">
            {[
              { tag: 'Physical Security', title: 'RFID Badge Cloning Assessment', desc: 'Evaluated access control vulnerabilities using Flipper Zero against 13.56MHz NFC systems.', tech: ['Flipper Zero', 'NFC', 'Access Control'] },
              { tag: 'Web Security', title: 'OWASP Juice Shop Exploitation', desc: 'Systematic vulnerability assessment covering injection, broken auth, and XSS attack vectors.', tech: ['Burp Suite', 'OWASP', 'SQLi'] },
              { tag: 'AI + Security', title: 'AI-Powered Log Analyzer', desc: 'Connecting homelab SIEM data to AI tooling for automated threat pattern detection.', tech: ['Python', 'Wazuh', 'Claude API'] },
            ].map(({ tag, title, desc, tech }) => (
              <a key={title} href="#" className="project-card">
                <span className="card-tag">{tag}</span>
                <span className="card-title">{title}</span>
                <span className="card-desc">{desc}</span>
                <div className="tech-tags">{tech.map(t => <span key={t} className="tech-tag">{t}</span>)}</div>
                <span className="card-arrow">View Project →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="blog">
        <div className="section-bg-num">03</div>
        <div className="section-inner reveal">
          <div className="section-number">03 / Blog</div>
          <h2>Writing</h2>
          <div className="project-grid">
            <a href="#" className="project-card">
              <span className="card-tag">Career · Theory · 2026-04-20</span>
              <span className="card-title">Surveillance Aesthetics as Career Path</span>
              <span className="card-desc">How a PhD dissertation on surveillance became a cybersecurity career. Academic theory meets applied praxis.</span>
              <div className="tech-tags">
                <span className="tech-tag">Career</span>
                <span className="tech-tag">Theory</span>
                <span className="tech-tag">8 min read</span>
              </div>
              <span className="card-arrow">Read Post →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="section-bg-num">04</div>
        <div className="section-inner reveal">
          <div className="section-number">04 / Contact</div>
          <h2>Get in Touch</h2>
          <div className="contact-row">
            <a href="mailto:brian@briangaines.io" className="contact-item">
              <div className="contact-label">Email</div>
              <div className="contact-value">brian@briangaines.io</div>
            </a>
            <a href="https://github.com/briangaines" className="contact-item">
              <div className="contact-label">GitHub</div>
              <div className="contact-value">github.com/briangaines</div>
            </a>
            <a href="https://linkedin.com/in/briangaines" className="contact-item">
              <div className="contact-label">LinkedIn</div>
              <div className="contact-value">linkedin.com/in/briangaines</div>
            </a>
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
            <span className="theme-indicator">Dark Mode</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
