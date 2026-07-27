"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "worker";
  profileImage: string;
  location: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  workerProfile: WorkerProfile | null;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await api.get("/users/me");
      setUser(res.data.data);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) return null;

  const profileCompletion = getProfileCompletion(user);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <div className="h-28 bg-neutral-900 sm:h-36 dark:bg-neutral-800" />

              <div className="px-6 pb-6">
                <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-sm sm:h-32 sm:w-32 dark:border-neutral-900"
                      />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white bg-neutral-900 text-4xl font-semibold text-white shadow-sm sm:h-32 sm:w-32 dark:border-neutral-900 dark:bg-white dark:text-neutral-900">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="pt-2 sm:pb-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                          {user.name}
                        </h1>

                        <StatusBadge
                          label={user.role}
                          tone="dark"
                        />

                        <StatusBadge
                          label={user.isVerified ? "Verified" : "Unverified"}
                          tone={user.isVerified ? "success" : "warning"}
                        />
                      </div>

                      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        {user.email}
                      </p>

                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {user.location || "Location not added"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                  >
                    Edit profile
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <MiniStat
                    label="Profile status"
                    value={user.isProfileCompleted ? "Complete" : "Incomplete"}
                  />
                  <MiniStat
                    label="Account type"
                    value={capitalize(user.role)}
                  />
                  <MiniStat
                    label="Phone"
                    value={user.phone || "Not added"}
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Profile completion
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {profileCompletion}%
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className="h-2 rounded-full bg-neutral-900 transition-all dark:bg-white"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                Account information
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Your personal information used across TaskHeroes.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard label="Full name" value={user.name} />
                <InfoCard label="Email" value={user.email} />
                <InfoCard label="Phone" value={user.phone || "Not added"} />
                <InfoCard label="Location" value={user.location || "Not added"} />
                <InfoCard label="Verification" value={user.isVerified ? "Yes" : "No"} />
                <InfoCard
                  label="Profile status"
                  value={user.isProfileCompleted ? "Completed" : "Incomplete"}
                />
              </div>
            </div>

            {user.role === "worker" && (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                      Worker information
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                      Your public professional details shown to clients.
                    </p>
                  </div>

                  <StatusBadge
                    label={user.workerProfile?.availability || "Not set"}
                    tone={getAvailabilityTone(user.workerProfile?.availability)}
                  />
                </div>

                {user.workerProfile ? (
                  <>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <InfoCard
                        label="Professional title"
                        value={user.workerProfile.title || "Not added"}
                      />
                      <InfoCard
                        label="Experience"
                        value={`${user.workerProfile.experience || 0} years`}
                      />
                      <InfoCard
                        label="Hourly rate"
                        value={`₹${user.workerProfile.hourlyRate || 0}`}
                      />
                      <InfoCard
                        label="Completed jobs"
                        value={String(user.workerProfile.completedJobs || 0)}
                      />
                      <InfoCard
                        label="Rating"
                        value={
                          user.workerProfile.rating
                            ? `${user.workerProfile.rating.toFixed(1)}/5`
                            : "No ratings"
                        }
                      />
                      <InfoCard
                        label="Work location"
                        value={
                          user.workerProfile.location ||
                          user.location ||
                          "Not added"
                        }
                      />
                    </div>

                    <div className="mt-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Bio
                      </p>
                      <p className="mt-2 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                        {user.workerProfile.bio || "No bio added yet."}
                      </p>
                    </div>

                    <div className="mt-4 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Skills
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {user.workerProfile.skills?.length > 0 ? (
                          user.workerProfile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-neutral-900"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            No skills added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-950">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Complete your worker profile
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      Add your title, bio, pricing, experience, and skills so
                      clients can trust and hire you more easily.
                    </p>

                    <button
                      onClick={() => router.push("/profile/edit")}
                      className="mt-4 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                      Add worker details
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">
                Quick actions
              </h3>

              <div className="mt-4 space-y-3">
                <ActionButton
                  label="Edit profile"
                  onClick={() => router.push("/profile/edit")}
                  primary
                />

                {user.role === "client" && (
                  <ActionButton
                    label="Become worker"
                    onClick={() => router.push("/become-worker")}
                  />
                )}

                <ActionButton
                  label="Go to dashboard"
                  onClick={() => router.push("/dashboard")}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-neutral-900 p-6 text-white shadow-sm dark:bg-white dark:text-neutral-900">
              <h3 className="text-lg font-semibold">Profile tip</h3>
              <p className="mt-2 text-sm leading-6 text-white/70 dark:text-neutral-600">
                Profiles with complete identity details and clear professional
                information are easier to trust and easier to act on.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">
                Account status
              </h3>

              <div className="mt-4 space-y-4">
                <StatusRow
                  label="Verification"
                  value={user.isVerified ? "Verified" : "Pending"}
                />
                <StatusRow
                  label="Profile"
                  value={user.isProfileCompleted ? "Complete" : "Incomplete"}
                />
                <StatusRow label="Role" value={capitalize(user.role)} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function getProfileCompletion(user: User) {
  let score = 0;

  if (user.name) score += 15;
  if (user.email) score += 15;
  if (user.phone) score += 10;
  if (user.location) score += 10;
  if (user.profileImage) score += 10;
  if (user.isVerified) score += 10;

  if (user.role === "worker" && user.workerProfile) {
    if (user.workerProfile.title) score += 10;
    if (user.workerProfile.bio) score += 10;
    if (user.workerProfile.skills?.length > 0) score += 5;
    if (user.workerProfile.hourlyRate) score += 5;
  } else {
    if (user.isProfileCompleted) score += 15;
  }

  return Math.min(score, 100);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getAvailabilityTone(availability?: string) {
  if (availability === "Available") return "success";
  if (availability === "Busy") return "warning";
  return "neutral";
}

function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "success" | "warning" | "neutral" | "dark";
}) {
  const classes =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
      : tone === "warning"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
        : tone === "dark"
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${classes}`}>
      {label}
    </span>
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
    <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-1 break-words font-semibold text-neutral-900 dark:text-neutral-100">
        {value}
      </p>
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
    <div className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-neutral-950 dark:text-neutral-100">
        {value}
      </p>
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
          ? "w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          : "w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      }
    >
      {label}
    </button>
  );
}

function StatusRow({
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

function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <div className="h-28 animate-pulse bg-neutral-200 sm:h-36 dark:bg-neutral-800" />
              <div className="px-6 pb-6">
                <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="h-28 w-28 animate-pulse rounded-3xl border-4 border-white bg-neutral-200 sm:h-32 sm:w-32 dark:border-neutral-900 dark:bg-neutral-800" />
                    <div className="space-y-3 pt-2 sm:pb-2">
                      <div className="h-8 w-48 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-4 w-64 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-4 w-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                  </div>
                  <div className="h-12 w-32 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800"
                    >
                      <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                      <div className="mt-3 h-6 w-28 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                  <div className="mb-3 h-4 w-40 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-2 w-full animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
                </div>
              </div>
            </div>

            {[1, 2].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20"
              >
                <div className="h-7 w-52 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-3 h-4 w-72 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[1, 2, 3, 4].map((card) => (
                    <div
                      key={card}
                      className="rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800"
                    >
                      <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                      <div className="mt-3 h-5 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20"
              >
                <div className="h-6 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-4 space-y-3">
                  <div className="h-11 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-11 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-11 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}