import api from "@/lib/api";

export interface DemoPaymentPayload {
  taskId: string;
  workerId?: string;
  paymentMethod: "card" | "upi" | "netbanking" | "wallet";
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    upiId?: string;
    bankName?: string;
  };
  amount?: number;
}

export interface PaymentRecord {
  _id: string;
  client: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  worker?: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  task: {
    _id: string;
    title: string;
    category?: string;
    budget?: number;
    status?: string;
  };
  amount: number;
  currency: string;
  paymentMethod: "card" | "upi" | "netbanking" | "wallet" | "razorpay";
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    upiId?: string;
    bankName?: string;
  };
  transactionId?: string;
  receiptNumber?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: "pending" | "paid" | "in_escrow" | "released" | "failed" | "refunded";
  escrowStatus: "held_in_escrow" | "released" | "refunded" | "none";
  paidAt?: string;
  releasedAt?: string;
  createdAt: string;
}

export const createOrder = async (taskId: string, workerId?: string) => {
  const { data } = await api.post("/payments/create-order", {
    taskId,
    workerId,
  });
  return data.data;
};

export const processDemoPayment = async (payload: DemoPaymentPayload) => {
  const { data } = await api.post("/payments/process-demo-payment", payload);
  return data.data;
};

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const { data } = await api.post("/payments/verify", paymentData);
  return data;
};

export const getPaymentByTask = async (taskId: string) => {
  const { data } = await api.get(`/payments/task/${taskId}`);
  return data.data as PaymentRecord | null;
};

export const releaseEscrow = async (taskId: string) => {
  const { data } = await api.post(`/payments/release/${taskId}`);
  return data;
};

export const getMyTransactions = async () => {
  const { data } = await api.get("/payments/transactions");
  return data.data as {
    transactions: PaymentRecord[];
    summary: {
      totalSpent: number;
      totalEarned: number;
      inEscrow: number;
      count: number;
    };
  };
};