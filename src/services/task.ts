import api from "@/lib/api";
import { Task } from "@/types/task";

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const getTaskById = async (id: string) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: Partial<Task>) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<Task>
) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const applyTask = async (
  id: string,
  proposal: string,
  expectedPrice: number
) => {
  const response = await api.post(`/tasks/${id}/apply`, {
    proposal,
    expectedPrice,
  });

  return response.data;
};

export const getMyTasks = async () => {
  const response = await api.get("/tasks/my");
  return response.data;
};

export const getAppliedTasks = async () => {
  const response = await api.get("/tasks/applied");
  return response.data;
};

export const getTaskApplications = async (taskId: string) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const updateApplicationStatus = async (
  taskId: string,
  applicationId: string,
  status: "Accepted" | "Rejected"
) => {
  const response = await api.patch(
    `/tasks/${taskId}/applications/${applicationId}`,
    { status }
  );

  return response.data;
};

export const completeTask = async (id: string) => {
  const response = await api.patch(`/tasks/${id}/complete`);
  return response.data;
};