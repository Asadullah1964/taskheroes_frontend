import axios from "axios";
import api from "@/lib/api";

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      return null;
    }

    throw error;
  }
};