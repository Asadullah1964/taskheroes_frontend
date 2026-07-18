import api from "@/lib/api";

export const getMessages = async (
  conversationId: string
) => {
  const { data } = await api.get(
    `/messages/${conversationId}`
  );

  return data;
};

export const sendMessage = async (
  conversationId: string,
  text: string
) => {
  const { data } = await api.post(
    `/messages/${conversationId}`,
    {
      text,
    }
  );

  return data;
};

export const markAsSeen = async (
  conversationId: string
) => {
  const { data } = await api.patch(
    `/messages/${conversationId}/seen`
  );

  return data;
};