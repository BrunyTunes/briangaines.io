'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let isScrolled = false;

    function animateIn() {
      const full = document.getElementById('logoFull');
      const bg = document.getElementById('logoBG');
      const g = document.getElementById('logoG');
      const spacer = document.getElementById('logoSpacer');
      if (!full || !bg || !g || !spacer) return;
      spacer.style.transition = 'width 500ms cubic-bezier(0.4,0,0.2,1)';
      spacer.style.width = '28px';
      full.style.transition = 'opacity 500ms ease, letter-spacing 500ms ease';
      full.style.opacity = '0';
      full.style.letterSpacing = '0.06em';
      bg.style.transition = 'opacity 400ms ease';
      setTimeout(() => { bg.style.opacity = '1'; }, 150);
      g.style.transition = 'none';
      g.style.transform = 'translateY(0)';
      setTimeout(() => {
        g.style.transition = 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)';
        g.style.transform = 'translateY(3px)';
      }, 550);
    }

    function animateOut() {
      const full = document.getElementById('logoFull');
      const bg = document.getElementById('logoBG');
      const g = document.getElementById('logoG');
      const spacer = document.getElementById('logoSpacer');
      if (!full || !bg || !g || !spacer) return;
      g.style.transition = 'transform 150ms ease';
      g.style.transform = 'translateY(0)';
      setTimeout(() => {
        spacer.style.transition = 'width 500ms cubic-bezier(0.4,0,0.2,1)';
        spacer.style.width = '120px';
        full.style.transition = 'opacity 500ms ease, letter-spacing 500ms ease';
        full.style.opacity = '1';
        full.style.letterSpacing = '0.02em';
        bg.style.transition = 'opacity 300ms ease';
        bg.style.opacity = '0';
      }, 120);
    }

    const onScroll = () => {
      const nav = navRef.current;
      const nowScrolled = window.scrollY > 20;
      if (nav) nav.classList.toggle('scrolled', nowScrolled);
      if (nowScrolled === isScrolled) return;
      isScrolled = nowScrolled;
      if (isScrolled) animateIn();
      else animateOut();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('hamburger')?.classList.remove('open');
    document.getElementById('mobileMenu')?.classList.remove('open');
  };

  return (
    <>
      <nav ref={navRef}>
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div id="logoSpacer" className="logo-spacer" />
            <span id="logoFull" className="logo-full">Brian Gaines</span>
            <span id="logoBG" className="logo-bg" style={{ opacity: 0 }}>B<span id="logoG" style={{ display: 'inline-block' }}>G</span></span>
          </div>
          <div className="nav-links">
            {['about', 'portfolio', 'blog', 'contact'].map((id) => (
              <button key={id} className="nav-link" data-section={id} onClick={() => handleNavClick(id)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
            <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              {mounted ? (theme === 'dark' ? '☀' : '☾') : '☀'}
            </button>
          </div>
          <button className="hamburger" id="hamburger" onClick={() => { document.getElementById('hamburger')?.classList.toggle('open'); document.getElementById('mobileMenu')?.classList.toggle('open'); }} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className="mobile-menu" id="mobileMenu">
        {['about', 'portfolio', 'blog', 'contact'].map((id) => (
          <a key={id} href={'#' + id} onClick={() => handleNavClick(id)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
        <div className="mobile-footer">
          <span className="theme-indicator">{mounted ? (theme === 'dark' ? 'Dark Mode' : 'Light Mode') : 'Dark Mode'}</span>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {mounted ? (theme === 'dark' ? '☀' : '☾') : '☀'}
          </button>
        </div>
      </div>
    </>
  );
}