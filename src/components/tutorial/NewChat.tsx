"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface ChatResponse {
  id: string;
}

const NewChat = ({ tutorialId }: { tutorialId: string }) => {
  const { user } = useUser();
  const router = useRouter();
  const pathName = usePathname();
  const repoId = useSearchParams().get("repoId") ?? "";

  const mutation = useMutation<ChatResponse>({
    mutationKey: ["create-chat", tutorialId],
    mutationFn: async () => {
      const response = await axios.post("/api/chat/new-chat", { tutorialId });
      return response.data;
    },
    onSuccess: (data) => {
      router.push(`/dashboard/tutorial/${tutorialId}/chat/${data.id}?repoId=${repoId}`);
    },
  });

  const handleCreateChat = () => {
    if (tutorialId && !mutation.isPending) {
      mutation.mutate();
    }
  };

  if (!user) return null;

  return (
    <div>
      <button
        onClick={handleCreateChat}
        disabled={mutation.isPending}
        className="w-full cursor-pointer flex items-center gap-2 rounded-lg px-3 py-2 transition-colors text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">Codelet AI</span>
      </button>
    </div>
  );
};

export default NewChat;