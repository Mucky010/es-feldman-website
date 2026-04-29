'use client'

import { WorkEntry } from '@/lib/db'
import Footer from '@/components/Footer'

export default function WorkClient({ entries }: { entries: WorkEntry[] }) {
  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-num">01</span>
          <h2 className="section-title">Selected Work</h2>
        </div>
        <div className="work-list">
          {entries.map((w, i) => (
            <div className="work-item" key={i}>
              <div className="work-year">{w.year}</div>
              <div>
                <div className="work-org">{w.org}</div>
                <div className="work-role">{w.role}</div>
                <p className="work-desc">{w.description}</p>
                {w.link && (
                  <a
                    href={`https://${w.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
                      fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'oklch(60% 0.07 248)', fontWeight: 500, textDecoration: 'none',
                      borderBottom: '1px solid oklch(60% 0.07 248 / 0.3)', paddingBottom: 2,
                    }}
                  >
                    {w.link} →
                  </a>
                )}
              </div>
              {w.stat && <div className="work-stat">{w.stat}</div>}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}
