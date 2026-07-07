"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "client",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoleSelect = (role: "client" | "worker") => {
        setFormData((prev) => ({ ...prev, role }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const res = await api.post("/auth/register", formData);
            alert(res.data.message);
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 text-neutral-900">
            <div className="grid min-h-screen lg:grid-cols-2">
                <section className="hidden lg:flex flex-col justify-between bg-neutral-900 text-white p-10 xl:p-14">
                    <div>
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            TaskHeroes
                        </div>

                        <div className="mt-16 max-w-xl">
                            <h1 className="text-4xl font-semibold leading-tight">
                                Join a trusted network for hiring skilled workers and finding
                                quality jobs.
                            </h1>
                            <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                                Create your account to connect clients with reliable
                                professionals across plumbing, electrical, cleaning, painting,
                                carpentry, and more.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-white/60">Fast onboarding</p>
                            <p className="mt-2 text-lg font-medium">Simple registration</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-white/60">Verified profiles</p>
                            <p className="mt-2 text-lg font-medium">Build trust quickly</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                            <p className="text-sm text-white/60">Two user types</p>
                            <p className="mt-2 text-lg font-medium">Clients and workers</p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
                    <div className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-8">
                        <div className="mb-8">
                            <div className="lg:hidden inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                TaskHeroes
                            </div>

                            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                                Create your account
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-neutral-500">
                                Register as a client to hire professionals or as a worker to
                                get discovered for jobs.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Register as
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleRoleSelect("client")}
                                        className={`rounded-2xl border p-4 text-left transition ${formData.role === "client"
                                            ? "border-neutral-900 bg-neutral-900 text-white"
                                            : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                                            }`}
                                    >
                                        <p className="text-sm font-semibold">Client</p>
                                        <p
                                            className={`mt-1 text-xs ${formData.role === "client"
                                                ? "text-white/70"
                                                : "text-neutral-500"
                                                }`}
                                        >
                                            Post work and hire trusted workers
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleRoleSelect("worker")}
                                        className={`rounded-2xl border p-4 text-left transition ${formData.role === "worker"
                                            ? "border-neutral-900 bg-neutral-900 text-white"
                                            : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400"
                                            }`}
                                    >
                                        <p className="text-sm font-semibold">Worker</p>
                                        <p
                                            className={`mt-1 text-xs ${formData.role === "worker"
                                                ? "text-white/70"
                                                : "text-neutral-500"
                                                }`}
                                        >
                                            Showcase skills and receive job requests
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-5">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        onChange={handleChange}
                                        value={formData.name}
                                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                                        required
                                    />
                                </div>

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
                                        onChange={handleChange}
                                        value={formData.email}
                                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Phone number
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        onChange={handleChange}
                                        value={formData.phone}
                                        className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-neutral-700"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Create a strong password"
                                            onChange={handleChange}
                                            value={formData.password}
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
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating account..." : "Create account"}
                            </button>

                            <p className="text-center text-sm text-neutral-500">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="font-medium text-neutral-900 underline underline-offset-4"
                                >
                                    Sign in
                                </a>
                            </p>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
}