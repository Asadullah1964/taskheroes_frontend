"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTasks } from "@/services/task";
import TaskCard from "@/components/tasks/TaskCard";
import { Task } from "@/types/task";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                Task marketplace
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Browse available tasks
              </h1>

              <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base">
                Explore posted tasks, compare opportunities, and open the ones
                that match your skills and location.
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600 ring-1 ring-neutral-200">
              {loading ? "Loading tasks..." : `Total tasks: ${tasks.length}`}
            </div>
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <TaskCardSkeleton key={index} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-2xl">
                🧾
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950">
                No tasks available
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
                There are no tasks to show right now. Check back later or post a
                new task if you are looking for help.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                >
                  Go home
                </Link>

                <Link
                  href="/tasks/create"
                  className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Create task
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="h-6 w-3/4 rounded bg-neutral-200" />
            <div className="mt-3 h-4 w-1/3 rounded bg-neutral-100" />
          </div>
          <div className="h-8 w-20 rounded-full bg-neutral-100" />
        </div>

        <div className="mt-5 space-y-2">
          <div className="h-4 w-full rounded bg-neutral-100" />
          <div className="h-4 w-5/6 rounded bg-neutral-100" />
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="h-16 rounded-2xl bg-neutral-100" />
          <div className="h-16 rounded-2xl bg-neutral-100" />
        </div>

        <div className="mt-6 h-11 w-full rounded-2xl bg-neutral-200" />
      </div>
    </div>
  );
}