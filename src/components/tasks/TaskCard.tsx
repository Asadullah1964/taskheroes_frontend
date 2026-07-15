import Link from "next/link";
import { MapPin, Wallet, ArrowRight, CalendarDays } from "lucide-react";
import { Task } from "@/types/task";

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const statusStyles: Record<string, string> = {
    Open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Assigned: "bg-amber-50 text-amber-700 border border-amber-200",
    Completed: "bg-blue-50 text-blue-700 border border-blue-200",
    Cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
  };

  return (
    <div className="group flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-neutral-900">
            {task.title}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {task.category}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[task.status] ||
            "bg-neutral-100 text-neutral-700 border border-neutral-200"
          }`}
        >
          {task.status}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">
        {task.description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-neutral-50 px-4 py-3">
          <div className="flex items-center gap-2 text-neutral-500">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Budget
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-neutral-900">
            ₹{task.budget}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral-50 px-4 py-3">
          <div className="flex items-center gap-2 text-neutral-500">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Location
            </span>
          </div>
          <p className="mt-2 line-clamp-1 text-sm font-semibold text-neutral-900">
            {task.location}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-neutral-50 px-4 py-3">
        <div className="flex items-center gap-2 text-neutral-500">
          <CalendarDays className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Deadline
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-neutral-900">
          {new Date(task.deadline).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
        <div>
          <p className="text-xs text-neutral-500">
            Posted by
          </p>
          <p className="text-sm font-medium text-neutral-900">
            {task.client?.name || "Client"}
          </p>
        </div>

        <Link
          href={`/tasks/${task._id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          View task
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}