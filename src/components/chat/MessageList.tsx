"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/types/message";

interface Props {
  messages: Message[];
  currentUserId: string;
  isTyping?: boolean;
}

export default function MessageList({
  messages,
  currentUserId,
  isTyping = false,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-neutral-50 to-white px-3 py-4 sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 pb-4 sm:pb-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
            <div>
              <p className="text-lg font-semibold text-neutral-900">
                No messages yet
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Start the conversation by sending the first message.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-neutral-200">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}