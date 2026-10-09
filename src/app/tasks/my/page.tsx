"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import MyTasksSection from "@/components/tasks/MyTasks";

type TaskFilter = "all" | "Open" | "Assigned" | "Completed";

export default function MyTasksPage() {
  const [activeTab, setActiveTab] = useState<TaskFilter>("all");
  const tabs: TaskFilter[] = ["all", "Open", "Assigned", "Completed"];

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Client Tasks
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
                My Posted Tasks
              </h1>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                View, edit, and track progress for all the tasks you created.
              </p>
            </div>

            <Link
              href="/tasks/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Plus className="h-4 w-4" />
              <span>Post New Task</span>
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
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
    </main>
  );
}