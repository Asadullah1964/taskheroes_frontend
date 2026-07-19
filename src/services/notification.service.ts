import api from "@/lib/api";

export const getNotifications = async () => {
  const { data } = await api.get(
    "/notifications"
  );

  return data;
};

export const getUnreadCount = async () => {
  const { data } = await api.get(
    "/notifications/unread-count"
  );

  return data;
};

export const markNotificationRead = async (
  id: string
) => {
  const { data } = await api.patch(
    `/notifications/${id}/read`
  );

  return data;
};

export const markAllNotificationsRead =
  async () => {
    const { data } = await api.patch(
      "/notifications/read-all"
    );

    return data;
  };