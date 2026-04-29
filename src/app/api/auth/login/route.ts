import { getSession, sessionOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const { password } = await request.json()

  const storedHash = process.env.ADMIN_PASSWORD_HASH
  if (!storedHash) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const valid = await bcrypt.compare(password, storedHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const session = await getSession()
  session.isLoggedIn = true
  await session.save()

  return NextResponse.json({ success: true })
}
