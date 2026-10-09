"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { getTasks } from "@/services/task";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";
import { Coordinates, getCurrentPosition } from "@/utils/location";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    // Attempt fast auto-detection for distance calculations
    getCurrentPosition()
      .then((pos) => setUserCoords(pos))
      .catch(() => {});

    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      // Show open tasks first, max 6
      const allTasks: Task[] = data.tasks || [];
      const openTasks = allTasks.filter((t) => t.status === "Open");
      const displayTasks = openTasks.length > 0 ? openTasks.slice(0, 6) : allTasks.slice(0, 6);
      setTasks(displayTasks);
    } catch (err) {
      console.error("Error loading tasks for browse:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">Loading open tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-800">
        <Sparkles className="mx-auto h-8 w-8 text-neutral-400" />
        <h3 className="mt-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
          No active tasks yet
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Be the first to post a new task on TaskHeroes!
        </p>
        <Link
          href="/tasks/create"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Post a Task
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} userCoordinates={userCoords} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/tasks"
          className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        >
          <span>Explore All Tasks with Filters & Map</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
