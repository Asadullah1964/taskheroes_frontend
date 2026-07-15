"use client";

import { useState } from "react";
import { applyTask } from "@/services/task";

interface Props {
  taskId: string;
}

export default function ApplyTaskForm({
  taskId,
}: Props) {
  const [proposal, setProposal] = useState("");
  const [expectedPrice, setExpectedPrice] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      await applyTask(
        taskId,
        proposal,
        Number(expectedPrice)
      );

      alert("Application Submitted");

      setProposal("");
      setExpectedPrice("");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 border rounded-xl p-6">

      <h2 className="text-2xl font-bold mb-5">
        Apply For This Task
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="block mb-2">
            Proposal
          </label>

          <textarea
            rows={5}
            required
            value={proposal}
            onChange={(e) =>
              setProposal(e.target.value)
            }
            className="w-full border rounded-lg p-3"
            placeholder="Write why you're the best fit..."
          />
        </div>

        <div>
          <label className="block mb-2">
            Expected Price
          </label>

          <input
            type="number"
            required
            value={expectedPrice}
            onChange={(e) =>
              setExpectedPrice(e.target.value)
            }
            className="w-full border rounded-lg p-3"
            placeholder="Enter your price"
          />
        </div>

        <button
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Submitting..."
            : "Apply"}
        </button>

      </form>

    </div>
  );
}