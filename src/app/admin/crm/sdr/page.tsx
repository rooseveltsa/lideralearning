import { getProspects } from '@/lib/actions/crm'

import SdrClient from './SdrClient'

export default async function SdrWorkspacePage() {
  const prospects = await getProspects()

  return <SdrClient initialProspects={prospects} />
}
