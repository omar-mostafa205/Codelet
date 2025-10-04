import { SidebarProvider } from "@/components/ui/sidebar"
import  {TurorialSideBar}  from "@/components/TutorialSideBar"
import React from 'react'

const TutorialLayout = async ({children , params} : {children: React.ReactNode ,
  params : Promise<{ tutorialId: string }>
}) => {
  const { tutorialId } = await params;
  return (
    <SidebarProvider className="bg-[#fafafa] h-screen overflow-hidden">
      <TurorialSideBar tutorialId={tutorialId} />
      <main className="w-full p-1 h-full overflow-hidden">
        <div className="border border-gray-200 bg-[#ffffff] rounded-md p-4 h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default TutorialLayout