import api from "@/lib/api";

// Create Review
export const createReview = async (
  taskId: string,
  rating: number,
  comment: string
) => {
  const response = await api.post(`/reviews/${taskId}`, {
    rating,
    comment,
  });

  return response.data;
};

// Get Reviews of a Worker
export const getWorkerReviews = async (workerId: string) => {
  const response = await api.get(
    `/reviews/worker/${workerId}`
  );

  return response.data;
};

// Get Logged-in Worker's Reviews
export const getMyReviews = async () => {
  const response = await api.get("/reviews/my-reviews");

  return response.data;
};

