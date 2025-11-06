import React, { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { BookCopy, LayoutDashboard, ChevronDown } from "lucide-react";
import { TutorialSidebarDynamic } from "./tutorial-sidebar-dynamic";
import { currentUser } from "@clerk/nextjs/server";
import NavUser from "./NavUser";
import NewChat from "./NewChat";
import { redirect } from "next/navigation";


interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  hasImage: boolean;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
}

export const TutorialSideBar = async ({tutorialId , repoId} :{tutorialId: string}) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userData: User = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    hasImage: user.hasImage,
    emailAddresses: user.emailAddresses.map(email => ({
      emailAddress: email.emailAddress
    }))
  };
  return (
    <Sidebar className="border-none p-3 h-[95vh] mt-10 ">
      <SidebarHeader>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="flex flex-col mt-2 gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={`/dashboard/tutorial/${tutorialId}?repoId=${repoId}`} className="flex items-center gap-2 hover:!bg-gray-200 rounded-md !p-2">
                <LayoutDashboard className="w-4 h-4 " />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <NewChat tutorialId={tutorialId} />
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2 hover:!bg-gray-200 ">
                  <BookCopy className="w-4 h-4" />
                  <span className="text-sm font-medium">Chapters</span>
                  <ChevronDown className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-0 group-data-[state=closed]/collapsible:-rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <SidebarMenuSub>
                  <Suspense fallback={<div className="text-xs text-gray-500 px-3 py-2">Loading...</div>}>
                    <TutorialSidebarDynamic />
                  </Suspense>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
};
