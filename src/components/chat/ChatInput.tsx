"use client";

import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface Props {
  onSend: (text: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
}

export default function ChatInput({ onSend, onTyping, onStopTyping }: Props) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // close picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  const handleChange = (value: string) => {
    setText(value);
    onTyping();

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onStopTyping(), 1200);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    onStopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const el = textareaRef.current;
    if (!el) {
      handleChange(text + emojiData.emoji);
      return;
    }

    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + emojiData.emoji + text.slice(end);

    handleChange(next);

    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emojiData.emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="relative shrink-0 border-t border-black/[0.06] bg-white px-3 py-3 md:px-6">
      {/* Emoji popover */}
      {showEmoji && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-3 md:left-6 mb-2 z-10 shadow-lg rounded-2xl overflow-hidden"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={Theme.LIGHT}
            width={320}
            height={380}
            searchDisabled={false}
            skinTonesDisabled={false}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Emoji toggle */}
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className={`shrink-0 rounded-full p-2.5 transition ${
            showEmoji ? "bg-[#1F6F63]/10 text-[#1F6F63]" : "text-black/40 hover:bg-black/5"
          }`}
          aria-label="Open emoji picker"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M9 10h.01M15 10h.01" />
            <path strokeLinecap="round" strokeWidth={2} d="M8.5 14.5a4 4 0 007 0" />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowEmoji(false)}
          placeholder="Type a message"
          rows={1}
          className="flex-1 resize-none rounded-2xl bg-[#F2F2EF] px-4 py-2.5 text-sm text-[#151821] placeholder:text-black/35 outline-none ring-1 ring-transparent focus:ring-[#1F6F63] max-h-32 transition"
        />

        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="shrink-0 rounded-full bg-[#1F6F63] p-3 text-white transition disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#195b52]"
          aria-label="Send message"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.94 2.94a1.5 1.5 0 011.66-.32l13 5.5a1.5 1.5 0 010 2.76l-13 5.5a1.5 1.5 0 01-2.08-1.71L3.6 10 2.52 4.65a1.5 1.5 0 01.42-1.71z" />
          </svg>
        </button>
      </div>
    </div>
  );
}