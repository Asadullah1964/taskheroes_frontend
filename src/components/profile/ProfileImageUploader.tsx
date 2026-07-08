"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Props {
  image: string;
  onUploaded: (url: string) => void;
}

export default function ProfileImageUploader({
  image,
  onUploaded,
}: Props) {
  const [preview, setPreview] = useState(image);
  const [uploading, setUploading] = useState(false);

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();

    formData.append("image", file);

    try {
      setUploading(true);

      const res = await api.post(
        "/users/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUploaded(res.data.data.profileImage);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">

      <img
        src={
          preview ||
          "https://placehold.co/150x150?text=Profile"
        }
        className="w-36 h-36 rounded-full object-cover border"
      />

      <label className="cursor-pointer rounded-xl bg-neutral-900 px-5 py-3 text-white">

        {uploading ? "Uploading..." : "Change Photo"}

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />

      </label>

    </div>
  );
}