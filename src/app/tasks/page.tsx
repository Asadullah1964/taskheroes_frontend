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
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center">
        Loading Tasks...
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold">
    Browse Tasks
  </h1>

  <Link
    href="/tasks/create"
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
  >
    + Create Task
  </Link>
</div>

      {tasks.length === 0 ? (
        <p>No Tasks Available</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
            />
          ))}
        </div>
      )}
    </main>
  );
}