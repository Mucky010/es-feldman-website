import { getResearchEntries, ResearchEntry } from '@/lib/db'
import ResearchClient from './ResearchClient'

export const dynamic = 'force-dynamic'

const DEFAULT_RESEARCH: ResearchEntry[] = [
  { year: '2024', title: 'Using a modified Delphi procedure to select a PRO-CTCAE-based subset for patient-reported symptomatic toxicity monitoring in rectal cancer patients', authors: 'Geurts, Y.M., Peters, F., Feldman, E., et al.', journal: 'Quality of Life Research', doi: '10.1007/s11136-024-03767-0', sort_order: 0 },
  { year: '2023', title: 'Selecting a PRO-CTCAE-based subset for patient-reported symptom monitoring in prostate cancer patients: A modified Delphi procedure', authors: 'Feldman, E., Pos, F.J., Smeenk, R.J., et al.', journal: 'ESMO Open', doi: '10.1016/j.esmoop.2022.100775', sort_order: 1 },
  { year: '2021', title: 'SYMPRO-Lung: Study protocol for a stepped-wedge randomised controlled trial', authors: 'Feldman, E., et al.', journal: 'BMJ Open', doi: '10.1136/bmjopen-2021-052494', sort_order: 2 },
  { year: '2020', title: 'SYMPRO-Lung: Symptom monitoring with patient-reported outcomes among lung cancer patients in the Netherlands', authors: 'Feldman, E., et al.', journal: 'Annals of Oncology', doi: '10.1016/j.annonc.2020.08.1436', sort_order: 3 },
]

export default async function ResearchPage() {
  let entries: ResearchEntry[] = DEFAULT_RESEARCH
  try {
    const rows = await getResearchEntries()
    if (rows.length > 0) entries = rows
  } catch {}

  return <ResearchClient entries={entries} />
}
