"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Plus, Sparkles, Wallet } from "lucide-react";
import MyTasksSection from "@/components/tasks/MyTasks";
import { getMyTransactions } from "@/services/payment.service";

interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "worker";
  profileImage: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  location?: string;
}

interface ClientDashboardProps {
  user: DashboardUser;
}

type TaskTab = "all" | "Open" | "Assigned" | "Completed";

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TaskTab>("all");
  const [summary, setSummary] = useState({
    totalSpent: 0,
    inEscrow: 0,
    count: 0,
  });

  const tabs: TaskTab[] = ["all", "Open", "Assigned", "Completed"];

  useEffect(() => {
    getMyTransactions()
      .then((data) => {
        if (data?.summary) {
          setSummary({
            totalSpent: data.summary.totalSpent,
            inEscrow: data.summary.inEscrow,
            count: data.summary.count,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-0.5 text-xs font-semibold text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Client Portal</span>
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
              Welcome, {user.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Manage your posted tasks, review worker proposals, and track escrow payments.
            </p>
          </div>

          <button
            onClick={() => router.push("/tasks/create")}
            className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Task</span>
          </button>
        </div>

        {/* Escrow Status Summary for Client */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 border-t border-neutral-100 pt-5 dark:border-neutral-800">
          <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">
                Active In Escrow
              </p>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                ₹{summary.inEscrow.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-400">
                Total Paid to Workers
              </p>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                ₹{summary.totalSpent.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-5 dark:border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTab === tab
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {tab === "all" ? "All Tasks" : tab}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <MyTasksSection filter={activeTab} />
        </div>
      </section>
    </div>
  );
}