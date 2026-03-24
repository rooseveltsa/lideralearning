import { getCrmDashboardData } from '@/lib/actions/crm'

import CrmDashboardClient from './CrmDashboardClient'

export default async function CrmDashboardPage() {
  const { leads } = await getCrmDashboardData()

  return <CrmDashboardClient leads={leads} />
}
