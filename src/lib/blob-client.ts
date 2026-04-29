import { put } from '@vercel/blob'

export async function uploadImage(file: File): Promise<string> {
  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  })
  return blob.url
}

export async function uploadImageFromBuffer(filename: string, buffer: Buffer, contentType: string): Promise<string> {
  const blob = await put(filename, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: true,
  })
  return blob.url
}
