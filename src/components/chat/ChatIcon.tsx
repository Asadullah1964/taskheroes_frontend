"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useSocket } from "@/context/SocketProvider";
import {
  getNotifications,
  getUnreadCount,
} from "@/services/notification.service";
import { Notification } from "@/types/notification";
import NotificationDropdown from "../notifications/NotificationDropdown";
import router from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";

export default function ChatIcon() {
  const { socket } = useSocket();
  const router = useRouter();

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
      if (notification.type !== "MESSAGE") return;

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

      const allNotifications = notificationRes.notifications || [];

      const filteredNotifications = allNotifications.filter(
        (item: Notification) => item.type === "MESSAGE"
      );

      setNotifications(filteredNotifications);

      if (typeof unreadRes.count === "number") {
        const unreadFiltered = filteredNotifications.filter(
          (item: Notification) => !item.isRead
        ).length;
        setUnreadCount(unreadFiltered);
      } else {
        setUnreadCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

const handleOpen = () => {
  if (closeTimerRef.current) {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }
  setOpen(true);
};

const handleClose = () => {
  closeTimerRef.current = setTimeout(() => setOpen(false), 150);
};

 const handleNavigateToChat = () => {
    router.push("/chat");
  };

// use handleOpen/handleClose in onMouseEnter/onMouseLeave

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button
        type="button"
        onClick={handleNavigateToChat}
        aria-label="Open message notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
          open
            ? "bg-neutral-100 text-neutral-900"
            : "text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        <MessageSquare className="h-5 w-5" />

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

          {/* Make the dropdown part of the same hover region */}
          <div
            className="
              fixed left-3 right-3 top-16 z-50
              sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-3 sm:w-96
            "
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
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