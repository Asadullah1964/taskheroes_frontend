"use client";

import { useState } from "react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-lg border p-6 shadow space-y-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black p-3 text-white"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleLogin(
                  credentialResponse.credential
                );
              }
            }}
            onError={() => {
              alert("Google Login Failed");
            }}
          />
        </div>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="cursor-pointer text-blue-600"
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
}