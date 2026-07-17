"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getTaskApplications, updateApplicationStatus } from "@/services/task";

interface Worker {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Application {
  _id: string;
  worker: Worker;
  proposal: string;
  expectedPrice: number;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

interface Task {
  _id: string;
  title: string;
  applications: Application[];
}

export default function TaskApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setError("");
      const data = await getTaskApplications(id);
      setTask(data.task);
    } catch (error) {
      console.log(error);
      setError("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (
    applicationId: string,
    status: "Accepted" | "Rejected"
  ) => {
    try {
      setUpdatingId(applicationId);
      await updateApplicationStatus(id, applicationId, status);
      await fetchApplications();
    } catch (error) {
      console.log(error);
      setError("Unable to update application.");
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => {
    const applications = task?.applications || [];

    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "Pending").length,
      accepted: applications.filter((item) => item.status === "Accepted").length,
      rejected: applications.filter((item) => item.status === "Rejected").length,
    };
  }, [task]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-medium text-neutral-700">
              Loading applications...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-semibold text-neutral-900">
              Task not found
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              The task or its applications could not be loaded.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-5 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
                Task applications
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Review worker applications
              </h1>

              <p className="mt-3 text-sm leading-6 text-neutral-500">
                Manage proposals for <span className="font-medium text-neutral-800">{task.title}</span>.
                Review workers, compare expected prices, and accept or reject applications.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.back()}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Back
              </button>

              <Link
                href={`/tasks/${task._id}`}
                className="rounded-2xl bg-neutral-900 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                View task
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total applications" value={stats.total} />
          <StatsCard title="Pending review" value={stats.pending} tone="warning" />
          <StatsCard title="Accepted" value={stats.accepted} tone="success" />
          <StatsCard title="Rejected" value={stats.rejected} tone="danger" />
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {task.applications.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-neutral-900">
              No applications yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              No worker has applied for this task so far.
            </p>
            <Link
              href={`/tasks/${task._id}`}
              className="mt-5 inline-flex rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Back to task
            </Link>
          </section>
        ) : (
          <section className="space-y-5">
            {task.applications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                loading={updatingId === application._id}
                onAccept={() => changeStatus(application._id, "Accepted")}
                onReject={() => changeStatus(application._id, "Rejected")}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function StatsCard({
  title,
  value,
  tone = "default",
}: {
  title: string;
  value: number;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : tone === "danger"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-neutral-50 text-neutral-900 border-neutral-200";

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${toneClasses}`}>
        {title}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
        {value}
      </p>
    </div>
  );
}

function ApplicationCard({
  application,
  loading,
  onAccept,
  onReject,
}: {
  application: Application;
  loading: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const statusClasses =
    application.status === "Accepted"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : application.status === "Rejected"
      ? "bg-red-50 text-red-700 border border-red-200"
      : "bg-amber-50 text-amber-700 border border-amber-200";

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {application.worker.profileImage ? (
            <img
              src={application.worker.profileImage}
              alt={application.worker.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-lg font-semibold text-white">
              {application.worker.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={`/worker/${application.worker._id}`} className="text-xl font-semibold tracking-tight text-neutral-950 hover:text-blue-600 hover:underline">
                {application.worker.name}
              </Link>

              <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${statusClasses}`}>
                {application.status}
              </span>
            </div>

            <p className="mt-1 break-all text-sm text-neutral-500">
              {application.worker.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[240px]">
          <MetaBox
            label="Expected price"
            value={`₹ ${application.expectedPrice}`}
          />
          <MetaBox
            label="Applied on"
            value={new Date(application.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
          Proposal
        </p>
        <p className="mt-3 text-sm leading-7 text-neutral-700">
          {application.proposal}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/worker/${application.worker._id}`}
          className="rounded-2xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
        >
          View profile
        </Link>

        <button
          onClick={onAccept}
          disabled={loading || application.status === "Accepted"}
          className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {loading && application.status !== "Rejected" ? "Updating..." : "Accept"}
        </button>

        <button
          onClick={onReject}
          disabled={loading || application.status === "Rejected"}
          className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {loading && application.status !== "Accepted" ? "Updating..." : "Reject"}
        </button>
      </div>
    </article>
  );
}

function MetaBox({
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