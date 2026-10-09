"use client";

import { useState } from "react";
import { Lock, CreditCard } from "lucide-react";
import DemoPaymentModal from "./DemoPaymentModal";

interface Props {
  taskId: string;
  workerId?: string;
  workerName?: string;
  taskTitle: string;
  amount: number;
  onSuccess?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "pill";
}

export default function PayNowButton({
  taskId,
  workerId,
  workerName,
  taskTitle,
  amount,
  onSuccess,
  className = "",
  variant = "primary",
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const baseStyles =
    variant === "pill"
      ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
      : variant === "secondary"
      ? "inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      : "inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600";

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`${baseStyles} ${className}`}
      >
        <Lock className="h-4 w-4" />
        <span>Pay & Secure Escrow</span>
      </button>

      <DemoPaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        taskId={taskId}
        taskTitle={taskTitle}
        workerId={workerId}
        workerName={workerName}
        amount={amount}
        onSuccess={() => {
          setModalOpen(false);
          onSuccess?.();
        }}
      />
    </>
  );
}