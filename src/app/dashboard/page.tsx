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
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-lg border p-8 shadow">
      <h1 className="mb-6 text-3xl font-bold">
        Welcome, {user.name}
      </h1>

      <div className="space-y-3">

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <p>
          <strong>Verified:</strong>{" "}
          {user.isVerified ? "Yes" : "No"}
        </p>

        <p>
          <strong>Profile Completed:</strong>{" "}
          {user.isProfileCompleted ? "Yes" : "No"}
        </p>

      </div>

      <button
        onClick={logout}
        className="mt-8 rounded bg-red-600 px-5 py-3 text-white"
      >
        Logout
      </button>
    </div>
  );
}