import { ChapterPageClient } from "./ChapterPageClient";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface ChapterPageProps {
  params: Promise<{ chapterId: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterId  } = await params;
  
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return <ChapterPageClient chapterId={chapterId} userId={user.id} />;
}