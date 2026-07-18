"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Conversation } from "@/types/conversation";
import { getMyConversations } from "@/services/conversation.service";
import { useSocket } from "@/context/SocketProvider";

interface Props {
  currentUserId: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function ChatSidebar({
  currentUserId,
  onCloseMobile,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const activeId = params?.id as string | undefined;
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("online-users", (users: string[]) => setOnlineUsers(users));
    socket.on("conversation-updated", () => loadConversations());

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

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    return conversations.filter((c) => {
      const other = c.client._id === currentUserId ? c.worker : c.client;
      return other.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [conversations, query, currentUserId]);

  const formatTime = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    return isToday
      ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleDateString([], { day: "2-digit", month: "short" });
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#151821]">
      <div className="shrink-0 border-b border-white/5 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Messages
            </h1>
            <p className="mt-1 text-xs text-white/35">Your conversations</p>
          </div>

          <button
            onClick={onCloseMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/80 transition hover:bg-white/10 md:hidden"
            aria-label="Close conversations"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-xl bg-white/[0.06] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none ring-1 ring-transparent transition focus:ring-[#2F9C8B]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">
        {loading ? (
          <SidebarSkeleton />
        ) : filtered.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-white/40">
              {query ? "No matches found." : "No conversations yet."}
            </p>
          </div>
        ) : (
          filtered.map((conversation) => {
            const otherUser =
              conversation.client._id === currentUserId
                ? conversation.worker
                : conversation.client;
            const online = onlineUsers.includes(otherUser._id);
            const isActive = activeId === conversation._id;

            return (
              <button
                key={conversation._id}
                onClick={() => {
                  router.push(`/chat/${conversation._id}`);
                  onCloseMobile?.();
                }}
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={otherUser.profileImage || "/default-avatar.png"}
                    alt={otherUser.name}
                    className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10"
                  />
                  {online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#151821]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="truncate text-sm font-medium text-white">
                      {otherUser.name}
                    </h3>
                    <span className="shrink-0 text-[11px] text-white/35">
                      {formatTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[13px] text-white/45">
                    {conversation.lastMessage || "Start chatting"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2 px-3 py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="h-11 w-11 rounded-full bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 rounded bg-white/[0.06]" />
            <div className="h-2.5 w-3/4 rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}