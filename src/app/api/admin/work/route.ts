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

  const { rows } = await sql`SELECT * FROM work_entries ORDER BY sort_order`
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const err = await checkAuth()
  if (err) return err

  const { year, org, role, description, stat, link, sort_order } = await request.json()
  const { rows } = await sql`
    INSERT INTO work_entries (year, org, role, description, stat, link, sort_order)
    VALUES (${year}, ${org}, ${role}, ${description}, ${stat || null}, ${link || null}, ${sort_order || 0})
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const err = await checkAuth()
  if (err) return err

  const { id, year, org, role, description, stat, link, sort_order } = await request.json()
  const { rows } = await sql`
    UPDATE work_entries
    SET year = ${year}, org = ${org}, role = ${role}, description = ${description},
        stat = ${stat || null}, link = ${link || null}, sort_order = ${sort_order || 0}
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const err = await checkAuth()
  if (err) return err

  const { id } = await request.json()
  await sql`DELETE FROM work_entries WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
