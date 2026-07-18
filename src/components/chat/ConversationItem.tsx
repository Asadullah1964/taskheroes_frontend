"use client";

import { Conversation } from "@/types/conversation";

interface Props {
  conversation: Conversation;
  currentUserId: string;
  online: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  currentUserId,
  online,
  onClick,
}: Props) {

  const otherUser =
    conversation.client._id === currentUserId
      ? conversation.worker
      : conversation.client;

  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 p-4 hover:bg-gray-100 transition border-b"
    >
      <div className="relative">

        <img
          src={
            otherUser.profileImage || "/default-avatar.png"
          }
          className="w-12 h-12 rounded-full object-cover"
          alt={otherUser.name}
        />

        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        )}

      </div>

      <div className="flex-1 text-left">

        <h2 className="font-semibold">

          {otherUser.name}

        </h2>

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
}