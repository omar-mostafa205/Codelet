import DashboardPageClient from '@/components/dashboard/DashboardPageClient'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'

export const dynamic = 'force-dynamic'
const DashboardPage = async() => {
  const {userId} = await auth()
  if(!userId) redirect('/sign-in')
  return (
    <div>
      <Suspense fallback={""}>
        <DashboardPageClient />
      </Suspense>
    </div>
  )
}

export default DashboardPage