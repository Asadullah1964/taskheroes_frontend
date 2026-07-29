"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getWorkerProfile } from "@/services/user.service";
import { Review } from "@/types/review";
import { getWorkerReviews } from "@/services/reviews";
import { Worker } from "@/types/user";

export default function WorkerProfilePage() {
  const params = useParams();

  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorker();
  }, []);

  const loadWorker = async () => {
    try {
      const workerId = params.id as string;
      const data = await getWorkerProfile(workerId);
      setWorker(data.worker);

      const reviewData = await getWorkerReviews(workerId);
      setReviews(reviewData.reviews || []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:shadow-black/20 dark:ring-neutral-800">
            <div className="animate-pulse">
              <div className="flex items-start gap-5">
                <div className="h-28 w-28 rounded-3xl bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-8 w-56 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-4 w-72 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-28 rounded-2xl bg-neutral-100 dark:bg-neutral-800" />
                ))}
              </div>

              <div className="mt-10 space-y-4">
                <div className="h-6 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-4 w-5/6 rounded bg-neutral-100 dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-black/20">
          <h1 className="text-2xl font-semibold text-neutral-950 dark:text-neutral-100">
            Worker not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            The profile you are looking for is unavailable or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
          <div className="h-28 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 sm:h-36" />

          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-6 sm:-mt-16 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <img
                    src={worker.profileImage || "/default-avatar.png"}
                    alt={worker.name}
                    className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-sm sm:h-32 sm:w-32 dark:border-neutral-900"
                  />
                  <div className="absolute -right-2 -top-2 rounded-full border-4 border-white bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm dark:border-neutral-900">
                    Active
                  </div>
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-neutral-100">
                      {worker.name}
                    </h1>
                    <StatusBadge label="Verified" tone="success" />
                  </div>

                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {worker.location || "Location not added"}
                  </p>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {worker.workerProfile?.title || "Professional worker profile"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <ActionButton label="Message" />
                <ActionButton label="Hire now" primary />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <StatCard
                label="Rating"
                value={`⭐ ${worker.workerProfile?.rating || 0}`}
              />
              <StatCard
                label="Reviews"
                value={String(worker.workerProfile?.totalReviews || reviews.length || 0)}
              />
              <StatCard
                label="Completed jobs"
                value={String(worker.workerProfile?.completedJobs || 0)}
              />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                About
              </h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                {worker.workerProfile?.bio || "No bio added yet."}
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                Skills
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {worker.workerProfile?.skills?.length ? (
                  worker.workerProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No skills added yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                  Reviews
                </h2>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {reviews.length} total
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center dark:border-neutral-700 dark:bg-neutral-950">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No reviews yet.
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => <ReviewCard key={review._id} review={review} />)
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">
                Worker details
              </h3>

              <div className="mt-4 space-y-4">
                <DetailRow
                  label="Experience"
                  value={`${worker.workerProfile?.experience || 0} years`}
                />
                <DetailRow
                  label="Hourly rate"
                  value={`₹${worker.workerProfile?.hourlyRate || 0}`}
                />
                <DetailRow
                  label="Availability"
                  value={worker.workerProfile?.availability || "Not set"}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-neutral-900 p-6 text-white shadow-sm dark:bg-white dark:text-neutral-900">
              <h3 className="text-lg font-semibold">Trust tip</h3>
              <p className="mt-2 text-sm leading-6 text-white/70 dark:text-neutral-600">
                Strong profiles with clear skills, pricing, and reviews help
                clients decide faster.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-5 dark:bg-neutral-800">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-950 dark:text-neutral-100">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
      <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="text-right text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "success" | "warning" | "neutral";
}) {
  const classes =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
      : tone === "warning"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
      : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

function ActionButton({
  label,
  primary = false,
}: {
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={
        primary
          ? "rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          : "rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      }
    >
      {label}
    </button>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-neutral-950 dark:text-neutral-100">
            {review.client.name}
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          ⭐ {review.rating}/5
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
        {review.comment}
      </p>
    </div>
  );
}