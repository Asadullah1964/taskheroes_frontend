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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow"
      >
        <h1 className="text-3xl font-bold">Register</h1>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          value={formData.name}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
          className="w-full rounded border p-3"
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded border p-3"
        >
          <option value="client">Client</option>
          <option value="worker">Worker</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}