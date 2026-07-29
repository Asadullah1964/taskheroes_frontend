"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Wallet,
  CalendarDays,
  Briefcase,
  Trash2,
  Pencil,
  CheckCircle2,
  User2,
  Mail,
  MessageCircle,
} from "lucide-react";

import api from "@/lib/api";
import { getTaskById, deleteTask, completeTask } from "@/services/task";
import { Task } from "@/types/task";
import ApplyTaskForm from "@/components/tasks/ApplyTaskForm";
import { createOrGetConversation } from "@/services/conversation.service";

interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: "client" | "worker";
}

export default function TaskDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const [taskData, userRes] = await Promise.all([
        getTaskById(id),
        api.get("/auth/me"),
      ]);

      setTask(taskData.task);
      setUser(userRes.data.data);
    } catch (error) {
      console.error("Error loading task details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete || !task) return;

    try {
      await deleteTask(task._id);
      alert("Task deleted successfully.");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete task.");
    }
  };

  const handleCompleteTask = async () => {
    const confirmComplete = window.confirm("Mark this task as completed?");

    if (!confirmComplete || !task) return;

    try {
      await completeTask(task._id);
      alert("Task marked as completed.");
      fetchData();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to complete task.");
    }
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "Assigned":
        return "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "Completed":
        return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      default:
        return "bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700";
    }
  };

  const handleOpenChat = async () => {
    if (!task) return;

    try {
      const conversation = await createOrGetConversation(task._id);
      router.push(`/chat/${conversation._id}`);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Unable to open chat.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-4 text-sm font-medium text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          Loading task details...
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="rounded-2xl border border-red-200 bg-white px-6 py-4 text-sm font-medium text-red-600 shadow-sm dark:border-red-500/20 dark:bg-neutral-900 dark:text-red-400">
          Task not found.
        </div>
      </div>
    );
  }

  const isOwner = user?.role === "client" && user._id === task.client._id;
  const isWorker = user?.role === "worker";
  const isAssignedWorker = task.assignedWorker?._id === user?._id;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            ← Back to tasks
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20 sm:p-8">
              <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {task.category}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                    {task.title}
                  </h1>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusStyles(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              <div className="pt-6">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Description
                </h2>
                <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                  {task.description}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Task information
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Wallet className="mt-0.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Budget
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        ₹ {task.budget}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Location
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {task.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Deadline
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-0.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Applications
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {task.applications?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Client details
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <User2 className="mt-0.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Name
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {task.client.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Email
                      </p>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {task.client.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Created
                    </p>
                    <p className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                      {new Date(task.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {isWorker && (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Apply for this task
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Send your proposal and expected price to the client.
                </p>

                <div className="mt-6">
                  <ApplyTaskForm taskId={task._id} />
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20 lg:sticky lg:top-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Actions
              </h3>

              <div className="mt-5 space-y-3">
                {isOwner && (
                  <>
                    <Link
                      href={`/tasks/${task._id}/edit`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit task
                    </Link>

                    {task.status === "Assigned" && (
                      <button
                        onClick={handleCompleteTask}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as completed
                      </button>
                    )}

                    {task.status === "Assigned" && (isOwner || isAssignedWorker) && (
                      <button
                        onClick={handleOpenChat}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Open Chat
                      </button>
                    )}

                    <button
                      onClick={handleDelete}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete task
                    </button>
                  </>
                )}

                {!isOwner && !isWorker && (
                  <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    You can view this task, but only the owner can manage it and
                    only workers can apply.
                  </div>
                )}

                {isWorker && (
                  <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    Review the task details and submit your application if this
                    work matches your skills.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}