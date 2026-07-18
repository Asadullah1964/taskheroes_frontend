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
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 h-screen">

      <div className="col-span-4 border-r">

        <ChatSidebar currentUserId={user._id} />

      </div>

      <div className="col-span-8 flex items-center justify-center text-gray-500">

        Select a conversation

      </div>

    </div>
  );
}