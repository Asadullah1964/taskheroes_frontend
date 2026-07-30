"use client";

import { useState } from "react";

import loadRazorpay from "@/utils/loadRazorpay";

import {
  createOrder,
  verifyPayment,
} from "@/services/payment.service";

interface Props {
  taskId: string;
  workerId: string;
  taskTitle: string;
  onSuccess?: () => void;
}
    export default function PayNowButton({
    taskId,
    workerId,
    taskTitle,
    onSuccess,
    }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const loaded = await loadRazorpay();

      if (!loaded) {
        alert("Unable to load Razorpay.");
        return;
      }

      const order = await createOrder(taskId, workerId);

      const options = {
        key: order.key,

        amount: order.amount,

        currency: order.currency,

        name: "TaskHeroes",

        description: taskTitle,

        order_id: order.orderId,

        handler: async (response: any) => {
          await verifyPayment(response);

          alert("Payment Successful");

          onSuccess?.();
        },

        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ??
          "Payment failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}