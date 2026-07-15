"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTask } from "@/services/task";

const categories = [
  "Cleaning",
  "Delivery",
  "Plumbing",
  "Electrical",
  "Painting",
  "Gardening",
  "Moving",
  "Tutoring",
  "Computer Repair",
  "Home Repair",
  "Other",
];

export default function CreateTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextUrl = searchParams.get("next");

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    location: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(nextUrl || "/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createTask({
        ...formData,
        budget: Number(formData.budget),
        deadline: new Date(formData.deadline).toISOString(),
      });

      setSuccess("Task created successfully.");

      if (nextUrl) {
        router.replace(nextUrl);
        return;
      }

      if (window.history.length > 1) {
        router.back();
        return;
      }

      router.replace("/dashboard");
    } catch (error: any) {
      console.error(error);
      setError(error?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-neutral-200 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-200 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-sm text-neutral-600">
                  New task
                </span>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
                  Create a new task
                </h1>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Add clear details so workers can understand the job, budget, and deadline quickly.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8">
            <div className="grid gap-5">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Task title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Need a plumber to fix kitchen sink leak"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the work, preferred timing, materials, or any important instructions."
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Budget
                  </label>
                  <input
                    id="budget"
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Enter your budget"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Andheri West, Mumbai"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="deadline"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Deadline
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    min={today}
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating task..." : "Create task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}