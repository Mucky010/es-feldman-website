import { isAuthenticated } from '@/lib/auth'
import { uploadImageFromBuffer } from '@/lib/blob-client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const url = await uploadImageFromBuffer(file.name, buffer, file.type)
  return NextResponse.json({ url })
}
