"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      alert(res.data.message);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      const res = await api.post("/auth/google", {
        token: credential,
      });

      alert(res.data.message);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Google Login Failed");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between bg-neutral-900 p-10 text-white xl:p-14">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              TaskHeroes
            </div>

            <div className="mt-16 max-w-xl">
              <h1 className="text-4xl font-semibold leading-tight">
                Welcome back to your trusted worker and client network.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                Sign in to manage bookings, connect with professionals, track
                job activity, and keep your service marketplace moving.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/60">Secure access</p>
              <p className="mt-2 text-lg font-medium">Email or Google sign-in</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/60">Easy management</p>
              <p className="mt-2 text-lg font-medium">Track jobs and requests</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/60">Built for trust</p>
              <p className="mt-2 text-lg font-medium">Clients and workers</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-8">
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-700 lg:hidden">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                TaskHeroes
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Login to your account
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Enter your credentials to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-20 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-neutral-200" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            <div className="flex justify-center">
              <div className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      if (credentialResponse.credential) {
                        handleGoogleLogin(credentialResponse.credential);
                      }
                    }}
                    onError={() => {
                      alert("Google Login Failed");
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="font-medium text-neutral-900 underline underline-offset-4"
              >
                Register
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}