"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";

interface FormState {
    name: string;
    phone: string;
    location: string;
}

export default function EditProfilePage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [form, setForm] = useState<FormState>({
        name: "",
        phone: "",
        location: "",
    });
    const [initialForm, setInitialForm] = useState<FormState>({
        name: "",
        phone: "",
        location: "",
    });
    const [initialImage, setInitialImage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await api.get("/users/me");
            const user = res.data.data;

            const nextForm = {
                name: user.name || "",
                phone: user.phone || "",
                location: user.location || "",
            };

            setForm(nextForm);
            setInitialForm(nextForm);
            setProfileImage(user.profileImage || "");
            setInitialImage(user.profileImage || "");
        } catch {
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (error) setError("");
        if (success) setSuccess("");
    }

    const isDirty = useMemo(() => {
        return (
            form.name !== initialForm.name ||
            form.phone !== initialForm.phone ||
            form.location !== initialForm.location ||
            profileImage !== initialImage
        );
    }, [form, initialForm, profileImage, initialImage]);

    const validation = useMemo(() => {
        const errors: Partial<FormState> = {};

        if (!form.name.trim()) {
            errors.name = "Full name is required.";
        }

        if (form.phone && form.phone.trim().length < 10) {
            errors.phone = "Phone number should be at least 10 digits.";
        }

        if (!form.location.trim()) {
            errors.location = "Location is required.";
        }

        return errors;
    }, [form]);

    const hasErrors = Object.keys(validation).length > 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (hasErrors) {
            setError("Please correct the highlighted fields.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await api.put("/users/profile", {
                ...form,
                name: form.name.trim(),
                phone: form.phone.trim(),
                location: form.location.trim(),
                profileImage,
            });

            setInitialForm(form);
            setInitialImage(profileImage);
            setSuccess("Profile updated successfully.");

            setTimeout(() => {
                router.push("/profile");
            }, 700);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        if (isDirty) {
            const confirmed = window.confirm(
                "You have unsaved changes. Discard them and leave this page?"
            );

            if (!confirmed) return;
        }

        router.push("/profile");
    }

    if (loading) {
        return <EditProfileSkeleton />;
    }

    return (
        <main className="min-h-screen bg-neutral-50">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => router.push("/profile")}
                        className="mb-4 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
                    >
                        ← Back to profile
                    </button>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
                                Edit profile
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-neutral-500">
                                Update your personal details, profile image, and location so
                                your account stays accurate and trusted.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm ring-1 ring-neutral-200">
                            {isDirty ? "You have unsaved changes" : "All changes saved"}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="space-y-6 lg:col-span-2">
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
                        >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-semibold text-neutral-950">
                                    Personal information
                                </h2>
                                <p className="text-sm leading-6 text-neutral-500">
                                    These details appear in your account and help people identify
                                    and contact you.
                                </p>
                            </div>

                            <div className="mt-8">
                                <ProfileImageUploader
                                    image={profileImage}
                                    onUploaded={(url) => {
                                        setProfileImage(url);
                                        if (error) setError("");
                                        if (success) setSuccess("");
                                    }}
                                />
                            </div>

                            <div className="mt-8 grid gap-6">
                                <FormField
                                    label="Full name"
                                    htmlFor="name"
                                    error={validation.name}
                                    description="Use your real name so your account looks trustworthy."
                                >
                                    <input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className={inputClass(!!validation.name)}
                                    />
                                </FormField>

                                <FormField
                                    label="Phone"
                                    htmlFor="phone"
                                    error={validation.phone}
                                    description="Add a working phone number for smoother coordination."
                                >
                                    <input
                                        id="phone"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className={inputClass(!!validation.phone)}
                                    />
                                </FormField>

                                <FormField
                                    label="Location"
                                    htmlFor="location"
                                    error={validation.location}
                                    description="Your city or area helps improve trust and local matching."
                                >
                                    <input
                                        id="location"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        placeholder="Enter your location"
                                        className={inputClass(!!validation.location)}
                                    />
                                </FormField>
                            </div>

                            {(error || success) && (
                                <div
                                    className={`mt-6 rounded-2xl px-4 py-3 text-sm ${error
                                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                        }`}
                                >
                                    {error || success}
                                </div>
                            )}

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving changes..." : "Save changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-neutral-950">
                                Profile checklist
                            </h3>

                            <div className="mt-4 space-y-3">
                                <ChecklistItem
                                    label="Profile image added"
                                    done={!!profileImage}
                                />
                                <ChecklistItem
                                    label="Full name added"
                                    done={!!form.name.trim()}
                                />
                                <ChecklistItem
                                    label="Phone added"
                                    done={!!form.phone.trim()}
                                />
                                <ChecklistItem
                                    label="Location added"
                                    done={!!form.location.trim()}
                                />
                            </div>
                        </div>

                        <div className="rounded-3xl bg-neutral-900 p-6 text-white shadow-sm">
                            <h3 className="text-lg font-semibold">Why this matters</h3>
                            <p className="mt-2 text-sm leading-6 text-white/70">
                                Complete profiles look more reliable, improve communication, and
                                make your account more useful across the platform.
                            </p>
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
                className="mb-2 block text-sm font-medium text-neutral-800"
            >
                {label}
            </label>

            {description && (
                <p className="mb-3 text-sm text-neutral-500">{description}</p>
            )}

            {children}

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
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
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
            <span className="text-sm text-neutral-700">{label}</span>
            <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
            >
                {done ? "Done" : "Pending"}
            </span>
        </div>
    );
}

function inputClass(hasError: boolean) {
    return `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 ${hasError
            ? "border-red-300 ring-4 ring-red-100 focus:border-red-400"
            : "border-neutral-300 focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10"
        }`;
}

function EditProfileSkeleton() {
    return (
        <main className="min-h-screen bg-neutral-50">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-4 h-9 w-48 animate-pulse rounded bg-neutral-200" />
                    <div className="mt-3 h-4 w-80 animate-pulse rounded bg-neutral-200" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="h-7 w-44 animate-pulse rounded bg-neutral-200" />
                            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-neutral-200" />

                            <div className="mt-8 h-28 w-28 animate-pulse rounded-3xl bg-neutral-200" />

                            <div className="mt-8 space-y-6">
                                {[1, 2, 3].map((item) => (
                                    <div key={item}>
                                        <div className="mb-2 h-4 w-28 animate-pulse rounded bg-neutral-200" />
                                        <div className="mb-3 h-4 w-64 animate-pulse rounded bg-neutral-100" />
                                        <div className="h-12 w-full animate-pulse rounded-2xl bg-neutral-200" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex gap-3">
                                <div className="h-12 w-32 animate-pulse rounded-2xl bg-neutral-200" />
                                <div className="h-12 w-24 animate-pulse rounded-2xl bg-neutral-200" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="h-6 w-36 animate-pulse rounded bg-neutral-200" />
                            <div className="mt-4 space-y-3">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="h-12 animate-pulse rounded-2xl bg-neutral-100"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl bg-neutral-900 p-6 shadow-sm">
                            <div className="h-6 w-28 animate-pulse rounded bg-white/20" />
                            <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
                            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}