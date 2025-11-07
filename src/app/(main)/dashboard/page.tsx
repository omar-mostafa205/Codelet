import DashboardPageClient from '@/components/dashboard/DashboardPageClient'
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic'
const DashboardPage = () => {
  
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardPageClient />
      </Suspense>
    </div>
  )
}

export default DashboardPage