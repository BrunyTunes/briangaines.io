'use client';

import { useState } from 'react';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav>
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => scrollTo('top')} aria-label="Back to top">
            Brian Gaines
          </button>

          <div className="nav-links">
            {LINKS.map(l => (
              <button key={l.id} className="nav-link" onClick={() => scrollTo(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <button className={`hamburger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {LINKS.map(l => (
          <a key={l.id} onClick={() => scrollTo(l.id)}>{l.label}</a>
        ))}
      </div>
    </>
  );
}
