"use client";

import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";

import { Message } from "@/types/message";

interface Props {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({
  messages,
  currentUserId,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
      {messages.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          currentUserId={currentUserId}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}