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
    <div className={clsx("flex w-full", isMine ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "group max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ring-1 sm:max-w-[75%] md:max-w-[68%]",
          isMine
            ? "rounded-br-md bg-neutral-900 text-white ring-neutral-900/10"
            : "rounded-bl-md bg-white text-neutral-900 ring-neutral-200"
        )}
      >
        {message.image && (
          <div className="mb-3 overflow-hidden rounded-2xl">
            <img
              src={message.image}
              alt="attachment"
              className="max-h-72 w-full object-cover"
            />
          </div>
        )}

        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm leading-6 sm:text-[15px]">
            {message.text}
          </p>
        )}

        <div
          className={clsx(
            "mt-2 flex items-center justify-end gap-1.5 text-[11px] font-medium",
            isMine ? "text-white/60" : "text-neutral-500"
          )}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMine && (
            <span
              className={clsx(
                "transition",
                message.seen ? "text-emerald-400" : "text-white/60"
              )}
              title={message.seen ? "Seen" : "Sent"}
            >
              {message.seen ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}