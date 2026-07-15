"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface WorkerProfile {
  title: string;
  bio: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  location: string;
  availability: "Available" | "Busy" | "Offline";
  completedJobs: number;
  rating: number;
}

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
  workerProfile?: WorkerProfile | null;
}

interface WorkerApplication {
  _id: string;
  taskId: string;
  taskTitle: string;
  category: string;
  budget: number;
  location: string;
  status: "Pending" | "Accepted" | "Rejected";
  appliedAt: string;
}

interface WorkerDashboardProps {
  user: DashboardUser;
  applications?: WorkerApplication[];
}

export default function WorkerDashboard({
  user,
  applications = [],
}: WorkerDashboardProps) {
  const router = useRouter();

  const worker = user.workerProfile ?? null;
  const availability = worker?.availability || "Available";
  const completedJobs = worker?.completedJobs ?? 0;
  const rating = worker?.rating ?? 0;
  const hourlyRate = worker?.hourlyRate ?? 0;
  const experience = worker?.experience ?? 0;
  const skills = worker?.skills ?? [];

  const profileProgress = user.isProfileCompleted
    ? 100
    : worker?.title || worker?.bio || skills.length > 0
    ? 72
    : 38;

  const applicationStats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "Pending").length,
      accepted: applications.filter((item) => item.status === "Accepted").length,
      rejected: applications.filter((item) => item.status === "Rejected").length,
    };
  }, [applications]);

  const recentApplications = applications.slice(0, 4);

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
              Worker workspace
            </span>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Track your task applications
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Monitor pending applications, accepted work, and rejected requests from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/tasks")}
              className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Browse tasks
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Edit profile
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total applications"
          value={String(applicationStats.total)}
          hint="Tasks you have applied for"
        />
        <DashboardCard
          title="Pending"
          value={String(applicationStats.pending)}
          hint="Waiting for client response"
          tone="warning"
        />
        <DashboardCard
          title="Accepted"
          value={String(applicationStats.accepted)}
          hint="Applications approved by clients"
          tone="success"
        />
        <DashboardCard
          title="Rejected"
          value={String(applicationStats.rejected)}
          hint="Applications not selected"
          tone="danger"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  Work overview
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  A quick snapshot of your current worker activity and marketplace readiness.
                </p>
              </div>

              <span
                className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-medium ${
                  availability === "Available"
                    ? "bg-emerald-50 text-emerald-700"
                    : availability === "Busy"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {availability}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <InfoCard
                label="Professional title"
                value={worker?.title || "Add your title"}
              />
              <InfoCard
                label="Experience"
                value={`${experience} year${experience === 1 ? "" : "s"}`}
              />
              <InfoCard
                label="Hourly rate"
                value={`₹${hourlyRate}`}
              />
              <InfoCard
                label="Completed jobs"
                value={String(completedJobs)}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoCard
                label="Location"
                value={worker?.location || user.location || "Add location"}
              />
              <InfoCard
                label="Rating"
                value={rating ? `${rating.toFixed(1)}/5` : "No ratings yet"}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-neutral-950">
                  Recent applications
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Your latest task applications and their current status.
                </p>
              </div>

              <button
                onClick={() => router.push("/worker/applications")}
                className="rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                View all
              </button>
            </div>

            {recentApplications.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
                <h4 className="text-lg font-semibold text-neutral-900">
                  No applications yet
                </h4>
                <p className="mt-2 text-sm text-neutral-500">
                  Start applying to tasks to track their status here.
                </p>
                <button
                  onClick={() => router.push("/tasks")}
                  className="mt-5 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Browse tasks
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentApplications.map((application) => (
                  <ApplicationPreviewCard
                    key={application._id}
                    application={application}
                    onView={() =>
                      router.push(`/tasks/${application.taskId}`)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-950">
              Profile strength
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              A stronger worker profile improves trust and helps clients shortlist you faster.
            </p>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-neutral-500">Completion progress</span>
                <span className="font-medium text-neutral-900">
                  {profileProgress}%
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-neutral-900 transition-all"
                  style={{ width: `${profileProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MiniStat label="Skills" value={String(skills.length)} />
              <MiniStat
                label="Verified"
                value={user.isVerified ? "Yes" : "No"}
              />
              <MiniStat
                label="Bio"
                value={worker?.bio ? "Added" : "Missing"}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-950">
              Next actions
            </h3>

            <div className="mt-4 space-y-3">
              {!user.isProfileCompleted && (
                <ActionButton
                  label="Complete profile"
                  onClick={() => router.push("/profile")}
                  primary
                />
              )}

              {skills.length === 0 && (
                <ActionButton
                  label="Add skills"
                  onClick={() => router.push("/profile")}
                />
              )}

              {!worker?.bio && (
                <ActionButton
                  label="Write professional bio"
                  onClick={() => router.push("/profile")}
                />
              )}

              {!user.isVerified && (
                <ActionButton
                  label="Verify account"
                  onClick={() => router.push("/profile")}
                />
              )}

              <ActionButton
                label="Browse more tasks"
                onClick={() => router.push("/tasks")}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-neutral-900 p-6 text-white shadow-sm">
            <h3 className="text-lg font-semibold">Visibility tip</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Workers with clear skills, pricing, location, and a complete bio usually get better response quality from clients.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-white/70">
                  Add skills to improve discoverability.
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  hint,
  tone = "default",
}: {
  title: string;
  value: string;
  hint: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : tone === "danger"
      ? "bg-red-50 text-red-700"
      : "bg-neutral-100 text-neutral-900";

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
            {value}
          </h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${toneClasses}`}>
          {title}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-500">{hint}</p>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  primary = false,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={
        primary
          ? "w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          : "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
      }
    >
      {label}
    </button>
  );
}

function ApplicationPreviewCard({
  application,
  onView,
}: {
  application: WorkerApplication;
  onView: () => void;
}) {
  const statusClasses =
    application.status === "Accepted"
      ? "bg-emerald-50 text-emerald-700"
      : application.status === "Rejected"
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="text-lg font-semibold text-neutral-900">
            {application.taskTitle}
          </h4>
          <p className="mt-1 text-sm text-neutral-500">
            {application.category} • {application.location}
          </p>
        </div>

        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClasses}`}>
          {application.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Budget
          </p>
          <p className="mt-2 text-sm font-semibold text-neutral-900">
            ₹{application.budget}
          </p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Applied on
          </p>
          <p className="mt-2 text-sm font-semibold text-neutral-900">
            {new Date(application.appliedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onView}
          className="rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          View task
        </button>
      </div>
    </div>
  );
}