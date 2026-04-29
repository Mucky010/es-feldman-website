'use client'

import Footer from '@/components/Footer'

const PHOTO = '/uploads/photo-1777403165975.png'

interface AboutClientProps {
  content: Record<string, string>
}

export default function AboutClient({ content }: AboutClientProps) {
  const intro = content.about_intro || "Making health information accessible to everyone — from Amsterdam trauma centres to Los Angeles startups."
  const body = content.about_body || "Esther Feldman is an organizational psychologist and health researcher based in Los Angeles. Her work spans national mental health policy, oncology research, and health technology — connecting rigorous academic research with real-world impact."
  const education = content.about_education || 'M.Sc. Work & Organizational Psychology\nVrije Universiteit Amsterdam\n\nB.Sc. Psychology\nErasmus University Rotterdam'
  const location = content.about_location || 'Los Angeles, California'
  const languages = content.about_languages || 'Dutch · English · Russian · French · Spanish · Catalan'
  const focus = content.about_focus || 'Mental health policy · Oncology research · Health technology'

  return (
    <div>
      <div className="about-grid">
        <div className="about-left">
          <div className="about-photo-wrap">
            <img className="about-photo" src={PHOTO} alt="Esther Feldman" />
          </div>
        </div>
        <div className="about-right">
          <p className="about-intro">&ldquo;{intro}&rdquo;</p>
          <p className="about-body">{body}</p>
          <div className="about-meta">
            <div className="about-meta-row">
              <span className="about-meta-label">Education</span>
              <span className="about-meta-val" style={{ whiteSpace: 'pre-line' }}>{education}</span>
            </div>
            <div className="about-meta-row">
              <span className="about-meta-label">Based in</span>
              <span className="about-meta-val">{location}</span>
            </div>
            <div className="about-meta-row">
              <span className="about-meta-label">Languages</span>
              <span className="about-meta-val">{languages}</span>
            </div>
            <div className="about-meta-row">
              <span className="about-meta-label">Focus</span>
              <span className="about-meta-val">{focus}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
