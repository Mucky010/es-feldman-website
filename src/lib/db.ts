import { sql } from '@vercel/postgres'

export { sql }

export interface PageContentRow {
  key: string
  value: string
  section: string
  updated_at?: string
}

export interface WorkEntry {
  id?: number
  year: string
  org: string
  role: string
  description: string
  stat: string | null
  link: string | null
  sort_order: number
}

export interface ResearchEntry {
  id?: number
  year: string
  title: string
  authors: string
  journal: string
  doi: string | null
  sort_order: number
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export async function getPageContent(section?: string): Promise<PageContentRow[]> {
  if (section) {
    const { rows } = await sql`SELECT key, value FROM page_content WHERE section = ${section} ORDER BY key`
    return rows as PageContentRow[]
  }
  const { rows } = await sql`SELECT key, value, section FROM page_content ORDER BY section, key`
  return rows as PageContentRow[]
}

export async function getWorkEntries(): Promise<WorkEntry[]> {
  const { rows } = await sql`SELECT * FROM work_entries ORDER BY sort_order`
  return rows as WorkEntry[]
}

export async function getResearchEntries(): Promise<ResearchEntry[]> {
  const { rows } = await sql`SELECT * FROM research_entries ORDER BY sort_order`
  return rows as ResearchEntry[]
}

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  if (publishedOnly) {
    const { rows } = await sql`SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC`
    return rows as BlogPost[]
  }
  const { rows } = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`
  return rows as BlogPost[]
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { rows } = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND published = true`
  return (rows[0] as BlogPost) || null
}
