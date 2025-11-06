import DashboardPageClient from '@/components/dashboard/DashboardPageClient'
import React, { Suspense } from 'react'

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