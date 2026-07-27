import type { Metadata } from "next";
import "./globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "@/context/SocketProvider";
import { Toaster } from "sonner";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { ThemeProvider } from "@/components/themes/theme-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <SocketProvider>
              <LayoutWrapper>
                {children}
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  duration={3000}
                  toastOptions={{
                    style: {
                      borderRadius: "16px",
                    },
                  }}
                />
              </LayoutWrapper>
            </SocketProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}