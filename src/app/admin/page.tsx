'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'content' | 'work' | 'research' | 'blog'

interface PageContentItem {
  key: string
  value: string
  section: string
}

interface WorkEntry {
  id?: number
  year: string
  org: string
  role: string
  description: string
  stat: string
  link: string
  sort_order: number
}

interface ResearchEntry {
  id?: number
  year: string
  title: string
  authors: string
  journal: string
  doi: string
  sort_order: number
}

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  image_url: string | null
  published: boolean
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('content')
  const [checking, setChecking] = useState(true)

  // Page content
  const [pageContent, setPageContent] = useState<Record<string, string>>({})
  const [saveMsg, setSaveMsg] = useState('')

  // Work entries
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([])
  const [editingWork, setEditingWork] = useState<WorkEntry | null>(null)
  const [showWorkModal, setShowWorkModal] = useState(false)

  // Research entries
  const [researchEntries, setResearchEntries] = useState<ResearchEntry[]>([])
  const [editingResearch, setEditingResearch] = useState<ResearchEntry | null>(null)
  const [showResearchModal, setShowResearchModal] = useState(false)

  // Blog posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [pcRes, wRes, rRes, bRes] = await Promise.all([
        fetch('/api/admin/page-content'),
        fetch('/api/admin/work'),
        fetch('/api/admin/research'),
        fetch('/api/admin/blog'),
      ])

      if (pcRes.status === 401) { router.push('/admin/login'); return }

      const [pc, w, r, b] = await Promise.all([
        pcRes.json(), wRes.json(), rRes.json(), bRes.json(),
      ])

      const contentMap: Record<string, string> = {}
      for (const item of pc) contentMap[item.key] = item.value
      setPageContent(contentMap)
      setWorkEntries(w)
      setResearchEntries(r)
      setBlogPosts(b)
    } catch (e) {
      router.push('/admin/login')
    }
    setChecking(false)
  }, [router])

  useEffect(() => { fetchData() }, [fetchData])

  async function savePageContent() {
    const entries = [
      { key: 'hero_title', value: pageContent.hero_title || 'Esther<br /><em>Feldman</em>', section: 'hero' },
      { key: 'hero_eyebrow', value: pageContent.hero_eyebrow || 'Researcher & Founder', section: 'hero' },
      { key: 'hero_description', value: pageContent.hero_description || '', section: 'hero' },
      { key: 'about_intro', value: pageContent.about_intro || '', section: 'about' },
      { key: 'about_body', value: pageContent.about_body || '', section: 'about' },
      { key: 'about_education', value: pageContent.about_education || '', section: 'about' },
      { key: 'about_location', value: pageContent.about_location || '', section: 'about' },
      { key: 'about_languages', value: pageContent.about_languages || '', section: 'about' },
      { key: 'about_focus', value: pageContent.about_focus || '', section: 'about' },
    ]
    for (const entry of entries) {
      await fetch('/api/admin/page-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })
    }
    setSaveMsg('Saved!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  async function saveWorkEntry(e: React.FormEvent) {
    e.preventDefault()
    if (!editingWork) return
    const method = editingWork.id ? 'PUT' : 'POST'
    await fetch('/api/admin/work', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingWork),
    })
    setShowWorkModal(false)
    setEditingWork(null)
    fetchData()
  }

  async function deleteWorkEntry(id: number) {
    if (!confirm('Delete this entry?')) return
    await fetch('/api/admin/work', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  async function saveResearchEntry(e: React.FormEvent) {
    e.preventDefault()
    if (!editingResearch) return
    const method = editingResearch.id ? 'PUT' : 'POST'
    await fetch('/api/admin/research', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingResearch),
    })
    setShowResearchModal(false)
    setEditingResearch(null)
    fetchData()
  }

  async function deleteResearchEntry(id: number) {
    if (!confirm('Delete this entry?')) return
    await fetch('/api/admin/research', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  async function saveBlogPost(e: React.FormEvent) {
    e.preventDefault()
    if (!editingPost) return
    const method = editingPost.id ? 'PUT' : 'POST'
    await fetch('/api/admin/blog', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPost),
    })
    setShowBlogModal(false)
    setEditingPost(null)
    fetchData()
  }

  async function deleteBlogPost(id: number) {
    if (!confirm('Delete this post?')) return
    await fetch('/api/admin/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingPost) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const { url } = await res.json()
    setEditingPost({ ...editingPost, image_url: url })
    setUploading(false)
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (checking) return <div style={{ padding: '100px 48px', textAlign: 'center', opacity: 0.5 }}>Loading...</div>

  const setContent = (key: string, value: string) => {
    setPageContent(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <button className="admin-logout" onClick={logout}>Logout</button>

      <div className="admin-tabs">
        {(['content', 'work', 'research', 'blog'] as Tab[]).map(t => (
          <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'content' ? 'Page Content' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* PAGE CONTENT TAB */}
      {tab === 'content' && (
        <div className="admin-section">
          <h3 style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 24, fontWeight: 500 }}>Hero Section</h3>
          <div className="admin-field">
            <label>Hero Eyebrow</label>
            <input value={pageContent.hero_eyebrow || ''} onChange={e => setContent('hero_eyebrow', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Hero Title (HTML: use &lt;br&gt; and &lt;em&gt;)</label>
            <input value={pageContent.hero_title || ''} onChange={e => setContent('hero_title', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Hero Description</label>
            <textarea value={pageContent.hero_description || ''} onChange={e => setContent('hero_description', e.target.value)} />
          </div>

          <h3 style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 24, marginTop: 48, fontWeight: 500 }}>About Section</h3>
          <div className="admin-field">
            <label>About Intro (quote)</label>
            <textarea value={pageContent.about_intro || ''} onChange={e => setContent('about_intro', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>About Body</label>
            <textarea value={pageContent.about_body || ''} onChange={e => setContent('about_body', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Education</label>
            <textarea value={pageContent.about_education || ''} onChange={e => setContent('about_education', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Location</label>
            <input value={pageContent.about_location || ''} onChange={e => setContent('about_location', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Languages</label>
            <input value={pageContent.about_languages || ''} onChange={e => setContent('about_languages', e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Focus</label>
            <input value={pageContent.about_focus || ''} onChange={e => setContent('about_focus', e.target.value)} />
          </div>

          <button className="admin-save-btn" onClick={savePageContent}>Save Page Content</button>
          {saveMsg && <div className="admin-success">{saveMsg}</div>}
        </div>
      )}

      {/* WORK TAB */}
      {tab === 'work' && (
        <div className="admin-section">
          <button className="admin-new-btn" onClick={() => {
            setEditingWork({ year: '', org: '', role: '', description: '', stat: '', link: '', sort_order: workEntries.length })
            setShowWorkModal(true)
          }}>+ New Work Entry</button>
          <div className="admin-blog-list">
            {workEntries.map(w => (
              <div key={w.id} className="admin-blog-item">
                <div>
                  <div className="admin-blog-title">{w.org} — {w.role}</div>
                  <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>{w.year}</div>
                </div>
                <div className="admin-blog-actions">
                  <button onClick={() => { setEditingWork({ ...w }); setShowWorkModal(true) }}>Edit</button>
                  <button className="danger" onClick={() => w.id && deleteWorkEntry(w.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESEARCH TAB */}
      {tab === 'research' && (
        <div className="admin-section">
          <button className="admin-new-btn" onClick={() => {
            setEditingResearch({ year: '', title: '', authors: '', journal: '', doi: '', sort_order: researchEntries.length })
            setShowResearchModal(true)
          }}>+ New Publication</button>
          <div className="admin-blog-list">
            {researchEntries.map(r => (
              <div key={r.id} className="admin-blog-item">
                <div>
                  <div className="admin-blog-title">{r.title}</div>
                  <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>{r.authors} · {r.journal}</div>
                </div>
                <div className="admin-blog-actions">
                  <button onClick={() => { setEditingResearch({ ...r }); setShowResearchModal(true) }}>Edit</button>
                  <button className="danger" onClick={() => r.id && deleteResearchEntry(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOG TAB */}
      {tab === 'blog' && (
        <div className="admin-section">
          <button className="admin-new-btn" onClick={() => {
            setEditingPost({ id: 0, title: '', slug: '', content: '', excerpt: '', image_url: null, published: false, created_at: '' })
            setShowBlogModal(true)
          }}>+ New Blog Post</button>
          <div className="admin-blog-list">
            {blogPosts.map(p => (
              <div key={p.id} className="admin-blog-item">
                <div>
                  <div className="admin-blog-title">{p.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <span className={`admin-blog-status ${p.published ? 'published' : 'draft'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                    <span style={{ fontSize: 11, opacity: 0.4 }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="admin-blog-actions">
                  <button onClick={() => { setEditingPost({ ...p }); setShowBlogModal(true) }}>Edit</button>
                  <button className="danger" onClick={() => deleteBlogPost(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORK MODAL */}
      {showWorkModal && editingWork && (
        <div className="admin-modal-overlay" onClick={() => setShowWorkModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingWork.id ? 'Edit' : 'New'} Work Entry</h2>
            <form onSubmit={saveWorkEntry}>
              <div className="admin-field">
                <label>Year</label>
                <input value={editingWork.year} onChange={e => setEditingWork({ ...editingWork, year: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Organization</label>
                <input value={editingWork.org} onChange={e => setEditingWork({ ...editingWork, org: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Role</label>
                <input value={editingWork.role} onChange={e => setEditingWork({ ...editingWork, role: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <textarea value={editingWork.description} onChange={e => setEditingWork({ ...editingWork, description: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Stat</label>
                <input value={editingWork.stat} onChange={e => setEditingWork({ ...editingWork, stat: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Link (domain only, e.g. collabiora.com)</label>
                <input value={editingWork.link} onChange={e => setEditingWork({ ...editingWork, link: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <button type="submit" className="primary">Save</button>
                <button type="button" className="secondary" onClick={() => setShowWorkModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESEARCH MODAL */}
      {showResearchModal && editingResearch && (
        <div className="admin-modal-overlay" onClick={() => setShowResearchModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingResearch.id ? 'Edit' : 'New'} Publication</h2>
            <form onSubmit={saveResearchEntry}>
              <div className="admin-field">
                <label>Year</label>
                <input value={editingResearch.year} onChange={e => setEditingResearch({ ...editingResearch, year: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Title</label>
                <input value={editingResearch.title} onChange={e => setEditingResearch({ ...editingResearch, title: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Authors</label>
                <input value={editingResearch.authors} onChange={e => setEditingResearch({ ...editingResearch, authors: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Journal</label>
                <input value={editingResearch.journal} onChange={e => setEditingResearch({ ...editingResearch, journal: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>DOI</label>
                <input value={editingResearch.doi} onChange={e => setEditingResearch({ ...editingResearch, doi: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <button type="submit" className="primary">Save</button>
                <button type="button" className="secondary" onClick={() => setShowResearchModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG MODAL */}
      {showBlogModal && editingPost && (
        <div className="admin-modal-overlay" onClick={() => setShowBlogModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editingPost.id ? 'Edit' : 'New'} Blog Post</h2>
            <form onSubmit={saveBlogPost}>
              <div className="admin-field">
                <label>Title</label>
                <input value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} required />
              </div>
              <div className="admin-field">
                <label>Slug</label>
                <input value={editingPost.slug} onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })} required />
              </div>
              <div className="admin-field">
                <label>Excerpt</label>
                <textarea value={editingPost.excerpt} onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })} />
              </div>
              <div className="admin-field">
                <label>Content (HTML)</label>
                <textarea value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} style={{ minHeight: 200 }} />
              </div>
              <div className="admin-field">
                <label>Header Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {uploading && <span style={{ fontSize: 12, opacity: 0.5 }}>Uploading...</span>}
                {editingPost.image_url && (
                  <div style={{ marginTop: 8 }}>
                    <img src={editingPost.image_url} alt="" style={{ maxWidth: 200, borderRadius: 4 }} />
                  </div>
                )}
              </div>
              <div className="admin-field">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={editingPost.published}
                    onChange={e => setEditingPost({ ...editingPost, published: e.target.checked })}
                    style={{ width: 'auto' }}
                  />
                  Published
                </label>
              </div>
              <div className="admin-modal-actions">
                <button type="submit" className="primary">Save</button>
                <button type="button" className="secondary" onClick={() => setShowBlogModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
