"use client";

import { Message } from "@/types/message";
import clsx from "clsx";

interface MessageBubbleProps {
  message: Message;
  currentUserId: string;
}

export default function MessageBubble({
  message,
  currentUserId,
}: MessageBubbleProps) {
  const isMine = message.sender._id === currentUserId;

  return (
    <div
      className={clsx(
        "flex mb-3",
        isMine ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[75%] rounded-2xl px-4 py-2 shadow",
          isMine
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        )}
      >
        {message.image && (
          <img
            src={message.image}
            alt="attachment"
            className="rounded-lg mb-2 max-h-64 object-cover"
          />
        )}

        {message.text && (
          <p className="break-words whitespace-pre-wrap">
            {message.text}
          </p>
        )}

        <div
          className={clsx(
            "mt-1 flex items-center gap-1 text-[11px]",
            isMine ? "text-blue-100" : "text-gray-500"
          )}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMine && (
            <span>{message.seen ? "✓✓" : "✓"}</span>
          )}
        </div>
      </div>
    </div>
  );
}