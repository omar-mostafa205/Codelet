import { SidebarProvider } from "@/components/ui/sidebar"
import { TutorialSideBar } from "@/components/tutorial/TutorialSideBar"
import React from "react"

const TutorialLayout = async ({
  children,
  params,
  searchParams,
}: {
  children: React.ReactNode
  params: Promise<{ tutorialId: string }> 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { tutorialId } = await params
  const resolvedSearchParams = await searchParams
  const repoId = resolvedSearchParams?.repoId as string | undefined

  return (
    <SidebarProvider className="w-full h-full">
      <div className="border-r border-gray-200">
        <TutorialSideBar tutorialId={tutorialId} repoId={repoId} />
      </div>
      <main className="w-full h-full overflow-hidden">
        <div className="bg-white p-4 h-full overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  )
}

export default TutorialLayout