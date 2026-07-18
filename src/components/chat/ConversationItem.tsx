"use client";

import { Conversation } from "@/types/conversation";
import clsx from "clsx";

interface Props {
  conversation: Conversation;
  currentUserId: string;
  online: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export default function ConversationItem({
  conversation,
  currentUserId,
  online,
  onClick,
  unreadCount = 0,
}: Props) {
  const otherUser =
    conversation.client._id === currentUserId
      ? conversation.worker
      : conversation.client;

  const lastMessage =
    conversation.lastMessage?.trim() || "Start chatting";

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-3 border-b border-neutral-200 px-4 py-4 text-left transition",
        "hover:bg-neutral-50 active:bg-neutral-100"
      )}
    >
      <div className="relative shrink-0">
        <img
          src={otherUser.profileImage || "/default-avatar.png"}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
          alt={otherUser.name}
        />

        {online && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-neutral-900">
              {otherUser.name}
            </h2>
            <p className="mt-1 truncate text-sm text-neutral-500">
              {lastMessage}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="text-[11px] text-neutral-400">
              {new Date(conversation.lastMessageAt).toLocaleDateString()}
            </span>

            {unreadCount > 0 && (
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-neutral-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}