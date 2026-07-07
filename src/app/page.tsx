"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-4xl font-bold text-gray-900">
          TaskHeroes
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Connect Clients with Skilled Workers
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold transition hover:bg-gray-100"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8 border-t pt-6">
          <h2 className="mb-3 text-lg font-semibold">
            Continue as
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <h3 className="font-semibold">Client</h3>
              <p className="mt-2 text-sm text-gray-500">
                Post tasks and hire workers.
              </p>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <h3 className="font-semibold">Worker</h3>
              <p className="mt-2 text-sm text-gray-500">
                Find jobs and earn money.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}