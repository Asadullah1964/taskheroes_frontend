"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WorkerAppliedTasks from "@/components/tasks/WorkerAppliedTasks";

export default function AppliedTasksPage() {
  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <WorkerAppliedTasks />
      </div>
    </main>
  );
}