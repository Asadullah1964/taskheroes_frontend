"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Conversation } from "@/types/conversation";
import { getMyConversations } from "@/services/conversation.service";
import { useSocket } from "@/context/SocketProvider";

interface Props {
  currentUserId: string;
}

export default function ChatSidebar({ currentUserId }: Props) {
  const router = useRouter();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("conversation-updated", () => {
      loadConversations();
    });

    return () => {
      socket.off("online-users");
      socket.off("conversation-updated");
    };
  }, [socket]);

  const loadConversations = async () => {
    try {
      const res = await getMyConversations();
      setConversations(res.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-gray-500">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">

      {conversations.map((conversation) => {

        const otherUser =
          conversation.client._id === currentUserId
            ? conversation.worker
            : conversation.client;

        const online = onlineUsers.includes(otherUser._id);

        return (
          <button
            key={conversation._id}
            onClick={() =>
              router.push(`/chat/${conversation._id}`)
            }
            className="w-full flex items-center gap-4 p-4 border-b hover:bg-gray-100 transition"
          >
            <div className="relative">

              <img
                src={
                  otherUser.profileImage ||
                  "/default-avatar.png"
                }
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />

              {online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
              )}
            </div>

            <div className="flex-1 text-left">

              <h3 className="font-semibold">
                {otherUser.name}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage || "Start chatting"}
              </p>

            </div>

            <div className="text-xs text-gray-400">

              {new Date(
                conversation.lastMessageAt
              ).toLocaleDateString()}

            </div>

          </button>
        );
      })}
    </div>
  );
}