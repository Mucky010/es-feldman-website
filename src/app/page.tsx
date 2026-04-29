import { getPageContent } from '@/lib/db'
import HomeClient from './HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let content: Record<string, string> = {}
  try {
    const rows = await getPageContent('hero')
    for (const row of rows) {
      content[row.key] = row.value
    }
  } catch {}

  return <HomeClient content={content} />
}
