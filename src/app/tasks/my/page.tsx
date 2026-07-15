"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getMyTasks } from "@/services/task";
import { Task } from "@/types/task";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getMyTasks();
      setTasks(data.tasks);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          My Tasks
        </h1>

        <Link
          href="/tasks/create"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + New Task
        </Link>

      </div>

      {tasks.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-10 text-center">
          <h2 className="text-xl">
            You haven't created any tasks yet.
          </h2>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">

          {tasks.map((task) => (

            <div
              key={task._id}
              className="bg-white rounded-xl shadow p-6"
            >

              <div className="flex justify-between">

                <h2 className="text-xl font-bold">
                  {task.title}
                </h2>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {task.status}
                </span>

              </div>

              <p className="mt-3 text-gray-600 line-clamp-2">
                {task.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-5">

                <div>
                  <p className="text-gray-500">
                    Budget
                  </p>

                  <p className="font-semibold">
                    ₹ {task.budget}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Category
                  </p>

                  <p>{task.category}</p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Deadline
                  </p>

                  <p>
                    {new Date(
                      task.deadline
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Applications
                  </p>

                  <p>
                    {task.applications.length}
                  </p>
                </div>

              </div>

              <div className="flex gap-3 mt-6">

                <Link
                  href={`/tasks/${task._id}`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  View
                </Link>

                <Link
                  href={`/tasks/${task._id}/edit`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

    </main>
  );
}