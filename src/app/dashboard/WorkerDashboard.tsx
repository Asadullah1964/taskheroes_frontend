"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorkerAppliedTasks from "@/components/tasks/WorkerAppliedTasks";
import NotificationBell from "@/components/notifications/NotificationBell";

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

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Worker dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Track your applications and keep an eye on your profile performance.
            </p>
          </div>

          <div className="flex gap-3">
            <NotificationBell />
            <button
              onClick={() => router.push("/tasks")}
              className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Browse tasks
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Edit profile
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SmallStat title="Rating" value={rating ? rating.toFixed(1) : "0.0"} />
        <SmallStat title="Completed jobs" value={String(completedJobs)} />
        <SmallStat title="Skills" value={String(skillsCount)} />
        <SmallStat title="Status" value={availability} />
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              My applications
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              View your applied tasks, accepted work, and completed jobs.
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
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );
}