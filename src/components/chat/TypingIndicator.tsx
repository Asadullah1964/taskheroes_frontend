"use client";

interface Props {
  visible: boolean;
}

export default function TypingIndicator({
  visible,
}: Props) {
  if (!visible) return null;

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      Typing...
    </div>
  );
}