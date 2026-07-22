import type { Metadata } from "next";
import "./globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "@/context/SocketProvider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: "TaskHeroes",
  description: "Connect Clients and Workers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <SocketProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </SocketProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}