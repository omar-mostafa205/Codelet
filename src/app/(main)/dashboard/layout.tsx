import DashboardNav from '@/components/dashboard/DashboardNav'
const DashboardLayout = async ({children } : {children: React.ReactNode ,
  params : Promise<{ tutorialId: string }>
}) => {
  return (
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <DashboardNav />
        <div className="flex-1 overflow-scroll">
          {children}
        </div>
      </div>
  )
}

export default DashboardLayout