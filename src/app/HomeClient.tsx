'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

interface HomeClientProps {
  content: Record<string, string>
}

const PHOTO = '/uploads/photo-1777403165975.png'

export default function HomeClient({ content }: HomeClientProps) {
  const router = useRouter()
  const photoRef = useRef<HTMLImageElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const heroTitle = content.hero_title || 'Esther Feldman'
  const heroEyebrow = content.hero_eyebrow || 'Researcher & Founder'
  const heroDesc = content.hero_description || 'Organizational psychologist, policy architect, and health-tech founder. Building AI tools that make health information accessible to everyone.'

  useEffect(() => {
    const onScroll = () => {
      if (!photoRef.current || !heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const progress = Math.max(0, -rect.top / rect.height)
      photoRef.current.style.transform = `translateY(${progress * 60}px) scale(${1 + progress * 0.03})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div>
      <section className="hero" ref={heroRef}>
        <div className="hero-left">
          <div className="hero-eyebrow">{heroEyebrow}</div>
          <h1 className="hero-name" dangerouslySetInnerHTML={{ __html: heroTitle }} />
          <p className="hero-desc">{heroDesc}</p>
          <div className="hero-tags">
            <span className="hero-tag" onClick={() => router.push('/work')}>Collabiora Co-Founder</span>
            <span className="hero-tag" onClick={() => router.push('/work')}>Policy Advisor · ARQ</span>
            <span className="hero-tag" onClick={() => router.push('/research')}>4 Publications</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-photo-wrap">
            <img ref={photoRef} className="hero-photo" src={PHOTO} alt="Esther Feldman" />
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
        </div>
      </section>

      <section className="stats-strip">
        {[
          { num: '6', label: 'Languages spoken' },
          { num: '4', label: 'Peer-reviewed publications' },
          { num: '200K+', label: 'Personnel reached by policy work' },
        ].map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  )
}
