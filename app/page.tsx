'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  // Navbar scroll + G drop
  useEffect(() => {
    let isScrolled = false;

    function animateIn() {
      const full = document.getElementById('logoFull');
      const short = document.getElementById('logoShort');
      const g = document.getElementById('logoG');
      const spacer = document.getElementById('logoSpacer');
      if (!full || !short || !g || !spacer) return;
      spacer.style.transition = 'width 500ms cubic-bezier(0.4,0,0.2,1)';
      spacer.style.width = '28px';
      full.style.transition = 'opacity 500ms ease, letter-spacing 500ms ease';
      full.style.opacity = '0';
      full.style.letterSpacing = '0.06em';
      short.style.transition = 'opacity 400ms ease';
      setTimeout(() => { short.style.opacity = '1'; }, 150);
      g.style.transform = 'translateY(0)';
      g.style.transition = 'none';
      setTimeout(() => {
        g.style.transition = 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)';
        g.style.transform = 'translateY(4px)';
      }, 550);
    }

    function animateOut() {
      const full = document.getElementById('logoFull');
      const short = document.getElementById('logoShort');
      const g = document.getElementById('logoG');
      const spacer = document.getElementById('logoSpacer');
      if (!full || !short || !g || !spacer) return;
      g.style.transition = 'transform 150ms ease';
      g.style.transform = 'translateY(0)';
      setTimeout(() => {
        spacer.style.transition = 'width 500ms cubic-bezier(0.4,0,0.2,1)';
        spacer.style.width = '120px';
        full.style.transition = 'opacity 500ms ease, letter-spacing 500ms ease';
        full.style.opacity = '1';
        full.style.letterSpacing = '0.02em';
        short.style.transition = 'opacity 300ms ease';
        short.style.opacity = '0';
      }, 120);
    }

    const onScroll = () => {
      const nowScrolled = window.scrollY > 20;
      if (navRef.current) navRef.current.classList.toggle('scrolled', nowScrolled);
      if (nowScrolled === isScrolled) return;
      isScrolled = nowScrolled;
      if (isScrolled) animateIn();
      else animateOut();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Nav active section
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

  // Scroll reveal
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

  // Binary hero animation
  useEffect(() => {
    let raf: number;
    const touts: ReturnType<typeof setTimeout>[] = [];

    function easeOut(t: number){ return 1-Math.pow(1-t,3); }
    function easeInOut(t: number){ return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
    function lerp(a: number,b: number,t: number){ return a+(b-a)*t; }
    function clamp(v: number,lo: number,hi: number){ return Math.max(lo,Math.min(hi,v)); }

    function run() {
      const canvas = document.getElementById('heroCanvas') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const W = canvas.width  = window.innerWidth;
      const H = canvas.height = window.innerHeight;

      const isDark = document.documentElement.classList.contains('dark');
      const fgColor = isDark ? '#FAF8F3' : '#1A1A1A';

      touts.push(setTimeout(() => document.getElementById('heroLabel')?.classList.add('show'), 400));

      const nameEl = document.getElementById('heroName');
      if (!nameEl) return;
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
      const targets: {tx:number,ty:number}[] = [];
      for (let y = rect.top - 4; y < rect.bottom + 4; y += step) {
        for (let x = rect.left - 4; x < rect.right + 4; x += step) {
          const idx = (Math.floor(y) * W + Math.floor(x)) * 4;
          if (imgData.data[idx + 3] > 60) targets.push({ tx: x, ty: y });
        }
      }

      const particles = targets.map(t => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * Math.max(W, H) * 0.7;
        return {
          sx: t.tx + Math.cos(angle) * dist,
          sy: t.ty + Math.sin(angle) * dist,
          tx: t.tx, ty: t.ty,
          char: Math.random() > 0.5 ? '1' : '0',
          delay: Math.random() * 0.35,
          driftPhase: Math.random() * Math.PI * 2,
          size: step * (0.6 + Math.random() * 0.25),
        };
      });

      const CONVERGE = 2200, HOLD = 300, CROSSFADE = 1400;
      let startTime: number|null = null;
      let phase = 'converge';
      let phaseStart: number|null = null;

      function draw(ts: number) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        ctx.clearRect(0, 0, W, H);

        if (phase === 'converge') {
          const p = clamp(elapsed / CONVERGE, 0, 1);
          particles.forEach(pt => {
            const lp = clamp((p - pt.delay) / (1 - pt.delay), 0, 1);
            const et = easeOut(lp);
            ctx.globalAlpha = clamp(lp * 2, 0, 0.9);
            ctx.fillStyle = fgColor;
            ctx.font = `400 ${pt.size}px 'Fira Code', monospace`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(pt.char, lerp(pt.sx, pt.tx, et), lerp(pt.sy, pt.ty, et));
          });
          ctx.globalAlpha = 1;
          if (p >= 1) { phase = 'hold'; phaseStart = ts; }

        } else if (phase === 'hold') {
          particles.forEach(pt => {
            ctx.globalAlpha = 0.9; ctx.fillStyle = fgColor;
            ctx.font = `400 ${pt.size}px 'Fira Code', monospace`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(pt.char, pt.tx, pt.ty);
          });
          ctx.globalAlpha = 1;
          if (ts - phaseStart! > HOLD) { phase = 'crossfade'; phaseStart = ts; }

        } else if (phase === 'crossfade') {
          const p = clamp((ts - phaseStart!) / CROSSFADE, 0, 1);
          const et = easeInOut(p);
          particles.forEach(pt => {
            const t = (ts - phaseStart!) / 1000;
            const dx = Math.sin(t * 1.5 + pt.driftPhase) * et * 1.5;
            const dy = Math.cos(t * 1.2 + pt.driftPhase) * et * 1;
            ctx.globalAlpha = (1 - et) * 0.9; ctx.fillStyle = fgColor;
            ctx.font = `400 ${pt.size}px 'Fira Code', monospace`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(pt.char, pt.tx + dx, pt.ty + dy);
          });
          ctx.globalAlpha = 1;
          nameEl.style.opacity = et.toString();

          if (p >= 1) {
            ctx.clearRect(0, 0, W, H);
            nameEl.style.opacity = '1';
            touts.push(setTimeout(() => {
              const gaines = document.getElementById('nameGaines');
              if (gaines) {
                gaines.style.transition = 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)';
                gaines.style.transform = 'translateY(4px)';
              }
              document.getElementById('heroDesc')?.classList.add('show');
            }, 150));
            return;
          }
        }
        raf = requestAnimationFrame(draw);
      }
      raf = requestAnimationFrame(draw);
    }

    document.fonts.ready.then(run);
    return () => { cancelAnimationFrame(raf); touts.forEach(clearTimeout); };
  }, []);

  const handleNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('hamburger')?.classList.remove('open');
    document.getElementById('mobileMenu')?.classList.remove('open');
  };

  const icon = mounted ? (theme === 'dark' ? '☀' : '☾') : '☀';
  const themeLabel = mounted ? (theme === 'dark' ? 'Dark Mode' : 'Light Mode') : 'Dark Mode';

  return (
    <>
      <style>{`
        nav { position:fixed; top:0; left:0; right:0; z-index:50; height:64px; display:flex; align-items:center; border-bottom:1px solid var(--line); background:var(--bg); }
        nav.scrolled { backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); }
        .nav-inner { max-width:960px; margin:0 auto; padding:0 24px; width:100%; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { font-weight:600; font-size:15px; color:var(--fg); letter-spacing:0.02em; cursor:pointer; display:flex; align-items:center; position:relative; height:24px; }
        .logo-spacer { display:inline-block; width:120px; height:24px; flex-shrink:0; }
        .logo-full { position:absolute; left:0; white-space:nowrap; letter-spacing:0.02em; opacity:1; }
        .logo-short { position:absolute; left:0; display:flex; align-items:baseline; opacity:0; }
        .logo-b { display:inline-block; }
        .logo-g { display:inline-block; transform:translateY(0); }
        .nav-links { display:flex; align-items:center; gap:2px; }
        .nav-link { font-size:14px; font-weight:400; color:var(--fg2); padding:6px 14px; border-radius:4px; cursor:pointer; background:none; border:none; transition:color 150ms,background 150ms; position:relative; font-family:inherit; }
        .nav-link:hover { color:var(--fg); background:var(--bg2); }
        .nav-link.active { color:var(--fg); background:var(--bg2); }
        .nav-link.active::after { content:''; position:absolute; bottom:4px; left:14px; right:14px; height:2px; background:var(--fg); border-radius:1px; }
        .theme-toggle { margin-left:8px; width:34px; height:34px; flex-shrink:0; border:1px solid var(--line2); border-radius:4px; background:transparent; color:var(--fg); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:16px; font-family:inherit; }
        .theme-toggle:hover { background:var(--bg2); }
        .hamburger { display:none; flex-direction:column; gap:5px; background:transparent; border:none; cursor:pointer; padding:6px; margin-left:8px; }
        .hamburger span { display:block; width:22px; height:2px; background:var(--fg); border-radius:2px; transition:transform 300ms ease, opacity 300ms ease; }
        .hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity:0; }
        .hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }
        .mobile-menu { display:none; position:fixed; top:64px; left:0; right:0; z-index:49; background:var(--bg); border-bottom:1px solid var(--line); flex-direction:column; padding:16px 24px 24px; gap:4px; }
        .mobile-menu.open { display:flex; }
        .mobile-menu a { font-size:16px; font-weight:400; color:var(--fg2); text-decoration:none; padding:12px 0; border-bottom:1px solid var(--line); }
        .mobile-menu a:last-of-type { border-bottom:none; }
        .mobile-menu a:hover { color:var(--fg); }
        .mobile-footer { display:flex; align-items:center; justify-content:space-between; padding-top:16px; margin-top:8px; }
        .mobile-footer .theme-indicator { font-size:11px; font-weight:500; color:var(--fg2); letter-spacing:0.08em; text-transform:uppercase; }
        @media(max-width:640px) { .nav-links { display:none; } .hamburger { display:flex; } }

        #heroCanvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }

        @keyframes gridDrift { from{transform:translateY(0)} to{transform:translateY(64px)} }
        .hero { position:relative; overflow:hidden; min-height:100vh; display:flex; align-items:center; border-bottom:1px solid var(--line); padding-top:64px; }
        .hero-grid { position:absolute; inset:-64px -10%; width:120%; height:calc(100% + 128px); background-image:linear-gradient(to bottom,var(--grid) 1px,transparent 1px),linear-gradient(to right,var(--grid) 1px,transparent 1px); background-size:56px 56px; animation:gridDrift 7s linear infinite; pointer-events:none; z-index:0; }
        .hero-grid::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 75% 85% at 38% 50%,transparent 15%,var(--bg) 72%); }
        .hero-content { position:relative; z-index:2; max-width:960px; margin:0 auto; padding:0 24px; width:100%; }
        .hero-label { font-size:12px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--fg2); margin-bottom:28px; opacity:0; transition:opacity 600ms ease; }
        .hero-label.show { opacity:1; }
        .hero-name { font-size:clamp(3.5rem,9vw,6.5rem); font-weight:700; line-height:1.0; letter-spacing:-0.03em; margin-bottom:32px; opacity:0; white-space:nowrap; }
        .name-gaines { display:inline-block; transform:translateY(0); }
        .hero-desc { font-size:17px; font-weight:300; color:var(--fg2); max-width:500px; line-height:1.75; opacity:0; transform:translateY(16px); transition:opacity 600ms ease, transform 600ms ease; }
        .hero-desc.show { opacity:1; transform:translateY(0); }

        .section { padding:80px 24px; border-bottom:1px solid var(--line); max-width:960px; margin:0 auto; position:relative; overflow:hidden; }
        .section-bg-num { position:absolute; top:-10px; left:16px; font-size:180px; font-weight:700; line-height:1; color:var(--num); pointer-events:none; user-select:none; letter-spacing:-0.05em; z-index:0; opacity:0; transform:translateY(12px); transition:opacity 900ms ease, transform 900ms ease; }
        .section-bg-num.visible { opacity:1; transform:translateY(0); }
        .section-inner { position:relative; z-index:1; }
        .section-number { font-size:11px; font-weight:500; color:var(--fg2); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:8px; }
        .section h2 { font-size:clamp(1.75rem,4vw,2.5rem); font-weight:700; letter-spacing:-0.02em; margin-bottom:36px; line-height:1.1; }
        .reveal { opacity:0; transform:translateY(24px); transition:opacity 600ms ease, transform 600ms ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }

        .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:start; }
        @media(max-width:640px){.about-grid{grid-template-columns:1fr;gap:32px}}
        .about-bio p { font-size:16px; font-weight:300; line-height:1.85; color:var(--fg2); margin-bottom:20px; }
        .about-bio p:last-child { margin-bottom:0; }
        .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:4px; overflow:hidden; }
        .skill-cell { background:var(--bg); padding:18px 16px; display:flex; flex-direction:column; gap:6px; }
        .skill-label { font-size:10px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--fg2); }
        .skill-value { font-size:14px; font-weight:500; color:var(--fg); }

        .project-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1px; background:var(--line); border:1px solid var(--line); border-radius:4px; overflow:hidden; }
        .project-card { background:var(--bg); padding:28px 24px; display:flex; flex-direction:column; gap:10px; text-decoration:none; color:inherit; transition:background 150ms ease; }
        .project-card:hover { background:var(--bg2); outline:1px solid var(--line2); }
        .project-card:hover .card-arrow { transform:translateX(8px); color:var(--fg); }
        .card-tag { font-size:10px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--fg2); }
        .card-title { font-size:16px; font-weight:600; letter-spacing:-0.01em; line-height:1.3; }
        .card-desc { font-size:13px; font-weight:300; color:var(--fg2); line-height:1.65; }
        .tech-tags { display:flex; flex-wrap:wrap; gap:6px; margin-top:4px; }
        .tech-tag { font-size:11px; font-weight:400; color:var(--fg2); border:1px solid var(--line); border-radius:3px; padding:2px 8px; }
        .card-arrow { font-size:13px; color:var(--fg2); margin-top:auto; padding-top:8px; transition:transform 250ms ease, color 250ms ease; }

        .contact-row { display:flex; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:4px; overflow:hidden; }
        .contact-item { flex:1; background:var(--bg); padding:24px; text-decoration:none; color:inherit; transition:background 150ms ease; }
        .contact-item:hover { background:var(--bg2); }
        .contact-label { font-size:10px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:var(--fg2); margin-bottom:6px; }
        .contact-value { font-size:14px; font-weight:500; }
        @media(max-width:480px){.contact-row{flex-direction:column}}

        .footer-inner { max-width:960px; margin:0 auto; padding:32px 24px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; border-top:1px solid var(--line); }
        .footer-left { display:flex; flex-direction:column; gap:4px; }
        .footer-left span { font-size:12px; font-weight:400; color:var(--fg2); }
        .footer-right { display:flex; align-items:center; gap:16px; }
        .footer-right a { font-size:12px; font-weight:400; color:var(--fg2); text-decoration:none; }
        .footer-right a:hover { color:var(--fg); }
        .theme-indicator { font-size:11px; font-weight:500; color:var(--fg2); letter-spacing:0.08em; text-transform:uppercase; }
        main { padding-top:64px; }
      `}</style>

      {/* NAV */}
      <nav ref={navRef}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-spacer" id="logoSpacer" />
            <span className="logo-full" id="logoFull">Brian Gaines</span>
            <span className="logo-short" id="logoShort">
              <span className="logo-b">B</span>
              <span className="logo-g" id="logoG">G</span>
            </span>
          </div>
          <div className="nav-links">
            {['about','portfolio','blog','contact'].map(s => (
              <button key={s} className="nav-link" data-section={s} onClick={() => handleNavClick(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {icon}
            </button>
          </div>
          <button className="hamburger" id="hamburger" onClick={() => {
            document.getElementById('hamburger')?.classList.toggle('open');
            document.getElementById('mobileMenu')?.classList.toggle('open');
          }}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className="mobile-menu" id="mobileMenu">
        {['about','portfolio','blog','contact'].map(s => (
          <a key={s} href={`#${s}`} onClick={() => handleNavClick(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
        <div className="mobile-footer">
          <span className="theme-indicator">{themeLabel}</span>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {icon}
          </button>
        </div>
      </div>

      {/* BINARY CANVAS */}
      <canvas id="heroCanvas" />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-content">
            <div className="hero-label" id="heroLabel">briangaines.io</div>
            <div className="hero-name" id="heroName">
              <span id="nameBrian">Brian </span>
              <span className="name-gaines" id="nameGaines">Gaines</span>
            </div>
            <p className="hero-desc" id="heroDesc">
              Threat detection is my job. Breaking my own network is my hobby. The overlap is useful.
            </p>
          </div>
        </section>

        {/* ABOUT */}
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
                  ['Focus','SOC / Threat Detection'],
                  ['SIEM','Splunk, Wazuh, ELK'],
                  ['Scripting','Python, Bash, PowerShell'],
                  ['Platforms','Linux, Windows Server'],
                  ['Labs','Proxmox, Homelab'],
                  ['Certs','CompTIA Sec+ (in progress)'],
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

        {/* PORTFOLIO */}
        <section className="section" id="portfolio">
          <div className="section-bg-num">02</div>
          <div className="section-inner reveal">
            <div className="section-number">02 / Portfolio</div>
            <h2>Projects</h2>
            <div className="project-grid">
              {[
                { tag:'Physical Security', title:'RFID Badge Cloning Assessment', desc:'Evaluated access control vulnerabilities using Flipper Zero against 13.56MHz NFC systems.', tech:['Flipper Zero','NFC','Access Control'] },
                { tag:'Web Security', title:'OWASP Juice Shop Exploitation', desc:'Systematic vulnerability assessment covering injection, broken auth, and XSS attack vectors.', tech:['Burp Suite','OWASP','SQLi'] },
                { tag:'AI + Security', title:'AI-Powered Log Analyzer', desc:'Connecting homelab SIEM data to AI tooling for automated threat pattern detection.', tech:['Python','Wazuh','Claude API'] },
              ].map(p => (
                <a key={p.title} href="#" className="project-card">
                  <span className="card-tag">{p.tag}</span>
                  <span className="card-title">{p.title}</span>
                  <span className="card-desc">{p.desc}</span>
                  <div className="tech-tags">{p.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}</div>
                  <span className="card-arrow">View Project →</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG */}
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

        {/* CONTACT */}
        <section className="section" id="contact">
          <div className="section-bg-num">04</div>
          <div className="section-inner reveal">
            <div className="section-number">04 / Contact</div>
            <h2>Get in Touch</h2>
            <div className="contact-row">
              {[
                { label:'Email', value:'brian@briangaines.io', href:'mailto:brian@briangaines.io' },
                { label:'GitHub', value:'github.com/BrunyTunes', href:'https://github.com/BrunyTunes' },
                { label:'LinkedIn', value:'linkedin.com/in/briangaines', href:'https://linkedin.com' },
              ].map(c => (
                <a key={c.label} href={c.href} className="contact-item">
                  <div className="contact-label">{c.label}</div>
                  <div className="contact-value">{c.value}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="footer-inner">
            <div className="footer-left">
              <span>© 2026 Brian Gaines</span>
              <span>Last updated April 2026</span>
            </div>
            <div className="footer-right">
              <a href="#">RSS Feed</a>
              <span className="theme-indicator">{themeLabel}</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
