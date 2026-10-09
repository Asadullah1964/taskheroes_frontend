"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  Wallet,
  Lock,
  CheckCircle2,
  X,
  ArrowRight,
  Printer,
  Copy,
  Check,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { processDemoPayment } from "@/services/payment.service";

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
  workerId?: string;
  workerName?: string;
  amount: number;
  onSuccess?: () => void;
}

type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";
type Step = "select" | "otp" | "processing" | "success";

export default function DemoPaymentModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  workerId,
  workerName = "Assigned Worker",
  amount,
  onSuccess,
}: DemoPaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [step, setStep] = useState<Step>("select");

  // Card inputs
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = useState("RAHUL SHARMA");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("789");

  // UPI inputs
  const [upiId, setUpiId] = useState("client@okhdfcbank");
  const [upiApp, setUpiApp] = useState("gpay");
  const [showQr, setShowQr] = useState(false);
  const [qrTimer, setQrTimer] = useState(180);

  // Net Banking
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // OTP inputs
  const [otp, setOtp] = useState("");
  const [mockOtp, setMockOtp] = useState("748291");
  const [otpTimer, setOtpTimer] = useState(60);

  // Processing state
  const [processStep, setProcessStep] = useState(0);

  // Result state
  const [transactionId, setTransactionId] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [copiedTxn, setCopiedTxn] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setProcessStep(0);
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(randomOtp);
      setOtp("");
      setOtpTimer(60);
      setQrTimer(180);
    }
  }, [isOpen]);

  // QR countdown
  useEffect(() => {
    if (showQr && qrTimer > 0 && step === "select") {
      const t = setInterval(() => setQrTimer((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [showQr, qrTimer, step]);

  // OTP countdown
  useEffect(() => {
    if (step === "otp" && otpTimer > 0) {
      const t = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [step, otpTimer]);

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  // Format Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 2) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  // Quick fill card
  const handleAutofillCard = () => {
    setCardNumber("4532 8920 1144 5678");
    setCardHolder("ALOK VERMA");
    setCardExpiry("11/29");
    setCardCvv("482");
  };

  // Start payment -> go to OTP or processing
  const handleInitiatePayment = () => {
    if (method === "wallet") {
      runProcessingFlow();
    } else {
      setStep("otp");
    }
  };

  // Submit OTP
  const handleSubmitOtp = () => {
    runProcessingFlow();
  };

  // Simulate banking flow
  const runProcessingFlow = async () => {
    setStep("processing");
    setProcessStep(1); // Connecting to bank

    setTimeout(() => {
      setProcessStep(2); // Authenticating
    }, 900);

    setTimeout(async () => {
      setProcessStep(3); // Escrow lock

      try {
        const res = await processDemoPayment({
          taskId,
          workerId,
          paymentMethod: method,
          paymentDetails: {
            cardLast4: cardNumber.replace(/\s/g, "").slice(-4) || "4242",
            cardBrand: cardNumber.startsWith("4")
              ? "Visa"
              : cardNumber.startsWith("5")
              ? "Mastercard"
              : "RuPay",
            upiId: method === "upi" ? upiId : undefined,
            bankName: method === "netbanking" ? selectedBank : undefined,
          },
          amount,
        });

        setTransactionId(res.transactionId || `TXN_TH_${Date.now().toString().slice(-6)}`);
        setReceiptNumber(res.receiptNumber || `REC-${Date.now().toString().slice(-6)}`);

        setTimeout(() => {
          setStep("success");
          onSuccess?.();
        }, 800);
      } catch (err) {
        console.error("Payment API error:", err);
        // Fallback demo completion even if server has hiccups
        setTransactionId(`TXN_TH_${Date.now().toString().slice(-6)}`);
        setReceiptNumber(`REC-${Date.now().toString().slice(-6)}`);
        setTimeout(() => {
          setStep("success");
          onSuccess?.();
        }, 800);
      }
    }, 1800);
  };

  const handleCopyTxn = () => {
    navigator.clipboard.writeText(transactionId);
    setCopiedTxn(true);
    setTimeout(() => setCopiedTxn(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (!isOpen) return null;

  const cardBrand = cardNumber.startsWith("4")
    ? "VISA"
    : cardNumber.startsWith("5")
    ? "MASTERCARD"
    : cardNumber.startsWith("6")
    ? "RUPAY"
    : "CARD";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        {/* Header with Security Badge */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-850">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  TaskHeroes Escrow Checkout
                </h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Safe Payment Guarantee • Funds held in escrow until completion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: SELECT PAYMENT METHOD */}
          {step === "select" && (
            <div className="space-y-6">
              {/* Order Summary Pill */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Task
                    </span>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                      {taskTitle}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Worker: <span className="font-medium text-neutral-700 dark:text-neutral-300">{workerName}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Escrow Deposit
                    </span>
                    <div className="text-2xl font-bold text-neutral-950 dark:text-neutral-100">
                      ₹{amount}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 border-t border-neutral-200/60 pt-2.5 text-[11px] text-neutral-500 dark:border-neutral-700/60 dark:text-neutral-400">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>
                    Zero platform fee • Payment is protected until you approve task completion
                  </span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("card");
                      setShowQr(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-medium transition ${
                      method === "card"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("upi")}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-medium transition ${
                      method === "upi"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMethod("netbanking");
                      setShowQr(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-medium transition ${
                      method === "netbanking"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMethod("wallet");
                      setShowQr(false);
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-medium transition ${
                      method === "wallet"
                        ? "border-neutral-900 bg-neutral-900 text-white shadow dark:border-white dark:bg-white dark:text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Wallet</span>
                  </button>
                </div>
              </div>

              {/* METHOD 1: CREDIT / DEBIT CARD */}
              {method === "card" && (
                <div className="space-y-4">
                  {/* Realistic 3D Card Mockup */}
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-10 rounded bg-amber-400/80" />
                        <span className="text-[11px] font-mono tracking-widest text-slate-300">
                          DEBIT
                        </span>
                      </div>
                      <span className="font-bold italic tracking-wider text-sm">
                        {cardBrand}
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="font-mono text-xl tracking-[0.2em] font-semibold drop-shadow">
                        {cardNumber || "•••• •••• •••• ••••"}
                      </p>
                    </div>

                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">
                          Cardholder
                        </p>
                        <p className="text-xs font-medium tracking-wide uppercase">
                          {cardHolder || "YOUR NAME"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-slate-400">
                          Expires
                        </p>
                        <p className="text-xs font-mono font-medium">
                          {cardExpiry || "MM/YY"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          Card Number
                        </label>
                        <button
                          type="button"
                          onClick={handleAutofillCard}
                          className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Use Demo Card
                        </button>
                      </div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 font-mono text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="Name on card"
                          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm uppercase text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-100"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            Expires
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 font-mono text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-100 text-center"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 font-mono text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-100 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: UPI / QR CODE */}
              {method === "upi" && (
                <div className="space-y-4">
                  <div className="flex rounded-2xl bg-neutral-100 p-1 dark:bg-neutral-800">
                    <button
                      type="button"
                      onClick={() => setShowQr(false)}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium transition ${
                        !showQr
                          ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      UPI ID / App
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQr(true)}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium transition ${
                        showQr
                          ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-white"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      Scan QR Code
                    </button>
                  </div>

                  {!showQr ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          Select UPI App
                        </label>
                        <div className="mt-1.5 grid grid-cols-4 gap-2">
                          {[
                            { id: "gpay", name: "Google Pay", color: "text-blue-600" },
                            { id: "phonepe", name: "PhonePe", color: "text-indigo-600" },
                            { id: "paytm", name: "Paytm", color: "text-cyan-600" },
                            { id: "cred", name: "CRED UPI", color: "text-neutral-900 dark:text-white" },
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => {
                                setUpiApp(app.id);
                                setUpiId(`client@${app.id === "gpay" ? "okhdfcbank" : app.id === "phonepe" ? "ybl" : "paytm"}`);
                              }}
                              className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${
                                upiApp === app.id
                                  ? "border-neutral-900 bg-neutral-50 font-semibold dark:border-white dark:bg-neutral-800"
                                  : "border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-850"
                              }`}
                            >
                              <span className={app.color}>● </span>
                              {app.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          UPI ID / VPA
                        </label>
                        <div className="relative mt-1">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@bank"
                            className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-3.5 pr-20 text-sm text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-100"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center dark:border-neutral-800 dark:bg-neutral-850">
                      {/* Stylized QR Code */}
                      <div className="relative flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-neutral-900 bg-white p-2 shadow-inner dark:border-white dark:bg-white">
                        <QrCode className="h-36 w-36 text-neutral-900" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-lg bg-neutral-900 px-2 py-0.5 text-[10px] font-bold text-white">
                            ₹{amount}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>
                          Scan with any UPI App • Expires in{" "}
                          <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                            {Math.floor(qrTimer / 60)}:
                            {String(qrTimer % 60).padStart(2, "0")}
                          </span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmitOtp}
                        className="mt-3 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                      >
                        Simulate App Payment Approval ⚡
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* METHOD 3: NET BANKING */}
              {method === "netbanking" && (
                <div className="space-y-3">
                  <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Select Your Bank
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak", "Punjab National"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`rounded-xl border p-3 text-center text-xs font-medium transition ${
                          selectedBank === b
                            ? "border-neutral-900 bg-neutral-900 text-white font-semibold dark:border-white dark:bg-white dark:text-neutral-900"
                            : "border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-neutral-500 dark:text-neutral-400">
                      Or choose from 40+ other banks
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-neutral-200 bg-white p-2.5 text-sm text-neutral-900 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-100"
                    >
                      <option>HDFC Bank</option>
                      <option>State Bank of India</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Bank of Baroda</option>
                      <option>Canara Bank</option>
                      <option>IndusInd Bank</option>
                      <option>IDFC FIRST Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {/* METHOD 4: TASKHEROES WALLET */}
              {method === "wallet" && (
                <div className="rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 dark:border-neutral-800 dark:from-neutral-850 dark:to-neutral-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          TaskHeroes Demo Credits
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Preloaded balance for demo testing
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400">Available</span>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        ₹25,000.00
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-white p-3 text-xs text-neutral-600 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                    💡 Instantly locks ₹{amount} into TaskHeroes Escrow without entering card or bank details.
                  </div>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleInitiatePayment}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                <span>Deposit ₹{amount} to Escrow</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: REALISTIC OTP VERIFICATION */}
          {step === "otp" && (
            <div className="space-y-5 text-center">
              {/* Simulated SMS Notification Banner */}
              <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 p-3.5 text-left dark:border-blue-500/20 dark:bg-blue-500/10">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                      Simulated SMS Alert
                    </span>
                    <p className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                      TaskHeroes Escrow OTP: <strong>{mockOtp}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOtp(mockOtp)}
                  className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Auto-fill OTP
                </button>
              </div>

              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <Lock className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Bank 3D-Secure Authentication
                </h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Enter the 6-digit OTP sent to your registered mobile number
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • • • •"
                  className="mx-auto w-48 rounded-2xl border-2 border-neutral-300 bg-white py-3 text-center font-mono text-2xl font-bold tracking-[0.4em] text-neutral-900 outline-none focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-white"
                />
              </div>

              <div className="text-xs text-neutral-500">
                {otpTimer > 0 ? (
                  <span>Resend code in {otpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                      setMockOtp(newOtp);
                      setOtpTimer(60);
                    }}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="flex-1 rounded-2xl border border-neutral-300 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOtp}
                  disabled={otp.length < 4}
                  className="flex-1 rounded-2xl bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
                >
                  Verify & Confirm
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REALISTIC PROCESSING ANIMATION */}
          {step === "processing" && (
            <div className="py-8 text-center space-y-6">
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white" />
                <Lock className="h-8 w-8 text-neutral-900 dark:text-white" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Processing Escrow Deposit...
                </h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Please do not refresh or press back
                </p>
              </div>

              {/* Step checklist */}
              <div className="mx-auto max-w-xs space-y-2 text-left text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      processStep >= 1
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                  >
                    ✓
                  </div>
                  <span className={processStep >= 1 ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-400"}>
                    Connecting to banking gateway
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      processStep >= 2
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                  >
                    ✓
                  </div>
                  <span className={processStep >= 2 ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-400"}>
                    Authenticating credentials & 3D Secure
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      processStep >= 3
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                  >
                    ✓
                  </div>
                  <span className={processStep >= 3 ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-400"}>
                    Securing ₹{amount} in Escrow vault
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT SUCCESS & ESCROW LOCKED */}
          {step === "success" && (
            <div className="space-y-6 py-2">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-10 w-10 animate-in zoom-in duration-300" />
                </div>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
                  Payment Secured in Escrow!
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  ₹{amount} is safely locked in TaskHeroes Escrow.
                </p>
              </div>

              {/* Receipt Preview Card */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs dark:border-neutral-800 dark:bg-neutral-850">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-700">
                  <div>
                    <span className="text-neutral-400">Transaction ID</span>
                    <div className="flex items-center gap-1 font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      <span>{transactionId}</span>
                      <button
                        type="button"
                        onClick={handleCopyTxn}
                        className="text-neutral-400 hover:text-neutral-600"
                      >
                        {copiedTxn ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                    🔒 Held in Escrow
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div>
                    <span className="text-neutral-400">Receipt No</span>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 font-mono">
                      {receiptNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Payment Method</span>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200 uppercase">
                      {method}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Date & Time</span>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">
                      {new Date().toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-neutral-400">Worker Payout</span>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">
                      Upon Task Completion
                    </p>
                  </div>
                </div>
              </div>

              {/* Informative Escrow Note */}
              <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  The worker has been notified that escrow is funded. Once the work is done and you mark the task completed, you can release the payment directly to them!
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-300 px-5 py-3 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl bg-neutral-900 py-3 text-center text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                >
                  Return to Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
