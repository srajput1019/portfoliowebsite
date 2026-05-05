import React, { useEffect } from 'react';
import HeroBlob from './HeroBlob';

// Word-by-word stagger animation for the hero statement
function HeroTitle({ children }) {
  const words = String(children).trim().split(/\s+/);
  return (
    <h1 className="hero-title" aria-label={String(children)}>
      {words.map((word, i) => (
        <span key={i} className="word-wrap">
          <span className="word-inner" style={{ animationDelay: `${0.22 + i * 0.036}s` }}>
            {word}
          </span>
          {' '}
        </span>
      ))}
    </h1>
  );
}

// Button with slide-up text swap on hover
function WitButton({ href, className = 'button-primary', defaultText, hoverText }) {
  return (
    <a href={href} className={`btn-wit ${className}`}>
      <span className="btn-label btn-label--default">{defaultText}</span>
      <span className="btn-label btn-label--hover" aria-hidden="true">{hoverText}</span>
    </a>
  );
}

const skills = [
  'User Experience',
  'AI Governance',
  'Systems Thinking',
  'Human-in-the-loop',
  'Physical Product',
  'Strategic Clarity',
  'Complexity Made Usable',
  'Service Design',
  'Procurement Design',
  'Interaction Design',
];

const receipts = [
  { val: '50–70%', label: 'Procurement cycle reduction', proj: 'Qlarc' },
  { val: '>70%',     label: 'Evidence reuse rate',         proj: 'Qlarc' },
  { val: '5+',       label: 'Data categories consolidated', proj: 'Swaatya' },
  { val: '3',        label: 'Rounds of stakeholder iteration', proj: 'Swaatya' },
  { val: '4',        label: 'Leadership tiers mapped',      proj: 'LTI' },
];

export default function App() {
  // Scroll-triggered reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="nav container">
          <div className="nav-logo">SR</div>
          <div className="nav-links">
            <a href="#work"    className="nav-link">Work</a>
            <a href="#about"   className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        </nav>
      </header>

      <main>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow hero-kicker">
              Product Designer &middot; AI Strategist &middot; Systems Thinker
            </div>
            <HeroTitle>
              Every decision I make is designed to radiate through the user, the system, and the strategy that connects them.
            </HeroTitle>
            <p className="hero-subtitle hero-subtitle--animate">
              I design human-centered AI product experiences and strategic systems that make complexity usable.
            </p>
            <div className="hero-actions hero-actions--animate">
              <WitButton
                href="#work"
                defaultText="View my work"
                hoverText="Yes, let’s go →"
              />
              <WitButton
                href="#about"
                className="button-secondary"
                defaultText="Read the unofficial version"
                hoverText="The honest version →"
              />
            </div>
          </div>

          <div className="hero-visual">
            <HeroBlob className="hero-blob-canvas" />
            <div className="orbital-selector-row">
              <button className="orbital-selector-btn active">User</button>
              <button className="orbital-selector-btn">System</button>
              <button className="orbital-selector-btn">Strategy</button>
            </div>
          </div>
        </section>

        {/* ── FEATURED WORK ────────────────────────────────────── */}
        <section id="work" className="section container">
          <div className="section-header reveal">
            <h2 className="display-title">Featured Work</h2>
            <p className="section-subtitle">
              Four projects across AI, systems, strategy, and physical product design.
            </p>
          </div>

          {/* Qlarc — full-width hero card */}
          <article className="project-card-hero reveal">
            <div className="project-card-body">
              <div className="project-numbering">01</div>
              <div className="project-meta">
                <span className="chip chip-accent">Strategy / AI Governance</span>
              </div>
              <h3 className="project-title">Qlarc</h3>
              <p className="project-summary">
                An AI procurement toolkit for turning governance chaos into buyer-ready clarity.
              </p>
              <a href="#" className="button-primary" style={{ width: 'fit-content', marginTop: 'var(--space-4)' }}>
                View Case Study &rarr;
              </a>
            </div>
            <div className="project-card-hero-visual">
              <div className="hero-orbital">
                <div className="hero-orbital-core"></div>
                <div className="hero-orbital-node"></div>
                <div className="hero-orbital-node"></div>
                <div className="hero-orbital-node"></div>
                <div className="hero-orbital-node"></div>
              </div>
            </div>
            <div className="project-hover-reveal">
              <p className="serif-quote">Governance evidence, but make it less terrifying.</p>
            </div>
          </article>

          {/* 02 – 04 — three-column grid */}
          <div className="work-grid-secondary">
            {[
              {
                num: '02',
                title: 'Swaatya',
                cat: 'AI Systems / Human-in-the-loop',
                summary: 'A human-in-the-loop AI experience for making assisted decisions visible, measurable, and overrideable.',
                wit: 'Human override, because blind trust is not a feature.',
              },
              {
                num: '03',
                title: 'Mura',
                cat: 'Physical Product',
                summary: 'A sunlight-heated thermal pillow designed for comfort without electronics.',
                wit: 'Warmth that lingers.',
              },
              {
                num: '04',
                title: 'LTI',
                cat: 'Systems Strategy',
                summary: 'A framework for mapping power, visibility, and representation gaps in leadership.',
                wit: 'Because “we support equity” needed a receipt.',
              },
            ].map((p, i) => (
              <article key={p.num} className={`project-card reveal reveal-delay-${i + 1}`}>
                <div className="project-card-body">
                  <div className="project-numbering">{p.num}</div>
                  <div className="project-meta">
                    <span className="chip">{p.cat}</span>
                  </div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-summary">{p.summary}</p>
                  <a href="#" className="project-cta">View Case Study &rarr;</a>
                </div>
                <div className="project-hover-reveal">
                  <p className="serif-quote">{p.wit}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── MARQUEE — replaces work-split ────────────────────── */}
        <div className="marquee-section" aria-hidden="true">
          <div className="marquee-track">
            {[...skills, ...skills].map((s, i) => (
              <div key={i} className="marquee-item">
                {s}
                <span className="marquee-dot" />
              </div>
            ))}
          </div>
        </div>

        {/* ── RECEIPTS ─────────────────────────────────────────── */}
        <section className="section container">
          <div className="receipts-header reveal">
            <span className="eyebrow">The Receipts</span>
            <h2 className="display-title">
              Proof, because vibes<br />are not a KPI.
            </h2>
          </div>
          <div className="receipts-grid">
            {receipts.map((r, i) => (
              <div key={i} className={`receipt-item reveal reveal-delay-${i + 1}`}>
                <span className="receipt-value">{r.val}</span>
                <span className="receipt-label">{r.label}</span>
                <span className="receipt-project">{r.proj}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT TEASER ─────────────────────────────────────── */}
        <section id="about" className="section container">
          <div className="about-teaser-grid">
            <div className="case-label reveal">
              <span className="eyebrow" style={{ color: 'var(--color-lavender)' }}>
                The unofficial version
              </span>
            </div>

            <div className="case-content stack-lg reveal reveal-delay-1">
              <h2 className="display-title">
                Still in beta.<br />Shipping anyway.
              </h2>
              <p className="body-lg">
                Wrong turns, sharp instincts, and the parts of me that don&apos;t fit in a case study.
              </p>
              <WitButton
                href="#about"
                className="button-accent"
                defaultText="Get to know me →"
                hoverText="I’m an open book (mostly) →"
              />
            </div>

            <div className="about-phone-wrap reveal reveal-delay-2">
              <div className="phone-device">
                <div className="phone-screen">
                  <div className="phone-status-bar">
                    <span>9:41</span>
                    <span>&#xB7;&#xB7;&#xB7;</span>
                  </div>
                  <div className="phone-app-header">
                    <div className="phone-app-name">Uinc</div>
                    <div className="phone-app-tagline">Unified Intelligence</div>
                  </div>
                  <div className="phone-app-card">
                    <div className="phone-card-label">Active Now</div>
                    <div className="phone-card-title">Team Sync</div>
                    <div className="phone-card-sub">3 contributors &middot; 12m ago</div>
                  </div>
                  <div className="phone-app-card">
                    <div className="phone-card-label">Insights</div>
                    <div className="phone-card-title">Q2 Velocity Report</div>
                    <div className="phone-card-sub">Generated &middot; Ready to review</div>
                  </div>
                  <div className="phone-app-card phone-card-highlight">
                    <div className="phone-card-label">Suggested</div>
                    <div className="phone-card-title">Review open threads</div>
                    <div className="phone-card-sub">4 items need attention</div>
                  </div>
                </div>
                <div className="phone-nav-bar">
                  <div className="phone-nav-dot active"></div>
                  <div className="phone-nav-dot"></div>
                  <div className="phone-nav-dot"></div>
                  <div className="phone-nav-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-inner reveal">
            <div>
              <h2 className="footer-title">Let&apos;s build systems people can trust.</h2>
              <p className="footer-note serif-quote">
                Preferably before the system starts explaining itself badly.
              </p>
            </div>
            <div style={{ paddingBottom: 'var(--space-5)' }}>
              <WitButton
                href="mailto:contact@example.com"
                defaultText="Let’s connect →"
                hoverText="Looking forward to it →"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
