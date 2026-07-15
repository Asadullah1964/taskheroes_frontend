"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MyTasksSection from "@/components/tasks/MyTasks";
// import MyTasksSection from "..//MyTasksSection";

interface DashboardUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "worker";
  profileImage: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  location?: string;
}

interface ClientDashboardProps {
  user: DashboardUser;
}

type TaskTab = "all" | "Open" | "Assigned" | "Completed";

export default function ClientDashboard({ user }: ClientDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TaskTab>("all");

  const tabs: TaskTab[] = ["all", "Open", "Assigned", "Completed"];

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Client dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Manage the tasks you created and track their progress.
            </p>
          </div>

          <button
            onClick={() => router.push("/tasks/create")}
            className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            + Create task
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
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
  );
}