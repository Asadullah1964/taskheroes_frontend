import api from "@/lib/api";

export const getMyProfile = async () => {
  const response = await api.get("/users/me");
  return response.data.data;
};

export const updateProfile = async (data: any) => {
  const response = await api.put("/users/profile", data);
  return response.data.data;
};

export const becomeWorker = async (data: any) => {
  const response = await api.put("/users/become-worker", data);
  return response.data.data;
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post(
    "/users/upload-profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
};