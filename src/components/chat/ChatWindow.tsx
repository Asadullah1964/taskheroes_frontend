"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketProvider";
import { getMessages, sendMessage, markAsSeen } from "@/services/message.service";
import { Message } from "@/types/message";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  otherUser?: { name: string; profileImage?: string };
  isOnline?: boolean;
  onOpenSidebar?: () => void;
}

export default function ChatWindow({
  conversationId,
  currentUserId,
  otherUser,
  isOnline,
  onOpenSidebar,
}: ChatWindowProps) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);

  const loadMessages = async () => {
    try {
      const res = await getMessages(conversationId);
      setMessages(res.messages);
      await markAsSeen(conversationId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-conversation", conversationId);

    socket.on("receive-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("typing", () => setTyping(true));
    socket.on("stop-typing", () => setTyping(false));
    socket.on("messages-seen", () => {
      setMessages((prev) => prev.map((msg) => ({ ...msg, seen: true })));
    });

    return () => {
      socket.emit("leave-conversation", conversationId);
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("messages-seen");
    };
  }, [socket, conversationId]);

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage(conversationId, text);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTyping = () => {
    socket?.emit("typing", { conversationId, sender: currentUserId });
  };

  const handleStopTyping = () => {
    socket?.emit("stop-typing", { conversationId });
  };

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#F7F7F5]">
      <div className="flex shrink-0 items-center gap-3 border-b border-black/[0.06] bg-white px-4 py-3 md:px-6">
        <button
          onClick={onOpenSidebar}
          className="inline-flex rounded-full p-2 transition hover:bg-black/5 md:hidden"
          aria-label="Open conversations"
        >
          <svg
            className="h-5 w-5 text-[#151821]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="relative shrink-0">
          <img
            src={otherUser?.profileImage || "/default-avatar.png"}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-1 ring-black/5"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          )}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-[#151821]">
            {otherUser?.name || "Conversation"}
          </h2>
          <p className="text-xs text-black/40">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-black/40">Loading messages…</span>
          </div>
        ) : (
          <MessageList messages={messages} currentUserId={currentUserId} />
        )}
      </div>

      <TypingIndicator visible={typing} />

      <ChatInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </div>
  );
}