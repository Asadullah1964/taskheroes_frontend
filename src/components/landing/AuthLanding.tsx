import Link from "next/link";
import BrowseTasks from "../tasks/BrowseTask";
import Navbar from "../navbar/Navbar";

type AuthLandingProps = {
  user?: {
    name?: string;
    role?: "client" | "worker" | "admin";
  };
};

export default function AuthLanding({ user }: AuthLandingProps) {
  const isWorker = user?.role === "worker";

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <section className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </span>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
                {isWorker
                  ? "Browse tasks and grow your worker profile"
                  : "Manage your tasks and discover service activity"}
              </h1>

              <p className="mt-3 text-base leading-7 text-neutral-600 dark:text-neutral-400">
                {isWorker
                  ? "Explore open tasks, apply quickly, and keep your profile visible to more clients."
                  : "Review your posted tasks, manage ongoing work, and browse what is happening across the platform."}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Go to dashboard
                </Link>

                <Link
                  href={isWorker ? "/worker/profile" : "/profile"}
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  View profile
                </Link>

                {!isWorker && (
                  <Link
                    href="/tasks/create"
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Create task
                  </Link>
                )}
              </div>
            </div>

            <div className="grid w-full gap-4 sm:grid-cols-3 lg:max-w-2xl">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {isWorker ? "Open opportunities" : "Your workspace"}
                </p>
                <p className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {isWorker ? "Browse available work" : "Manage posted tasks"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {isWorker ? "Profile strength" : "Task management"}
                </p>
                <p className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {isWorker ? "Stay visible to clients" : "Track updates easily"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {isWorker ? "Applications" : "Hiring flow"}
                </p>
                <p className="mt-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {isWorker ? "Apply with confidence" : "Review workers faster"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Marketplace activity
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-white">
              Browse Tasks
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              View open tasks across the platform and take the next action based
              on your role.
            </p>
          </div>
        </div>

        <BrowseTasks />
      </section>
    </main>
  );
}