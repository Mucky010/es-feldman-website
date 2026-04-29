import { isAuthenticated } from '@/lib/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

async function checkAuth() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function GET() {
  const err = await checkAuth()
  if (err) return err

  const { rows } = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const err = await checkAuth()
  if (err) return err

  const { title, slug, content, excerpt, image_url, published } = await request.json()
  const { rows } = await sql`
    INSERT INTO blog_posts (title, slug, content, excerpt, image_url, published, published_at)
    VALUES (${title}, ${slug}, ${content}, ${excerpt || null}, ${image_url || null}, ${published || false},
      CASE WHEN ${published} THEN NOW() ELSE NULL END)
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const err = await checkAuth()
  if (err) return err

  const { id, title, slug, content, excerpt, image_url, published } = await request.json()
  const { rows } = await sql`
    UPDATE blog_posts
    SET title = ${title}, slug = ${slug}, content = ${content}, excerpt = ${excerpt || null},
        image_url = ${image_url || null}, published = ${published || false},
        published_at = CASE WHEN ${published} AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const err = await checkAuth()
  if (err) return err

  const { id } = await request.json()
  await sql`DELETE FROM blog_posts WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
