import TutorialDashboard from '@/components/dashboard/TutorialDashboard'
import React, { Suspense } from 'react'

const PastTutorialsPage = () => {
  return (
    <div >
      <Suspense fallback={<Sekelton />}>
      <TutorialDashboard />
      </Suspense>
    </div>
  )
}
function Sekelton () { 
  return <div className="min-h-screen bg-white p-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-semibold mb-8">Past Tutorials</h1>
    <div className="grid grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-6 min-h-[320px] animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
}

export default PastTutorialsPage