"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Save, BriefcaseBusiness, IndianRupee } from "lucide-react";

import { getTaskById, updateTask } from "@/services/task";

const categories = [
  "Cleaning",
  "Delivery",
  "Electrical",
  "Plumbing",
  "Moving",
  "Tutoring",
  "Painting",
  "Other",
];

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Cleaning",
    budget: "",
    location: "",
    deadline: "",
  });

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getTaskById(id);
      const task = data.task;

      setFormData({
        title: task.title ?? "",
        description: task.description ?? "",
        category: task.category ?? "Cleaning",
        budget: task.budget ? String(task.budget) : "",
        location: task.location ?? "",
        deadline: task.deadline ? task.deadline.split("T")[0] : "",
      });
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || "Unable to load task details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setErrorMessage("");
    setSuccessMessage("");

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isFormValid = useMemo(() => {
    return (
      formData.title.trim() &&
      formData.description.trim() &&
      formData.category.trim() &&
      formData.budget.trim() &&
      Number(formData.budget) > 0 &&
      formData.location.trim() &&
      formData.deadline.trim()
    );
  }, [formData]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setSaving(true);

      await updateTask(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        budget: Number(formData.budget),
        location: formData.location.trim(),
        deadline: formData.deadline,
      });

      setSuccessMessage("Task updated successfully.");

      setTimeout(() => {
        router.push(`/tasks/${id}`);
      }, 600);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || "Unable to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-neutral-200" />
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
              <div className="h-8 w-48 rounded bg-neutral-200" />
              <div className="mt-3 h-4 w-80 rounded bg-neutral-200" />
              <div className="mt-8 space-y-5">
                <div className="h-12 rounded-xl bg-neutral-100" />
                <div className="h-32 rounded-xl bg-neutral-100" />
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="h-12 rounded-xl bg-neutral-100" />
                  <div className="h-12 rounded-xl bg-neutral-100" />
                  <div className="h-12 rounded-xl bg-neutral-100" />
                  <div className="h-12 rounded-xl bg-neutral-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <Link
          href={`/tasks/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to task
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="border-b border-neutral-200 pb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
                Edit Task
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                Update the task details so workers can clearly understand the work,
                budget, location, and deadline before applying.
              </p>
            </div>

            {errorMessage ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <form onSubmit={submitHandler} className="mt-8 space-y-6">
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
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a clear task title"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  required
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
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the task, expectations, materials, timing, and any important instructions"
                  className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
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
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                  >
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
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                      ₹
                    </span>
                    <input
                      id="budget"
                      type="number"
                      min="1"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Enter budget"
                      className="w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                      required
                    />
                  </div>
                </div>

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
                    placeholder="Enter task location"
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                    required
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
                    className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href={`/tasks/${id}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={!isFormValid || saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Updating..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                Editing tips
              </h2>

              <div className="mt-5 space-y-4 text-sm text-neutral-600">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <div className="flex items-start gap-3">
                    <BriefcaseBusiness className="mt-0.5 h-4 w-4 text-neutral-500" />
                    <div>
                      <p className="font-medium text-neutral-900">Be specific</p>
                      <p className="mt-1">
                        A clear task title and description help workers understand the scope quickly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <div className="flex items-start gap-3">
                    <IndianRupee className="mt-0.5 h-4 w-4 text-neutral-500" />
                    <div>
                      <p className="font-medium text-neutral-900">Set a fair budget</p>
                      <p className="mt-1">
                        A realistic budget usually attracts better and faster applications.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-neutral-500" />
                    <div>
                      <p className="font-medium text-neutral-900">Use clear location details</p>
                      <p className="mt-1">
                        Mention the exact area so nearby workers can decide faster.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-neutral-500" />
                    <div>
                      <p className="font-medium text-neutral-900">Keep deadlines realistic</p>
                      <p className="mt-1">
                        A clear and achievable deadline improves trust and response quality.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}