import Link from "next/link";

export default function GuestLanding() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
              Trusted marketplace for local services
            </span>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              Hire reliable workers or find your next job with TaskHeroes
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
              Connect clients with skilled workers for home services like
              plumbing, electrical work, cleaning, painting, and repairs.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Create account
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="rounded-2xl bg-neutral-900 p-5 text-white">
                <p className="text-sm text-white/70">For clients</p>
                <h2 className="mt-2 text-xl font-semibold">
                  Post tasks and hire trusted workers
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-neutral-50 p-5">
                  <p className="text-sm text-neutral-500">For workers</p>
                  <p className="mt-2 font-semibold text-neutral-900">
                    Create your profile and get discovered
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-5">
                  <p className="text-sm text-neutral-500">For everyone</p>
                  <p className="mt-2 font-semibold text-neutral-900">
                    Build trust with clear profiles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}