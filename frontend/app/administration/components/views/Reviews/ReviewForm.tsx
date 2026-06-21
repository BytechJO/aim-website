"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";

type Review = {
  id: number;
  title: string;
  body: string;
  author: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
};

type Props = {
  onClose: () => void;
  onSaved?: () => void;
  review?: Review;
};

export default function ReviewForm({ onClose, onSaved, review }: Props) {
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: review?.title || "",
    body: review?.body || "",
    author: review?.author || "",
    rating: review?.rating || 5,
    sort_order: review?.sort_order || 0,
    is_active: review?.is_active ?? true,
  });

  const update = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("admin_token");

      const payload = {
        title: form.title,
        body: form.body,
        author: form.author,
        rating: Number(form.rating),
        sort_order: Number(form.sort_order),
        is_active: form.is_active,
      };

      const response = await fetch(
        review ? `${ENDPOINTS.REVIEWS}/${review.id}` : ENDPOINTS.REVIEWS,
        {
          method: review ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Save failed");
      }

      showToast(
        review ? "Review updated successfully" : "Review created successfully",
        "ok",
      );

      onSaved?.();
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 24 }}
        className="
          w-full
           max-w-180
          rounded-2xl
          border
          border-[#D7D9DF]
          bg-white
          shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        "
      >
        <div className="border-b border-[#D7D9DF] px-8 py-5">
          <h2 className="font-adamina text-3xl text-[#111]">
            {review ? "Edit Review" : "New Review"}
          </h2>
        </div>

        <div className="space-y-6 p-8">
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
              Title
            </label>

            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
              Review Body
            </label>

            <textarea
              rows={6}
              value={form.body}
              onChange={(e) => update("body", e.target.value)}
              className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Author
              </label>

              <input
                value={form.author}
                onChange={(e) => update("author", e.target.value)}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Rating
              </label>

              <select
                value={form.rating}
                onChange={(e) => update("rating", Number(e.target.value))}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Sort Order
              </label>

              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => update("sort_order", Number(e.target.value))}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
              Status
            </label>

            <select
              value={String(form.is_active)}
              onChange={(e) => update("is_active", e.target.value === "true")}
              className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
            >
              <option value="true">Active</option>
              <option value="false">Hidden</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#D7D9DF] px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-full border border-[#D7D9DF] px-5 py-2 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-black px-5 py-2 text-white disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : review ? "Save Changes" : "Create Review"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
