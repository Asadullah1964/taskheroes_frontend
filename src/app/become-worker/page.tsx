"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface WorkerFormState {
  title: string;
  bio: string;
  skills: string;
  experience: string;
  hourlyRate: string;
  location: string;
}

export default function BecomeWorkerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<WorkerFormState>({
    title: "",
    bio: "",
    skills: "",
    experience: "",
    hourlyRate: "",
    location: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  }

  const parsedSkills = useMemo(() => {
    return form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [form.skills]);

  const validation = useMemo(() => {
    const errors: Partial<WorkerFormState> = {};

    if (!form.title.trim()) errors.title = "Profession is required.";
    if (!form.bio.trim() || form.bio.trim().length < 40) {
      errors.bio = "Bio should be at least 40 characters.";
    }
    if (parsedSkills.length < 2) {
      errors.skills = "Add at least 2 skills separated by commas.";
    }
    if (!form.experience || Number(form.experience) < 0) {
      errors.experience = "Enter valid years of experience.";
    }
    if (!form.hourlyRate || Number(form.hourlyRate) <= 0) {
      errors.hourlyRate = "Enter a valid hourly rate.";
    }
    if (!form.location.trim()) {
      errors.location = "Location is required.";
    }

    return errors;
  }, [form, parsedSkills]);

  const hasErrors = Object.keys(validation).length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (hasErrors) {
      setError("Please correct the highlighted fields before continuing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.put("/users/become-worker", {
        title: form.title.trim(),
        bio: form.bio.trim(),
        skills: parsedSkills,
        experience: Number(form.experience),
        hourlyRate: Number(form.hourlyRate),
        location: form.location.trim(),
      });

      router.replace("/dashboard");
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Failed to create worker profile."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mb-4 text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            ← Back to dashboard
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    Worker setup
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
                    Become a worker
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                    Create your professional profile so clients can discover
                    your skills, understand your experience, and trust you with
                    real work.
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {parsedSkills.length > 0
                    ? `${parsedSkills.length} skill${
                        parsedSkills.length > 1 ? "s" : ""
                      } added`
                    : "Add your first skill"}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <FormField
                  label="Profession"
                  htmlFor="title"
                  description="Choose the main service clients will hire you for."
                  error={validation.title}
                >
                  <input
                    id="title"
                    name="title"
                    placeholder="Electrician, Plumber, Cleaner, Painter"
                    value={form.title}
                    onChange={handleChange}
                    className={inputClass(!!validation.title)}
                    required
                  />
                </FormField>

                <FormField
                  label="Professional bio"
                  htmlFor="bio"
                  description="Write a short introduction about your work, experience, and strengths."
                  error={validation.bio}
                >
                  <textarea
                    id="bio"
                    rows={5}
                    name="bio"
                    placeholder="I am a reliable electrician with 5 years of experience in home wiring, repair, and installation work..."
                    value={form.bio}
                    onChange={handleChange}
                    className={`${inputClass(!!validation.bio)} resize-none`}
                    required
                  />
                </FormField>

                <FormField
                  label="Skills"
                  htmlFor="skills"
                  description="Separate each skill with a comma so clients can find you more easily."
                  error={validation.skills}
                >
                  <div className="space-y-3">
                    <input
                      id="skills"
                      name="skills"
                      placeholder="Electrician, Wiring, Switch Repair, Installation"
                      value={form.skills}
                      onChange={handleChange}
                      className={inputClass(!!validation.skills)}
                      required
                    />

                    {parsedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-800">
                        {parsedSkills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-neutral-900"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </FormField>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    label="Experience"
                    htmlFor="experience"
                    description="Add your total years of hands-on work."
                    error={validation.experience}
                  >
                    <input
                      id="experience"
                      type="number"
                      min="0"
                      name="experience"
                      placeholder="2"
                      value={form.experience}
                      onChange={handleChange}
                      className={inputClass(!!validation.experience)}
                      required
                    />
                  </FormField>

                  <FormField
                    label="Hourly rate"
                    htmlFor="hourlyRate"
                    description="Set a clear starting price in rupees."
                    error={validation.hourlyRate}
                  >
                    <input
                      id="hourlyRate"
                      type="number"
                      min="1"
                      name="hourlyRate"
                      placeholder="500"
                      value={form.hourlyRate}
                      onChange={handleChange}
                      className={inputClass(!!validation.hourlyRate)}
                      required
                    />
                  </FormField>
                </div>

                <FormField
                  label="Location"
                  htmlFor="location"
                  description="Add your city, area, or service region."
                  error={validation.location}
                >
                  <input
                    id="location"
                    name="location"
                    placeholder="Mumbai, Maharashtra"
                    value={form.location}
                    onChange={handleChange}
                    className={inputClass(!!validation.location)}
                    required
                  />
                </FormField>

                {error && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:w-auto"
                  >
                    {loading ? "Creating profile..." : "Become a worker"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">
                Strong profile checklist
              </h2>

              <div className="mt-4 space-y-3">
                <ChecklistItem
                  label="Profession added"
                  done={!!form.title.trim()}
                />
                <ChecklistItem
                  label="Detailed bio written"
                  done={form.bio.trim().length >= 40}
                />
                <ChecklistItem
                  label="At least 2 skills added"
                  done={parsedSkills.length >= 2}
                />
                <ChecklistItem
                  label="Experience added"
                  done={!!form.experience && Number(form.experience) >= 0}
                />
                <ChecklistItem
                  label="Pricing added"
                  done={!!form.hourlyRate && Number(form.hourlyRate) > 0}
                />
                <ChecklistItem
                  label="Location added"
                  done={!!form.location.trim()}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-neutral-900 p-6 text-white shadow-sm dark:bg-white dark:text-neutral-900">
              <h2 className="text-lg font-semibold">What clients look for</h2>
              <p className="mt-2 text-sm leading-6 text-white/70 dark:text-neutral-600">
                Clients trust profiles that clearly explain the service, show
                real skills, include pricing, and mention location and
                experience.
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20">
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">
                Example profession titles
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Electrician",
                  "Plumber",
                  "Painter",
                  "Cleaner",
                  "Carpenter",
                  "AC Technician",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  htmlFor,
  description,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200"
      >
        {label}
      </label>

      {description && (
        <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}

      {children}

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function ChecklistItem({
  label,
  done,
}: {
  label: string;
  done: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          done
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
        }`}
      >
        {done ? "Done" : "Pending"}
      </span>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 ${
    hasError
      ? "border-red-300 ring-4 ring-red-100 focus:border-red-400 dark:border-red-500/40 dark:ring-red-500/10"
      : "border-neutral-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10 dark:border-neutral-700 dark:focus:border-neutral-400 dark:focus:ring-white/10"
  }`;
}