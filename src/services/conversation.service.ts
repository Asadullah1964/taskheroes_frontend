import api from "@/lib/api";

export const getMyConversations = async () => {
  const { data } = await api.get("/conversations");

  return data;
};

export const createConversation = async (
  taskId: string
) => {
  const { data } = await api.post(
    `/conversations/${taskId}`
  );

  return data;
};

export const createOrGetConversation = async (
  taskId: string
) => {
  const { data } = await api.post(
    `/conversations/${taskId}`
  );

  return data.conversation;
};