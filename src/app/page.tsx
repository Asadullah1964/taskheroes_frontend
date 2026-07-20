import { cookies } from "next/headers";
import GuestLanding from "@/components/landing/GuestLanding";
import AuthLanding from "@/components/landing/AuthLanding";

type User = {
  name?: string;
  role?: "client" | "worker" | "admin";
};

async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  // Change this to your real auth cookie name
  const token = cookieStore.get("token")?.value;
console.log("Home page rendering");
  console.log(cookieStore.get("token"));
  
  if (!token) {
    return null;
  }

  // Replace this mock with real session decode / API validation
  return {
    name: "Asadullah",
    role: "client",
  };
}

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <GuestLanding />;
  }

  return <AuthLanding user={user} />;
}