"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAppliedTasks } from "@/services/task";

type TabKey = "all" | "applied" | "accepted" | "completed" | "rejected";

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

const tabs: {
  key: TabKey;
  label: string;
  status?: string;
}[] = [
  { key: "all", label: "All tasks" },
  { key: "applied", label: "Applied", status: "Applied" },
  { key: "accepted", label: "Accepted", status: "Accepted" },
  { key: "completed", label: "Completed", status: "Completed" },
  { key: "rejected", label: "Rejected", status: "Rejected" },
];

export default function WorkerTasksTabs() {
  const [tasks, setTasks] = useState<AppliedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  useEffect(() => {
    fetchAppliedTasks();
  }, []);

  const fetchAppliedTasks = async () => {
    try {
      const data = await getAppliedTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
  if (activeTab === "all") return tasks;

  if (activeTab === "completed") {
    return tasks.filter(
      (task) => task.taskStatus?.toLowerCase() === "completed"
    );
  }

  const tab = tabs.find((t) => t.key === activeTab);

  return tasks.filter((task) => {
    const status = tab?.status?.toLowerCase();
    return task.applicationStatus?.toLowerCase() === status;
  });
}, [tasks, activeTab]);

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      applied: tasks.filter(
        (t) => t.applicationStatus?.toLowerCase() === "applied"
      ).length,
      accepted: tasks.filter(
        (t) => t.applicationStatus?.toLowerCase() === "accepted"
      ).length,
      completed: tasks.filter(
        (t) => t.taskStatus?.toLowerCase() === "completed"
      ).length,
      rejected: tasks.filter(
        (t) => t.applicationStatus?.toLowerCase() === "rejected"
      ).length,
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900" />
          <h2 className="mt-4 text-lg font-semibold text-neutral-900">
            Loading your tasks...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
            Worker tasks
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            Task activity
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Track the tasks you applied for, accepted, completed, and rejected.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm ring-1 ring-neutral-200">
          Total tasks: <span className="font-semibold text-neutral-900">{tasks.length}</span>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-sm ring-1 ring-neutral-200">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  active
                    ? "bg-white/10 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState activeTab={activeTab} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </main>
  );
}

function TaskCard({ task }: { task: AppliedTask }) {
  const statusTone =
    task.applicationStatus?.toLowerCase() === "accepted"
      ? "bg-emerald-100 text-emerald-700"
      : task.applicationStatus?.toLowerCase() === "rejected"
      ? "bg-red-100 text-red-700"
      : task.taskStatus?.toLowerCase() === "completed"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700";

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold tracking-tight text-neutral-950">
            {task.title}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">{task.category}</p>
        </div>

        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusTone}`}>
          {task.applicationStatus || "Applied"}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-600">
        {task.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <InfoRow label="Budget" value={`₹${task.budget}`} />
        <InfoRow label="Your price" value={`₹${task.expectedPrice}`} />
        <InfoRow label="Location" value={task.location} />
        <InfoRow
          label="Deadline"
          value={new Date(task.deadline).toLocaleDateString()}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          Applied on {new Date(task.appliedAt).toLocaleDateString()}
        </p>

        <Link
          href={`/tasks/${task._id}`}
          className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          View task
        </Link>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-neutral-900">{value}</p>
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: TabKey }) {
  const messages = {
    all: {
      title: "No tasks yet",
      text: "You haven't received any task activity yet.",
    },
    applied: {
      title: "No applied tasks",
      text: "You haven't applied to any tasks yet.",
    },
    accepted: {
      title: "No accepted tasks",
      text: "Once a client accepts your application, it will appear here.",
    },
    completed: {
      title: "No completed tasks",
      text: "Completed jobs will show up here after you finish them.",
    },
    rejected: {
      title: "No rejected tasks",
      text: "Rejected applications will appear here if a client declines your proposal.",
    },
  };

  const state = messages[activeTab];

  return (
    <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center">
      <h2 className="text-xl font-semibold text-neutral-950">{state.title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-500">{state.text}</p>
    </div>
  );
}