"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch (error) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      router.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-xl bg-neutral-200" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-32 rounded-3xl bg-neutral-200" />
            <div className="h-32 rounded-3xl bg-neutral-200" />
            <div className="h-32 rounded-3xl bg-neutral-200" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-80 rounded-3xl bg-neutral-200 lg:col-span-2" />
            <div className="h-80 rounded-3xl bg-neutral-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const profileProgress = user.isProfileCompleted ? 100 : 70;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-xl font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-sm text-neutral-500">Welcome back</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {user.name}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Manage your account, profile, and activity from one place.
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Account role</p>
            <p className="mt-2 text-2xl font-semibold capitalize">
              {user.role}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {user.role === "client"
                ? "You can post tasks and hire workers."
                : "You can find work and manage service requests."}
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Verification status</p>
            <p
              className={`mt-2 text-2xl font-semibold ${user.isVerified ? "text-emerald-600" : "text-amber-600"
                }`}
            >
              {user.isVerified ? "Verified" : "Pending"}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {user.isVerified
                ? "Your account is verified and trusted."
                : "Complete verification to build more trust."}
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-neutral-500">Profile completion</p>
            <p className="mt-2 text-2xl font-semibold">{profileProgress}%</p>
            <div className="mt-3 h-2 w-full rounded-full bg-neutral-200">
              <div
                className="h-2 rounded-full bg-neutral-900 transition-all"
                style={{ width: `${profileProgress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              {user.isProfileCompleted
                ? "Your profile is ready to use."
                : "Complete your profile to unlock better visibility."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Profile overview</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Your personal account details and status.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">Full name</p>
                <p className="mt-1 font-semibold text-neutral-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">Email address</p>
                <p className="mt-1 font-semibold text-neutral-900">
                  {user.email}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">Phone number</p>
                <p className="mt-1 font-semibold text-neutral-900">
                  {user.phone}
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">User ID</p>
                <p className="mt-1 break-all font-semibold text-neutral-900">
                  {user._id}
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Account status</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start justify-between gap-4 rounded-2xl bg-neutral-50 p-4">
                  <div>
                    <p className="font-medium text-neutral-900">Verified</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Identity and trust status
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isVerified
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {user.isVerified ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-2xl bg-neutral-50 p-4">
                  <div>
                    <p className="font-medium text-neutral-900">
                      Profile completed
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Setup and readiness status
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isProfileCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-neutral-200 text-neutral-700"
                      }`}
                  >
                    {user.isProfileCompleted ? "Complete" : "Incomplete"}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-200 bg-neutral-900 p-6 text-white shadow-sm">
              <h3 className="text-lg font-semibold">Next step</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {user.isProfileCompleted
                  ? "Your profile is complete. You can now continue using the platform."
                  : user.role === "worker"
                    ? "Add your skills, work details, and profile image to attract more clients."
                    : "Complete your account details so you can post tasks and manage hiring smoothly."}
              </p>

              <button
                className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                onClick={() => router.push("/profile")}
              >
                {user.isProfileCompleted ? "View Profile" : "Complete Profile"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}