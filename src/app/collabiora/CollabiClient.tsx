'use client'

import Footer from '@/components/Footer'

export default function CollabiClient() {
  return (
    <div>
      <div className="collabiora-hero">
        <div className="collabiora-left">
          <div className="collabiora-eyebrow">Co-Founder · 2025–Present</div>
          <h2 className="collabiora-name">Collabiora</h2>
          <p className="collabiora-desc">
            A health navigation platform helping patients and researchers find, understand, and act on health information. Built on the belief that access to clear health guidance shouldn't depend on who you know or what language you speak.
          </p>
          <a href="https://collabiora.com" target="_blank" rel="noopener noreferrer" className="collabiora-link">
            Visit collabiora.com →
          </a>
        </div>
        <div className="collabiora-right">
          <img className="collabiora-logo-img" src="/uploads/Collabiora Logo.PNG" alt="Collabiora" />
        </div>
      </div>

      <div className="collabiora-stats">
        {[
          { num: '2025', label: 'Founded' },
          { num: 'LA →', label: 'Based in Los Angeles' },
          { num: '6', label: 'Languages accessible' },
        ].map(s => (
          <div className="collabiora-stat" key={s.label}>
            <div className="collabiora-stat-num">{s.num}</div>
            <div className="collabiora-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <span className="section-num">—</span>
          <h2 className="section-title">Mission</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
          <p style={{ fontSize: 15, lineHeight: 1.85, opacity: 0.72 }}>
            Health information is fragmented, jargon-heavy, and often inaccessible to the people who need it most. Collabiora bridges that gap — combining Esther's background in organizational psychology and health research with AI to build tools that speak plainly and work for everyone.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {['Patient-centred navigation', 'Multilingual by design', 'Grounded in clinical research'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, letterSpacing: '0.08em', opacity: 0.7 }}>
                <div style={{ width: 28, height: 1, background: 'oklch(60% 0.07 248)', flexShrink: 0 }}></div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
