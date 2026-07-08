"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import ClientDashboard from "./ClientDashboard";
import WorkerDashboard from "./WorkerDashboard";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "client" | "worker";
  profileImage: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const logout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await api.post("/auth/logout");
      router.replace("/login");
    } catch (error) {
      console.log(error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <main
        className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8"
        aria-busy="true"
      >
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-xl bg-neutral-200" />
          <div className="h-28 rounded-3xl bg-neutral-200" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-3xl bg-neutral-200 lg:col-span-2" />
            <div className="h-96 rounded-3xl bg-neutral-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.name} profile`}
                  className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-xl font-semibold text-white sm:h-20 sm:w-20 sm:text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-sm text-neutral-500">Dashboard</p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome, {user.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium capitalize text-white">
                    {user.role}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${user.isVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {user.isVerified ? "Verified" : "Not verified"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${user.isProfileCompleted
                        ? "bg-blue-100 text-blue-700"
                        : "bg-neutral-200 text-neutral-700"
                      }`}
                  >
                    {user.isProfileCompleted
                      ? "Profile complete"
                      : "Profile incomplete"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Edit profile
              </button>

              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </header>

        <section>
          {user.role === "client" ? (
            <ClientDashboard user={user} />
          ) : (
            <WorkerDashboard user={user} />
          )}
        </section>
      </div>
    </main>
  );
}