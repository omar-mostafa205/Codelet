/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// components/tutorial-sidebar-static.tsx
import React, { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { BookCopy, LayoutDashboard } from "lucide-react";
import { TutorialSidebarDynamic } from "./tutorial-sidebar-dynamic";
import { currentUser } from "@clerk/nextjs/server";
import NavUser from "./NavUser";
import NewChat from "./NewChat";
import axios from "axios";
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

export const TurorialSideBar = async ({tutorialId}) => {
  const user = await currentUser();

  console.log("THE URL PRAMAs", tutorialId);
  if (!user) {
    redirect("/sign-up");
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
  const newChat = await generateChatSession(tutorialId);
  return (
    <Sidebar className="border-none p-3 min-h-screen bg-[#fafafa] [&_*]:bg-transparent">
      <SidebarHeader>
        <Link href="/" className="flex flex-row gap-2 items-center mt-2">
          <Image
            src="/final.png"
            alt="Logo"
            width={30}                                        
            height={30}
            className="rounded-[10px]"
          />
          <h1 className="text-2xl font-semibold text-gray-900">Codelet</h1>
        </Link>
      </SidebarHeader>

      <SidebarContent>
  <SidebarGroup className="flex flex-col mt-2 ml-[-10px]">
    <Link
      href={`/tutorial/${tutorialId}`}
      className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors text-black hover:bg-gray-200"
    >
      <LayoutDashboard className="w-4 h-4" />
      <span className="text-sm font-medium">Dashboard</span>
    </Link>
    <NewChat tutorialId={tutorialId} />
  </SidebarGroup>
  <SidebarGroupLabel className="flex items-center gap-1.5 ml-[-2px] rounded-lg px-3 py-2 text-sm font-medium text-gray-700">
  <BookCopy className="w-4 h-4" />
  <span>Chapters</span>
</SidebarGroupLabel>
  <Suspense fallback={<div>Loading...</div>}>
    <TutorialSidebarDynamic />
  </Suspense>
</SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
};
async function generateChatSession(tutorialId: string) {
  try {
    const res = await axios.post("/api/chat/new-chat", { tutorialId });
    return res.data;  
  }   
  catch (error: any) {
    return null;
  }

}
