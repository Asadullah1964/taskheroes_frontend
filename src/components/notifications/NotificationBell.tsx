"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useSocket } from "@/context/SocketProvider";
import {
  getNotifications,
  getUnreadCount,
} from "@/services/notification.service";
import { Notification } from "@/types/notification";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const [notificationRes, unreadRes] = await Promise.all([
        getNotifications(),
        getUnreadCount(),
      ]);

      setNotifications(notificationRes.notifications || []);
      setUnreadCount(unreadRes.count || 0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
          open
            ? "bg-neutral-100 text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              fixed left-3 right-3 top-16 z-50
              sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-3 sm:w-96
            "
          >
            <NotificationDropdown
              notifications={notifications}
              setNotifications={setNotifications}
              unreadCount={unreadCount}
              setUnreadCount={setUnreadCount}
              close={() => setOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}