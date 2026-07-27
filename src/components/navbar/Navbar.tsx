"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  User,
  X,
} from "lucide-react";

import NotificationBell from "@/components/notifications/NotificationBell";
import ChatIcon from "@/components/chat/ChatIcon";
import { getCurrentUser } from "@/services/auth.service";
import api from "@/lib/api";
import ThemeToggle from "@/components/themes/ThemeToggle";

interface NavbarUser {
  name: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<NavbarUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Tasks", href: "/tasks" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const profileLinks = [
    { label: "My Profile", href: "/profile", icon: User },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Edit Profile", href: "/profile/edit", icon: Pencil },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser, pathname]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const logout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await api.post("/auth/logout");
      setUser(null);
      setProfileOpen(false);
      setMobileOpen(false);
      router.refresh();
      router.replace("/login");
    } catch (error) {
      console.log(error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <header className="fixed left-0 top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Loading...
          </p>
        </div>
      </header>
    );
  }

  if (!user) {
    return (
      <header className="fixed left-0 top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-900">
              TH
            </div>
            <span className="hidden text-sm font-semibold text-neutral-950 sm:block dark:text-neutral-100">
              TaskHeroes
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              Login
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-2xl px-2 py-1 transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-900 text-sm font-bold text-white dark:bg-white dark:text-neutral-900">
              TH
            </div>
            <span className="hidden text-sm font-semibold text-neutral-950 sm:block dark:text-neutral-100">
              TaskHeroes
            </span>
          </Link>

          <nav className="hidden items-center justify-center gap-2 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActiveLink(item.href)
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center justify-end gap-2 lg:flex">
            <NotificationBell />
            <ChatIcon />
            <ThemeToggle />

            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-2 py-1.5 pr-3 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <ChevronDown
                  className={`h-4 w-4 text-neutral-500 transition dark:text-neutral-400 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="border-b border-neutral-100 px-4 py-4 dark:border-neutral-800">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {user.name || "User"}
                    </p>
                    {user.email ? (
                      <p className="mt-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                        {user.email}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Manage your account
                      </p>
                    )}
                  </div>

                  <div className="p-2">
                    {profileLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                            isActiveLink(item.href)
                              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                              : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                      }}
                      disabled={loggingOut}
                      className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 lg:hidden">
            <NotificationBell />
            <ChatIcon />
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-neutral-950/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-dvh w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden dark:bg-neutral-900 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden border-l border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {user.name || "User"}
                </p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                  {user.email || "Menu"}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
              Navigation
            </p>

            <div className="space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActiveLink(item.href)
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                Account
              </p>

              <div className="space-y-2">
                {profileLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActiveLink(item.href)
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </header>
  );
}