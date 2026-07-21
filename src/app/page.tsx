"use client";

import { useEffect, useState } from "react";

import GuestLanding from "@/components/landing/GuestLanding";
import AuthLanding from "@/components/landing/AuthLanding";

import { getCurrentUser } from "@/services/auth.service";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "client" | "worker" | "admin";
  profileImage?: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return user ? (
    <AuthLanding user={user} />
  ) : (
    <GuestLanding />
  );
}