"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname === "/chat" ||
  pathname.startsWith("/chat/");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "pt-16" : ""}>
        {children}
      </main>
    </>
  );
}