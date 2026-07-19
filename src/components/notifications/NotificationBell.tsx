"use client";

import { useEffect, useState } from "react";
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

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "new-notification",
      (notification: Notification) => {
        setNotifications((prev) => [
          notification,
          ...prev,
        ]);

        setUnreadCount((prev) => prev + 1);
      }
    );

    return () => {
      socket.off("new-notification");
    };
  }, [socket]);

  const loadNotifications = async () => {
    try {
      const notificationRes =
        await getNotifications();

      const unreadRes =
        await getUnreadCount();

      setNotifications(
        notificationRes.notifications
      );

      setUnreadCount(unreadRes.count);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 hover:bg-neutral-100 transition"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              h-5
              min-w-5
              rounded-full
              bg-red-600
              px-1
              text-[10px]
              text-white
              flex
              items-center
              justify-center
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          setNotifications={setNotifications}
          unreadCount={unreadCount}
          setUnreadCount={setUnreadCount}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}