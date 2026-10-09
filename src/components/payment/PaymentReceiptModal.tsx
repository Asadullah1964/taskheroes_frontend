"use client";

import { X, Printer, ShieldCheck, Download, Check } from "lucide-react";
import { PaymentRecord } from "@/services/payment.service";

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentRecord;
  taskTitle: string;
}

export default function PaymentReceiptModal({
  isOpen,
  onClose,
  payment,
  taskTitle,
}: PaymentReceiptModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                TaskHeroes Payment Invoice
              </h3>
              <p className="text-[11px] text-neutral-500">Official Escrow Receipt</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-receipt" className="mt-5 space-y-5 text-neutral-900 dark:text-neutral-100">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Receipt Number
              </span>
              <p className="font-mono text-sm font-bold">{payment.receiptNumber || `REC-${payment._id.slice(-6)}`}</p>
              <span className="text-[11px] text-neutral-500">
                Txn ID: {payment.transactionId || payment.razorpayPaymentId || `TXN_${payment._id.slice(-8)}`}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Date & Time
              </span>
              <p className="text-xs font-medium">
                {new Date(payment.paidAt || payment.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <span className="inline-block mt-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                {payment.status === "released"
                  ? "✓ Released to Worker"
                  : payment.status === "in_escrow"
                  ? "🔒 Held in Escrow"
                  : "✓ Paid"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs dark:border-neutral-800 dark:bg-neutral-850">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-neutral-500">Client</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {payment.client?.name || "Client"}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {payment.client?.email}
                </p>
              </div>

              <div>
                <p className="font-semibold text-neutral-500">Beneficiary / Worker</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {payment.worker?.name || "Assigned Worker"}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {payment.worker?.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-neutral-400 dark:border-neutral-700">
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                <tr>
                  <td className="py-2.5 font-medium">{taskTitle}</td>
                  <td className="py-2.5 text-right font-semibold">₹{payment.amount}</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-500">Escrow Security & Guarantee</td>
                  <td className="py-2 text-right text-emerald-600 font-medium">FREE</td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-500">GST / Tax</td>
                  <td className="py-2 text-right text-neutral-500">₹0.00</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-900 text-sm font-bold dark:border-white">
                  <td className="pt-3">Total Paid</td>
                  <td className="pt-3 text-right">₹{payment.amount}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="rounded-xl bg-blue-50 p-3 text-[11px] text-blue-800 dark:bg-blue-500/10 dark:text-blue-300">
            Payment Method:{" "}
            <strong className="uppercase">{payment.paymentMethod || "CARD"}</strong>{" "}
            {payment.paymentDetails?.cardLast4 && `(ending in ${payment.paymentDetails.cardLast4})`}
            {payment.paymentDetails?.upiId && `(${payment.paymentDetails.upiId})`}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-neutral-900 py-3 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-neutral-300 px-5 py-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
