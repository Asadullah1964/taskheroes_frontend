"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMyTasks } from "@/services/task";
import { Task } from "@/types/task";
import ReviewModal from "@/components/review/ReviewModal";

type TaskFilter = "all" | "Open" | "Assigned" | "Completed";

interface MyTasksSectionProps {
  filter: TaskFilter;
}

export default function MyTasksSection({ filter }: MyTasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  if (loading) {
    return (
      <div className="py-16 text-center text-base font-medium text-neutral-500">
        Loading tasks...
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
        <h3 className="text-xl font-semibold text-neutral-900">
          No tasks found
        </h3>
        <p className="mt-2 text-sm text-neutral-500">
          {filter === "all"
            ? "You haven't created any tasks yet."
            : `No ${filter.toLowerCase()} tasks available right now.`}
        </p>

        <Link
          href="/tasks/create"
          className="mt-5 inline-flex rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          + New Task
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-neutral-950">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-500">
                {task.category}
              </p>
            </div>

            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
              {task.status}
            </span>
          </div>

          <p className="mt-4 line-clamp-2 text-sm leading-6 text-neutral-600">
            {task.description}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <TaskMeta label="Budget" value={`₹ ${task.budget}`} />
            <TaskMeta label="Applications" value={`${task.applications?.length || 0}`} />
            <TaskMeta
              label="Deadline"
              value={
                task.deadline
                  ? new Date(task.deadline).toLocaleDateString("en-IN")
                  : "Not set"
              }
            />
            <TaskMeta label="Category" value={task.category} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/tasks/${task._id}`}
              className="rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              View
            </Link>

            <Link
              href={`/tasks/${task._id}/edit`}
              className="rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Edit
            </Link>
            <Link
  href={`tasks/${task._id}/applications`}
  className="rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
>
  Applications ({task.applications?.length || 0})
</Link>
{task.status === "Completed" &&
  (task.hasReviewed ? (
    <span className="rounded-2xl bg-green-100 px-4 py-2.5 text-sm font-medium text-green-700">
      ✓ Reviewed
    </span>
  ) : (
    <button
      onClick={() => setSelectedTask(task)}
      className="rounded-2xl bg-yellow-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-yellow-600"
    >
      ⭐ Leave Review
    </button>
  ))}
          </div>
        </div>
      ))}
      {selectedTask && (
  <ReviewModal
    taskId={selectedTask._id}
    onClose={() => setSelectedTask(null)}
    onSuccess={fetchTasks}
  />
)}
    </div>
  );

  
}

function TaskMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-neutral-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

