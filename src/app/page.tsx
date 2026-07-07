"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-10 xl:px-16">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Trusted marketplace for local services
            </div>

            <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-neutral-950 sm:text-6xl">
              Hire reliable workers or find your next job with TaskHeroes
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
              TaskHeroes connects clients with skilled workers for everyday
              services like plumbing, electrical work, cleaning, painting, and
              home repairs through a simple and trusted platform.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Create account
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Login
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-neutral-500">For clients</p>
                <p className="mt-1 font-semibold text-neutral-900">
                  Post tasks fast
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-neutral-500">For workers</p>
                <p className="mt-1 font-semibold text-neutral-900">
                  Get discovered
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-neutral-500">For both</p>
                <p className="mt-1 font-semibold text-neutral-900">
                  Build trusted profiles
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-neutral-200 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="grid gap-4">
                <div className="rounded-3xl bg-neutral-900 p-6 text-white">
                  <p className="text-sm text-white/70">Book trusted help</p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">
                    Find skilled workers for home and business tasks
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "Plumber",
                      "Electrician",
                      "Cleaner",
                      "Painter",
                      "Carpenter",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/85"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <p className="text-sm text-neutral-500">Client journey</p>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                      Post a requirement and hire with confidence
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Share your task, compare workers, and choose the right
                      fit.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <p className="text-sm text-neutral-500">Worker journey</p>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                      Showcase skills and start earning
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      Create your profile, highlight expertise, and receive
                      work opportunities.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <p className="text-sm text-neutral-500">Why TaskHeroes</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-neutral-50 p-4">
                      <p className="font-medium text-neutral-900">
                        Easy onboarding
                      </p>
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-4">
                      <p className="font-medium text-neutral-900">
                        Trusted profiles
                      </p>
                    </div>
                    <div className="rounded-2xl bg-neutral-50 p-4">
                      <p className="font-medium text-neutral-900">
                        Faster hiring
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-neutral-300/30 blur-3xl" />
          </div>
        </div>
      </section>
    </main>
  );
}