import { getPageContent } from '@/lib/db'
import AboutClient from './AboutClient'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  let content: Record<string, string> = {}
  try {
    const rows = await getPageContent('about')
    for (const row of rows) {
      content[row.key] = row.value
    }
  } catch {}

  return <AboutClient content={content} />
}
