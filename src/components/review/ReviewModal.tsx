import { useState } from "react";
import { createReview } from "@/services/reviews";
import StarRating from "./StarRating";

interface Props {
  taskId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReviewModal = ({
  taskId,
  onClose,
  onSuccess,
}: Props) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert("Please enter a review.");
      return;
    }

    try {
      setLoading(true);

      await createReview(taskId, rating, comment);

      alert("Review submitted successfully.");

      onSuccess?.();
      onClose();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Leave a Review
        </h2>

        <StarRating
          rating={rating}
          onChange={setRating}
        />

        <textarea
          rows={5}
          placeholder="Write your review..."
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          className="w-full border rounded-lg mt-4 p-3"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
          >
            {loading
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;