"use client";

import Link from "next/link";
import { Wallet, ArrowRight, CalendarDays, Lock, Users } from "lucide-react";
import { Task } from "@/types/task";
import DistanceBadge from "@/components/location/DistanceBadge";
import { Coordinates } from "@/utils/location";

interface Props {
  task: Task;
  userCoordinates?: Coordinates | null;
}

export default function TaskCard({ task, userCoordinates }: Props) {
  const statusStyles: Record<string, string> = {
    Open: "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    Assigned:
      "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    Completed:
      "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300",
    Cancelled:
      "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
  };

  return (
    <div className="group flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
              {task.category}
            </span>

            {task.paymentStatus === "in_escrow" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                <Lock className="h-3 w-3" />
                <span>Escrow Funded</span>
              </span>
            )}
            {task.paymentStatus === "released" && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-300">
                ✓ Payout Released
              </span>
            )}
          </div>

          <h2 className="line-clamp-2 text-base font-semibold tracking-tight text-neutral-900 transition group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
            {task.title}
          </h2>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusStyles[task.status] ||
            "border border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          }`}
        >
          {task.status}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 flex-1">
        {task.description}
      </p>

      {/* Location with Distance */}
      <div className="mt-4">
        <DistanceBadge
          location={task.location}
          coordinates={task.coordinates}
          userCoordinates={userCoordinates}
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800/70">
          <div className="flex items-center gap-1 text-neutral-400">
            <Wallet className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase font-semibold">Budget</span>
          </div>
          <p className="mt-1 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            ₹{task.budget}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800/70">
          <div className="flex items-center gap-1 text-neutral-400">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase font-semibold">Deadline</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {task.deadline
              ? new Date(task.deadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
              : "Flexible"}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800/70">
          <div className="flex items-center gap-1 text-neutral-400">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase font-semibold">Applied</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
            {task.applications?.length || 0}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3.5 dark:border-neutral-800">
        <div className="min-w-0 pr-2">
          <p className="text-[11px] text-neutral-400">Posted by</p>
          <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
            {task.client?.name || "Client"}
          </p>
        </div>

        <Link
          href={`/tasks/${task._id}`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <span>View Task</span>
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}