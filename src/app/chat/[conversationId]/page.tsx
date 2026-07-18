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
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 h-screen">

      {/* Sidebar */}

      <div className="col-span-4 border-r">

        <ChatSidebar
          currentUserId={user._id}
        />

      </div>

      {/* Chat Window */}

      <div className="col-span-8">

        <ChatWindow
          conversationId={conversationId}
          currentUserId={user._id}
        />

      </div>

    </div>
  );
}