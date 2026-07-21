"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";
import { Notification } from "@/types/notification";

interface Props {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
  close: () => void;
}

export default function NotificationDropdown({
  notifications,
  setNotifications,
  unreadCount,
  setUnreadCount,
  close,
}: Props) {
  const handleRead = async (id: string) => {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id
            ? {
                ...n,
                isRead: true,
              }
            : n
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-base font-semibold text-neutral-950 sm:text-lg">
            Notifications
          </h2>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 sm:text-sm"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl">
              🔔
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">
              No notifications
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">
              New updates, task activity, and alerts will show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <Link
                key={notification._id}
                href={notification.link || "#"}
                onClick={() => {
                  if (!notification.isRead) {
                    handleRead(notification._id);
                  }
                  close();
                }}
                className={`flex gap-3 px-4 py-4 transition hover:bg-neutral-50 sm:px-5 ${
                  !notification.isRead ? "bg-blue-50/60" : "bg-white"
                }`}
              >
                <img
                  src={
                    notification.sender?.profileImage || "/default-avatar.png"
                  }
                  alt={notification.sender?.name || "User"}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-neutral-200"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-neutral-600">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <p className="mt-2 text-xs text-neutral-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}