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
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">
          Loading Applied Tasks...
        </h2>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Applied Tasks
        </h1>

        <p className="text-gray-500">
          Total Applications : {tasks.length}
        </p>

      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold">
            You haven't applied to any task yet.
          </h2>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">

          {tasks.map((task) => (

            <div
              key={task._id}
              className="bg-white shadow rounded-xl p-6"
            >

              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-2xl font-bold">
                    {task.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {task.category}
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {task.taskStatus}
                </span>

              </div>

              <p className="mt-4 text-gray-700">
                {task.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">

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
                    Your Price
                  </p>

                  <p className="font-semibold">
                    ₹ {task.expectedPrice}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">
                    Location
                  </p>

                  <p>{task.location}</p>
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

              </div>

              <div className="mt-6">

                <h3 className="font-semibold">
                  Proposal
                </h3>

                <p className="text-gray-700 mt-2">
                  {task.proposal}
                </p>

              </div>

              <div className="mt-6">

                <h3 className="font-semibold mb-2">
                  Client
                </h3>

                <p>{task.client.name}</p>

                <p className="text-gray-500">
                  {task.client.email}
                </p>

              </div>

              <div className="mt-6 flex justify-between items-center">

                <div>

                  <p className="text-gray-500 text-sm">
                    Applied On
                  </p>

                  <p>
                    {new Date(
                      task.appliedAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    task.applicationStatus === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : task.applicationStatus === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.applicationStatus}
                </span>

              </div>

              <Link
                href={`/tasks/${task._id}`}
                className="block mt-6 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
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