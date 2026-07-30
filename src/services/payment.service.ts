import api from "@/lib/api";

export const createOrder = async (
    taskId: string,
    workerId: string
) => {
    const { data } = await api.post("/payments/create-order", {
        taskId,
        workerId,
    });

    return data.data;
};

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const { data } = await api.post(
    "/payments/verify",
    paymentData
  );

  return data;
};