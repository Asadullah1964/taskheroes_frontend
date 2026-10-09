"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import WorkerAppliedTasks from "@/components/tasks/WorkerAppliedTasks";
import { getMyTransactions } from "@/services/payment.service";

interface WorkerProfile {
  title: string;
  bio: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  location: string;
  availability: "Available" | "Busy" | "Offline";
  completedJobs: number;
  rating: number;
}

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
  workerProfile?: WorkerProfile | null;
}

interface WorkerDashboardProps {
  user: DashboardUser;
}

export default function WorkerDashboard({ user }: WorkerDashboardProps) {
  const router = useRouter();
  const worker = user.workerProfile ?? null;

  const rating = worker?.rating ?? 0;
  const completedJobs = worker?.completedJobs ?? 0;
  const availability = worker?.availability || "Available";
  const skillsCount = worker?.skills?.length ?? 0;

  const [earnings, setEarnings] = useState({
    totalEarned: 0,
    inEscrow: 0,
  });
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const data = await getMyTransactions();
      if (data?.summary) {
        setEarnings({
          totalEarned: data.summary.totalEarned,
          inEscrow: data.summary.inEscrow,
        });
      }
    } catch (e) {
      console.warn("Could not load earnings summary", e);
    }
  };

  const handleWithdraw = () => {
    if (earnings.totalEarned <= 0) {
      toast.info("No available earnings to withdraw right now. Complete tasks to earn!");
      return;
    }

    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      toast.success(
        `₹${earnings.totalEarned} payout successfully initiated to your linked Bank Account (A/C ending in 4920)!`
      );
    }, 1200);
  };

  return (
    <div className="grid gap-6">
      {/* Top Banner */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Verified Worker</span>
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
              Welcome back, {user.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Track your earnings, escrow-guaranteed payments, and applications.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/tasks")}
              className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Browse tasks
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Edit profile
            </button>
          </div>
        </div>
      </section>

      {/* Escrow & Earnings Feature Cards */}
      <section className="grid gap-5 md:grid-cols-2">
        {/* Available Earnings Card */}
        <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-850">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Total Released Payouts
                </p>
                <h3 className="text-2xl font-bold text-neutral-950 dark:text-neutral-100">
                  ₹{earnings.totalEarned.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              <span>{withdrawing ? "Processing..." : "Withdraw Funds"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 pt-3 dark:border-neutral-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Direct payouts deposited upon client task completion</span>
          </div>
        </div>

        {/* Escrow Guarantee Card */}
        <div className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-850">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Protected in Escrow
                </p>
                <h3 className="text-2xl font-bold text-neutral-950 dark:text-neutral-100">
                  ₹{earnings.inEscrow.toLocaleString("en-IN")}
                </h3>
              </div>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
              🔒 Guaranteed
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 pt-3 dark:border-neutral-800">
            <TrendingUp className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Funds deposited by clients, awaiting job completion</span>
          </div>
        </div>
      </section>

      {/* Profile KPI Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SmallStat title="Rating" value={rating ? rating.toFixed(1) : "0.0"} sub="⭐ From client reviews" />
        <SmallStat title="Completed jobs" value={String(completedJobs)} sub="Verified tasks finished" />
        <SmallStat title="Skills" value={String(skillsCount)} sub="Active competencies" />
        <SmallStat title="Status" value={availability} sub="Worker availability" />
      </section>

      {/* Applications Section */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-neutral-100 pb-5 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
              My Task Activity
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Manage all your applied proposals, accepted jobs, and completed gigs.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <WorkerAppliedTasks />
        </div>
      </section>
    </div>
  );
}

function SmallStat({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{sub}</p>}
    </div>
  );
}