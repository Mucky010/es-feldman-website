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

  const { rows } = await sql`SELECT key, value, section, updated_at FROM page_content ORDER BY section, key`
  return NextResponse.json(rows)
}

export async function PUT(request: Request) {
  const err = await checkAuth()
  if (err) return err

  const { key, value, section } = await request.json()
  await sql`
    INSERT INTO page_content (key, value, section, updated_at)
    VALUES (${key}, ${value}, ${section}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, section = ${section}, updated_at = NOW()
  `
  return NextResponse.json({ success: true })
}
