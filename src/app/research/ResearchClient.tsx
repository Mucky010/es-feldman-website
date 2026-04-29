'use client'

import { ResearchEntry } from '@/lib/db'
import Footer from '@/components/Footer'

export default function ResearchClient({ entries }: { entries: ResearchEntry[] }) {
  return (
    <div>
      <section className="section">
        <div className="section-header">
          <span className="section-num">02</span>
          <h2 className="section-title">Publications</h2>
        </div>
        <div className="research-list">
          {entries.map((r, i) => (
            <div className="research-item" key={i}>
              <div className="research-year">{r.year}</div>
              <div>
                <div className="research-title">{r.title}</div>
                <div className="research-authors">{r.authors}</div>
                <div className="research-journal">{r.journal}</div>
              </div>
              {r.doi && (
                <a
                  href={`https://doi.org/${r.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="research-doi"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  DOI:{r.doi}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}
