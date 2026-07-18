"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { getCurrentUser } from "@/services/auth.service";

interface User {
  _id: string;
  name: string;
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;

  const [user, setUser] = useState<User | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    <div className="relative flex h-dvh w-full overflow-hidden bg-[#0f1115]">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm transform border-r border-white/5 bg-[#151821] transition-transform duration-300 md:static md:z-auto md:block md:w-[360px] md:max-w-none md:translate-x-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <ChatSidebar
          currentUserId={user._id}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </div>

      <div className="min-w-0 flex-1">
        <ChatWindow
          conversationId={conversationId}
          currentUserId={user._id}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />
      </div>
    </div>
  );
}