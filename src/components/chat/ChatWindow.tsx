"use client";

import { useEffect, useState } from "react";

import { useSocket } from "@/context/SocketProvider";

import {
  getMessages,
  sendMessage,
  markAsSeen,
} from "@/services/message.service";

import { Message } from "@/types/message";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
}

export default function ChatWindow({
  conversationId,
  currentUserId,
}: ChatWindowProps) {
  const { socket } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);

  // -------------------------
  // Load Messages
  // -------------------------

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
  console.log("Conversation ID:", conversationId);

  // -------------------------
  // Initial Load
  // -------------------------

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // -------------------------
  // Socket Connection
  // -------------------------

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-conversation", conversationId);

    // Receive Message
    socket.on("receive-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Typing
    socket.on("typing", () => {
      setTyping(true);
    });

    socket.on("stop-typing", () => {
      setTyping(false);
    });

    // Seen
    socket.on("messages-seen", () => {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          seen: true,
        }))
      );
    });

    return () => {
      socket.emit("leave-conversation", conversationId);

      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("messages-seen");
    };
  }, [socket, conversationId]);

    // -------------------------
  // Send Message
  // -------------------------

  const handleSendMessage = async (text: string) => {
  try {
    await sendMessage(conversationId, text);
  } catch (error) {
    console.error(error);
  }
};

  // -------------------------
  // Typing Indicator
  // -------------------------

  const handleTyping = () => {
    socket?.emit("typing", {
      conversationId,
      sender: currentUserId,
    });
  };

  const handleStopTyping = () => {
    socket?.emit("stop-typing", {
      conversationId,
    });
  };

  // -------------------------
  // Loading State
  // -------------------------

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading messages...
      </div>
    );
  }

    return (
    <div className="flex flex-col h-full bg-white">

      {/* Header */}

      <div className="border-b px-6 py-4">

        <h2 className="font-semibold text-lg">
          Conversation
        </h2>

      </div>

      {/* Messages */}

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
      />

      {/* Typing */}

      <TypingIndicator
        visible={typing}
      />

      {/* Input */}

      <ChatInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />

    </div>
  );
}