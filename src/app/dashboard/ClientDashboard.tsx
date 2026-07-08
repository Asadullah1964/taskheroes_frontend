"use client";

import { useRouter } from "next/navigation";

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

export default function ClientDashboard({
  user,
}: ClientDashboardProps) {
  const router = useRouter();

  const profileProgress = user.isProfileCompleted ? 100 : 65;

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Profile status"
          value={user.isProfileCompleted ? "Complete" : "Incomplete"}
          hint="Finish your account details for smoother hiring."
          tone={user.isProfileCompleted ? "success" : "warning"}
        />

        <DashboardCard
          title="Verification"
          value={user.isVerified ? "Verified" : "Pending"}
          hint="Verified accounts build more trust with workers."
          tone={user.isVerified ? "success" : "warning"}
        />

        <DashboardCard
          title="Account type"
          value="Client"
          hint="You can post tasks and hire skilled workers."
        />

        <DashboardCard
          title="Location"
          value={user.location || "Not added"}
          hint="Location helps match you with nearby workers."
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Account overview
                </h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Keep your personal details updated so hiring and communication
                  stay simple.
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
              <InfoCard label="Full name" value={user.name} />
              <InfoCard label="Email" value={user.email} />
              <InfoCard
                label="Phone"
                value={user.phone || "Add phone number"}
              />
              <InfoCard
                label="Location"
                value={user.location || "Add your location"}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Get started</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Your client dashboard will later show posted tasks, worker
              responses, and hiring activity. For now, these are the best next
              steps to prepare your account.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ActionCard
                title="Complete profile"
                description="Add your basic details to make your account ready for task posting."
                buttonLabel="View profile"
                onClick={() => router.push("/profile")}
                primary
              />

              <ActionCard
                title="Become a worker"
                description="Offer your own services and receive work requests through TaskHeroes."
                buttonLabel="Become worker"
                onClick={() => router.push("/become-worker")}
              />

              <ActionCard
                title="Post task"
                description="Task posting will be available soon. This section will become your hiring workspace."
                buttonLabel="Coming soon"
                disabled
              />
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Profile readiness</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              A complete and trusted profile makes communication faster when you
              start hiring workers.
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

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MiniStat
                label="Profile"
                value={user.isProfileCompleted ? "Ready" : "Needs work"}
              />
              <MiniStat
                label="Trust"
                value={user.isVerified ? "Verified" : "Pending"}
              />
              <MiniStat
                label="Role"
                value="Client"
              />
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

              {!user.isVerified && (
                <ActionButton
                  label="Verify account"
                  onClick={() => router.push("/profile")}
                />
              )}

              <ActionButton
                label="Become a worker"
                onClick={() => router.push("/become-worker")}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-neutral-900 p-6 text-white shadow-sm">
            <h3 className="text-lg font-semibold">Hiring tip</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">
              When task posting is live, clear profile details and location
              information will help workers respond with more confidence.
            </p>

            <button
              onClick={() => router.push("/profile")}
              className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Update account
            </button>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Account details</h3>
            <div className="mt-4 space-y-4">
              <StatusRow label="Email" value={user.email} />
              <StatusRow
                label="Phone"
                value={user.phone || "Not added"}
              />
              <StatusRow
                label="Profile"
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
  tone?: "default" | "success" | "warning";
}) {
  const toneClasses =
    tone === "success"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warning"
      ? "bg-amber-50 text-amber-700"
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
      <p className="mt-1 break-all font-semibold text-neutral-900">{value}</p>
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

function ActionCard({
  title,
  description,
  buttonLabel,
  onClick,
  primary = false,
  disabled = false,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-5">
      <h4 className="text-lg font-semibold text-neutral-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>

      <button
        onClick={onClick}
        disabled={disabled}
        className={
          primary
            ? "mt-5 w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            : "mt-5 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
        }
      >
        {buttonLabel}
      </button>
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
      <span className="break-all text-right text-sm font-medium text-neutral-900">
        {value}
      </span>
    </div>
  );
}