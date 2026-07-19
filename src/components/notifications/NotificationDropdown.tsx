"use client";

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/services/notification.service";

import { Notification } from "@/types/notification";

interface Props {
  notifications: Notification[];
  setNotifications: Dispatch<
    SetStateAction<Notification[]>
  >;
  unreadCount: number;
  setUnreadCount: Dispatch<
    SetStateAction<number>
  >;
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

      setUnreadCount((prev) =>
        Math.max(prev - 1, 0)
      );
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
    <div
      className="
        absolute
        right-0
        mt-3
        w-[380px]
        rounded-2xl
        border
        bg-white
        shadow-xl
        z-50
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold text-lg">
          Notifications
        </h2>

        {unreadCount > 0 && (
          <button
            onClick={handleReadAll}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Body */}

      <div className="max-h-[500px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification._id}
              href={
                notification.link || "#"
              }
              onClick={() => {
                if (!notification.isRead) {
                  handleRead(
                    notification._id
                  );
                }

                close();
              }}
              className={`
                flex
                gap-3
                p-4
                border-b
                hover:bg-gray-50
                transition

                ${
                  !notification.isRead
                    ? "bg-blue-50"
                    : ""
                }
              `}
            >
              <img
                src={
                  notification.sender
                    ?.profileImage ||
                  "/default-avatar.png"
                }
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-medium text-sm">
                  {notification.title}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              {!notification.isRead && (
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}