"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAppliedTasks } from "@/services/task";

interface AppliedTask {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  deadline: string;
  taskStatus: string;
  applicationStatus: string;
  proposal: string;
  expectedPrice: number;
  appliedAt: string;
  client: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    location?: string;
  };
}

export default function AppliedTasksPage() {
  const [tasks, setTasks] = useState<AppliedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedTasks();
  }, []);

  const fetchAppliedTasks = async () => {
    try {
      const data = await getAppliedTasks();
      setTasks(data.tasks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          Loading Applied Tasks...
        </h2>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl bg-neutral-50 p-6 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-100">
          Applied Tasks
        </h1>

        <p className="text-neutral-500 dark:text-neutral-400">
          Total Applications : {tasks.length}
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow dark:bg-neutral-900 dark:shadow-black/20">
          <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">
            You haven't applied to any task yet.
          </h2>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="rounded-xl bg-white p-6 shadow dark:bg-neutral-900 dark:shadow-black/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-950 dark:text-neutral-100">
                    {task.title}
                  </h2>

                  <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                    {task.category}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  {task.taskStatus}
                </span>
              </div>

              <p className="mt-4 text-neutral-700 dark:text-neutral-300">
                {task.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Budget
                  </p>
                  <p className="font-semibold text-neutral-950 dark:text-neutral-100">
                    ₹ {task.budget}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Your Price
                  </p>
                  <p className="font-semibold text-neutral-950 dark:text-neutral-100">
                    ₹ {task.expectedPrice}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Location
                  </p>
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {task.location}
                  </p>
                </div>

                <div>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Deadline
                  </p>
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {new Date(task.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-neutral-950 dark:text-neutral-100">
                  Proposal
                </h3>
                <p className="mt-2 text-neutral-700 dark:text-neutral-300">
                  {task.proposal}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 font-semibold text-neutral-950 dark:text-neutral-100">
                  Client
                </h3>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {task.client.name}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {task.client.email}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Applied On
                  </p>
                  <p className="text-neutral-900 dark:text-neutral-100">
                    {new Date(task.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    task.applicationStatus === "Accepted"
                      ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : task.applicationStatus === "Rejected"
                      ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                  }`}
                >
                  {task.applicationStatus}
                </span>
              </div>

              <Link
                href={`/tasks/${task._id}`}
                className="mt-6 block rounded-lg bg-indigo-600 py-3 text-center text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                View Task
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}