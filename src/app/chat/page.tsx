"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { getCurrentUser } from "@/services/auth.service";

interface User {
  _id: string;
  name: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="flex h-dvh items-center justify-center bg-[#0f1115] text-sm text-white/70">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#0f1115]">
      <div className="hidden w-[360px] shrink-0 border-r border-white/5 bg-[#151821] md:block">
        <ChatSidebar currentUserId={user._id} />
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-white/45"
            >
              <path
                d="M7 8h10M7 12h6M21 12c0 4.97-4.03 9-9 9a8.96 8.96 0 0 1-4.5-1.2L3 21l1.2-4.5A8.96 8.96 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-lg font-semibold text-white">
            Select a conversation
          </h1>
          <p className="mt-2 text-sm leading-6 text-white/40">
            Choose a chat from the sidebar to start messaging.
          </p>
        </div>
      </div>
    </div>
  );
}