"use client";

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

interface WorkerDashboardProps {
  user: DashboardUser;
}

export default function WorkerDashboard({
  user,
}: WorkerDashboardProps) {
  const router = useRouter();

  const worker = user.workerProfile ?? null;

  const profileProgress = user.isProfileCompleted
    ? 100
    : worker?.title || worker?.bio || (worker?.skills?.length ?? 0) > 0
    ? 70
    : 35;

  const availability = worker?.availability || "Available";
  const completedJobs = worker?.completedJobs ?? 0;
  const rating = worker?.rating ?? 0;
  const hourlyRate = worker?.hourlyRate ?? 0;
  const experience = worker?.experience ?? 0;
  const skills = worker?.skills ?? [];

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Availability"
          value={availability}
          hint="Current work status"
          tone={
            availability === "Available"
              ? "success"
              : availability === "Busy"
              ? "warning"
              : "neutral"
          }
        />

        <DashboardCard
          title="Completed jobs"
          value={String(completedJobs)}
          hint="Jobs finished successfully"
        />

        <DashboardCard
          title="Rating"
          value={rating ? `${rating.toFixed(1)}/5` : "No ratings"}
          hint="Average client feedback"
        />

        <DashboardCard
          title="Hourly rate"
          value={`₹${hourlyRate}`}
          hint="Current service pricing"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Worker profile
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  This is the professional information clients will see before
                  they hire you.
                </p>
              </div>

              <button
                onClick={() => router.push("/profile")}
                className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Edit profile
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard
                label="Professional title"
                value={worker?.title || "Add your title"}
              />

              <InfoCard
                label="Work location"
                value={worker?.location || user.location || "Add location"}
              />

              <InfoCard
                label="Experience"
                value={`${experience} year${experience === 1 ? "" : "s"}`}
              />

              <InfoCard
                label="Availability"
                value={availability}
              />

              <InfoCard
                label="Phone"
                value={user.phone || "Add phone number"}
              />

              <InfoCard
                label="Verification"
                value={user.isVerified ? "Verified" : "Pending verification"}
              />
            </div>

            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Bio</p>
              <p className="mt-2 text-sm leading-7 text-neutral-700">
                {worker?.bio ||
                  "Add a short bio describing your services, experience, and why clients should choose you."}
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Skills</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-neutral-600">
                    Add your skills so clients can discover you faster.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Work summary</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              A quick overview of your profile strength and marketplace
              readiness.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MiniStat
                label="Profile progress"
                value={`${profileProgress}%`}
              />
              <MiniStat
                label="Skills added"
                value={String(skills.length)}
              />
              <MiniStat
                label="Client rating"
                value={rating ? rating.toFixed(1) : "0.0"}
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-neutral-500">Completion status</span>
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
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Next actions</h3>
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
            </div>
          </div>

          <div className="rounded-3xl bg-neutral-900 p-6 text-white shadow-sm">
            <h3 className="text-lg font-semibold">Visibility tip</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Workers with a clear title, strong bio, skills, pricing, and
              availability are easier for clients to trust and shortlist.
            </p>

            <button
              onClick={() => router.push("/profile")}
              className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Improve profile
            </button>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Account details</h3>
            <div className="mt-4 space-y-4">
              <StatusRow
                label="Email"
                value={user.email}
              />
              <StatusRow
                label="Phone"
                value={user.phone || "Not added"}
              />
              <StatusRow
                label="Profile status"
                value={user.isProfileCompleted ? "Complete" : "Incomplete"}
              />
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
  tone?: "default" | "success" | "warning" | "neutral";
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700"
      : tone === "neutral"
      ? "bg-neutral-100 text-neutral-700"
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

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-50 px-4 py-3">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-medium text-neutral-900 text-right break-all">
        {value}
      </span>
    </div>
  );
}