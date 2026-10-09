"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Wallet,
  CalendarDays,
  Briefcase,
  Trash2,
  Pencil,
  CheckCircle2,
  User2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  Receipt,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { getTaskById, deleteTask, completeTask } from "@/services/task";
import { getPaymentByTask, releaseEscrow, PaymentRecord } from "@/services/payment.service";
import { Task } from "@/types/task";
import ApplyTaskForm from "@/components/tasks/ApplyTaskForm";
import { createOrGetConversation } from "@/services/conversation.service";
import DemoPaymentModal from "@/components/payment/DemoPaymentModal";
import PaymentReceiptModal from "@/components/payment/PaymentReceiptModal";
import LocationMapPreview from "@/components/location/LocationMapPreview";
import DistanceBadge from "@/components/location/DistanceBadge";
import ReviewModal from "@/components/review/ReviewModal";
import { getCurrentPosition, Coordinates } from "@/utils/location";

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: "client" | "worker";
}

export default function TaskDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [releasingEscrow, setReleasingEscrow] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
      getCurrentPosition()
        .then((pos) => setUserCoords(pos))
        .catch(() => {});
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const [taskData, userRes] = await Promise.all([
        getTaskById(id),
        api.get("/auth/me").catch(() => ({ data: { data: null } })),
      ]);

      const fetchedTask = taskData.task;
      setTask(fetchedTask);
      setUser(userRes.data?.data || null);

      if (userRes.data?.data) {
        try {
          const p = await getPaymentByTask(id);
          setPayment(p);
        } catch {
          // No payment yet or unauthorized
        }
      }
    } catch (error) {
      console.error("Error loading task details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete || !task) return;

    try {
      await deleteTask(task._id);
      toast.success("Task deleted successfully");
      router.push("/tasks");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleCompleteTask = async () => {
    const confirmComplete = window.confirm("Mark this task as completed?");

    if (!confirmComplete || !task) return;

    try {
      await completeTask(task._id);
      toast.success("Task marked as completed! You can now leave a review.");
      await fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to complete task.");
    }
  };

  const handleReleaseEscrow = async () => {
    if (!task) return;
    const confirmRelease = window.confirm(
      `Release ₹${task.budget} from Escrow directly to ${task.assignedWorker?.name || "the worker"}?`
    );
    if (!confirmRelease) return;

    try {
      setReleasingEscrow(true);
      await releaseEscrow(task._id);
      toast.success("Funds successfully released to worker's account! 💰");
      await fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not release payment.");
    } finally {
      setReleasingEscrow(false);
    }
  };

  const handleOpenChat = async () => {
    if (!task) return;

    try {
      const conversation = await createOrGetConversation(task._id);
      router.push(`/chat/${conversation._id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to open chat.");
    }
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "Assigned":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Completed":
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      default:
        return "bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-6 py-4 text-sm font-medium text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent dark:border-white" />
          <span>Loading task details...</span>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="rounded-2xl border border-red-200 bg-white px-6 py-4 text-sm font-medium text-red-600 shadow-sm dark:border-red-500/20 dark:bg-neutral-900 dark:text-red-400">
          Task not found.
        </div>
      </div>
    );
  }

  const isOwner = user?.role === "client" && user._id === task.client?._id;
  const isWorker = user?.role === "worker";
  const isAssignedWorker = task.assignedWorker?._id === user?._id;
  const currentPaymentStatus = task.paymentStatus || (payment?.status === "in_escrow" ? "in_escrow" : payment?.status === "released" ? "released" : "unpaid");

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            ← Back to all tasks
          </Link>

          {isOwner && (
            <Link
              href={`/tasks/${task._id}/applications`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <span>Manage Applications</span>
              <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] text-white dark:bg-white dark:text-neutral-900">
                {task.applications?.length || 0}
              </span>
            </Link>
          )}
        </div>

        {/* Milestone Stepper */}
        <div className="mb-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[11px]">
                1
              </span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                Posted
              </span>
            </div>

            <div className="h-0.5 w-6 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[11px] ${
                  task.applications?.length > 0
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                2
              </span>
              <span className={task.applications?.length > 0 ? "font-semibold" : "text-neutral-400"}>
                Applications ({task.applications?.length || 0})
              </span>
            </div>

            <div className="h-0.5 w-6 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[11px] ${
                  task.status === "Assigned" || task.status === "Completed"
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                3
              </span>
              <span className={task.status === "Assigned" || task.status === "Completed" ? "font-semibold" : "text-neutral-400"}>
                Assigned
              </span>
            </div>

            <div className="h-0.5 w-6 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[11px] ${
                  currentPaymentStatus === "in_escrow" || currentPaymentStatus === "released"
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                4
              </span>
              <span className={currentPaymentStatus === "in_escrow" || currentPaymentStatus === "released" ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-neutral-400"}>
                Escrow Secured 🔒
              </span>
            </div>

            <div className="h-0.5 w-6 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[11px] ${
                  task.status === "Completed"
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                5
              </span>
              <span className={task.status === "Completed" ? "font-semibold" : "text-neutral-400"}>
                Completed
              </span>
            </div>

            <div className="h-0.5 w-6 bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[11px] ${
                  currentPaymentStatus === "released"
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                6
              </span>
              <span className={currentPaymentStatus === "released" ? "font-semibold text-emerald-600" : "text-neutral-400"}>
                Payout Released 💰
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Main Task Column */}
          <section className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
              <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {task.category}
                    </span>
                    <DistanceBadge
                      location={task.location}
                      coordinates={task.coordinates}
                      userCoordinates={userCoords}
                    />
                  </div>
                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100 sm:text-4xl">
                    {task.title}
                  </h1>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`inline-flex rounded-full px-3.5 py-1 text-xs font-semibold ${getStatusStyles(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>

                  {currentPaymentStatus === "in_escrow" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                      <Lock className="h-3 w-3" />
                      <span>Escrow Secured</span>
                    </span>
                  )}
                  {currentPaymentStatus === "released" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                      <span>✓ Paid & Released</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Description
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                  {task.description}
                </p>
              </div>
            </div>

            {/* Quick Details Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Task Specifications
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Agreed Budget
                      </p>
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        ₹ {task.budget}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Target Deadline
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Flexible"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Applications Received
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {task.applications?.length || 0} workers applied
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Client & Worker
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      <User2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Client
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {task.client?.name || "Client"}
                      </p>
                      <p className="text-xs text-neutral-400">{task.client?.email}</p>
                    </div>
                  </div>

                  {task.assignedWorker && (
                    <div className="flex items-start gap-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Assigned Worker
                        </p>
                        <Link
                          href={`/worker/${task.assignedWorker._id}`}
                          className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                          {task.assignedWorker.name}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location Map Preview */}
            <LocationMapPreview
              location={task.location}
              coordinates={task.coordinates}
              title={`Service Location: ${task.location}`}
            />

            {/* Worker Application Form (Only if worker hasn't applied) */}
            {isWorker && task.status === "Open" && (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Apply for this task
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Send your proposal and expected price to the client.
                </p>

                <div className="mt-6">
                  <ApplyTaskForm taskId={task._id} />
                </div>
              </div>
            )}
          </section>

          {/* Right Sidebar: Actions & Escrow Card */}
          <aside className="space-y-6">
            {/* ESCROW & PAYMENT CARD */}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:sticky lg:top-6">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Payment & Escrow
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    TaskHeroes Escrow Protection
                  </p>
                </div>
              </div>

              {/* Status Display */}
              <div className="mt-4 space-y-4">
                {currentPaymentStatus === "unpaid" && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs dark:border-amber-500/20 dark:bg-amber-500/10">
                    <p className="font-semibold text-amber-800 dark:text-amber-300">
                      Escrow Deposit Pending
                    </p>
                    <p className="mt-1 text-amber-700 dark:text-amber-400 leading-relaxed">
                      {isOwner
                        ? "Deposit the budget into Escrow so the worker has guaranteed payout upon completion."
                        : "Waiting for client to fund the escrow deposit."}
                    </p>

                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => setPaymentModalOpen(true)}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>Fund Escrow (₹{task.budget})</span>
                      </button>
                    )}
                  </div>
                )}

                {currentPaymentStatus === "in_escrow" && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        🔒 ₹{task.budget} Held in Escrow
                      </span>
                      <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-500/30 dark:text-emerald-200">
                        Secured
                      </span>
                    </div>

                    <p className="mt-2 text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      {isOwner
                        ? "Payment is safely locked in Escrow. Once the task is finished, release the payout to the worker."
                        : "Payment is guaranteed! Funds are locked in escrow and will be transferred to you upon task completion."}
                    </p>

                    {payment && (
                      <button
                        type="button"
                        onClick={() => setReceiptModalOpen(true)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 dark:border-emerald-500/40 dark:bg-neutral-900 dark:text-emerald-300"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        <span>View Escrow Receipt</span>
                      </button>
                    )}

                    {isOwner && task.status === "Completed" && (
                      <button
                        type="button"
                        onClick={handleReleaseEscrow}
                        disabled={releasingEscrow}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <span>
                          {releasingEscrow ? "Releasing..." : `Release ₹${task.budget} to Worker 💰`}
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {currentPaymentStatus === "released" && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs dark:border-blue-500/20 dark:bg-blue-500/10">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-800 dark:text-blue-300">
                        ✓ ₹{task.budget} Payout Released
                      </span>
                      <span className="rounded-full bg-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-900 dark:bg-blue-500/30 dark:text-blue-200">
                        Completed
                      </span>
                    </div>
                    <p className="mt-2 text-blue-700 dark:text-blue-400">
                      The escrow funds have been successfully disbursed to the worker's account.
                    </p>

                    {payment && (
                      <button
                        type="button"
                        onClick={() => setReceiptModalOpen(true)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-300 bg-white py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 dark:border-blue-500/40 dark:bg-neutral-900 dark:text-blue-300"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        <span>View Tax Invoice</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-6 space-y-2.5 border-t border-neutral-100 pt-5 dark:border-neutral-800">
                {isOwner && (
                  <>
                    <Link
                      href={`/tasks/${task._id}/edit`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Task
                    </Link>

                    {task.status === "Assigned" && (
                      <button
                        onClick={handleCompleteTask}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Completed
                      </button>
                    )}

                    {task.status === "Completed" && !task.hasReviewed && (
                      <button
                        onClick={() => setReviewModalOpen(true)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
                      >
                        ⭐ Leave Worker Review
                      </button>
                    )}

                    <Link
                      href={`/tasks/${task._id}/applications`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                    >
                      <Briefcase className="h-4 w-4" />
                      View Applications ({task.applications?.length || 0})
                    </Link>

                    {(task.status === "Assigned" || task.status === "Completed") && (
                      <button
                        onClick={handleOpenChat}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Open Chat with Worker
                      </button>
                    )}

                    <button
                      onClick={handleDelete}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Task
                    </button>
                  </>
                )}

                {isAssignedWorker && (
                  <button
                    onClick={handleOpenChat}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Open Chat with Client
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        taskId={task._id}
        taskTitle={task.title}
        workerId={task.assignedWorker?._id}
        workerName={task.assignedWorker?.name}
        amount={task.budget}
        onSuccess={() => {
          fetchData();
        }}
      />

      {/* Payment Receipt Modal */}
      {payment && (
        <PaymentReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          payment={payment}
          taskTitle={task.title}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <ReviewModal
          taskId={task._id}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}
    </main>
  );
}