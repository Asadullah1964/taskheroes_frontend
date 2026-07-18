"use client";

interface Props {
  visible: boolean;
  label?: string;
}

export default function TypingIndicator({
  visible,
  label = "Typing",
}: Props) {
  if (!visible) return null;

  return (
    <div className="flex items-end gap-2 px-3 py-2 sm:px-4">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3 shadow-sm ring-1 ring-neutral-200">
        <span className="sr-only">{label}</span>

        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-500 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-500" />
      </div>

      <span className="text-xs text-neutral-500 sm:text-sm">
        {label}...
      </span>
    </div>
  );
}