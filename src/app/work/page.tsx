import { getWorkEntries, WorkEntry } from '@/lib/db'
import WorkClient from './WorkClient'

export const dynamic = 'force-dynamic'

const DEFAULT_WORK: WorkEntry[] = [
  { year: '2025–', org: 'Collabiora', role: 'Co-Founder', description: 'Co-founded health navigation platform Collabiora, helping patients and researchers navigate health information.', stat: 'Health Tech', link: 'collabiora.com', sort_order: 0 },
  { year: '2023–', org: 'ARQ National Psychotrauma Centre', role: 'Policy Advisor & Researcher', description: 'Lead policy architect for Dutch national mental health initiatives. Developed national psychosocial support guidelines for 200,000+ uniformed personnel. Secured €200,000 grant from the Dutch Ministry of Justice (2024).', stat: 'National Policy', link: null, sort_order: 1 },
  { year: '2021–22', org: 'Radboudumc', role: 'Scientific Researcher, Oncology', description: 'Pioneered Patient-Reported Outcomes research methodology across 13 Dutch hospitals. Conducted 100+ in-depth interviews; results published in leading scientific journals.', stat: '13 Hospitals', link: null, sort_order: 2 },
  { year: '2019–21', org: 'Netherlands Cancer Institute', role: 'Junior Researcher', description: 'Built and launched SYMPRO-Lung, an e-health web app for lung cancer patient symptom tracking. Designed PRO frameworks for prostate and rectal cancer clinical trials.', stat: 'e-Health', link: null, sort_order: 3 },
]

export default async function WorkPage() {
  let entries: WorkEntry[] = DEFAULT_WORK
  try {
    const rows = await getWorkEntries()
    if (rows.length > 0) entries = rows
  } catch {}

  return <WorkClient entries={entries} />
}
