"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  onSend: (text: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export default function ChatInput({
  onSend,
  onTyping,
  onStopTyping,
}: Props) {
  const [text, setText] = useState("");

  const send = () => {
    const value = text.trim();

    if (!value) return;

    onSend(value);

    setText("");

    onStopTyping?.();
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t p-4 flex gap-3 bg-white">
      <input
        type="text"
        value={text}
        placeholder="Type a message..."
        className="flex-1 rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          setText(e.target.value);

          if (e.target.value.length > 0) {
            onTyping?.();
          } else {
            onStopTyping?.();
          }
        }}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={send}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}