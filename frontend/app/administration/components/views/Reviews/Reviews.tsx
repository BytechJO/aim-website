"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import ReviewForm from "./ReviewForm";
import { motion, AnimatePresence } from "framer-motion";
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

export default function Reviews() {
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Review | null>(null);

  const [deleteItem, setDeleteItem] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.REVIEWS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.REVIEWS}/${deleteItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      showToast("Review deleted successfully", "ok");

      await loadReviews();

      setDeleteItem(null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Delete failed",
        "err",
      );
    } finally {
      setDeleting(false);
    }
  };
  const columns: AdminColumn<Review>[] = [
    {
      key: "title",
      label: "Review",
      width: "20%",
      render: (item) => (
        <div>
          <div className="font-semibold text-[#111]">{item.title}</div>

          <div className="text-xs text-[#909090]">by {item.author}</div>
        </div>
      ),
    },

    {
      key: "body",
      label: "Comment",
      width: "20%",
      render: (item) => (
        <div className="truncate text-sm text-[#707070]">{item.body}</div>
      ),
    },

    {
      key: "rating",
      label: "Rating",
      width: "12%",
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-base ${
                  star <= item.rating ? "text-[#F4A261]" : "text-[#E5E7EB]"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "10%",
      render: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.is_active ? "Active" : "Hidden"}
        </span>
      ),
    },

    {
      key: "order",
      label: "Order",
      width: "8%",
      render: (item) => item.sort_order,
    },

    {
      key: "actions",
      label: "Actions",
      width: "12%",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingItem(item);
              setShowForm(true);
            }}
            className="rounded-full border border-[#D7D9DF] px-4 py-1.5 text-[12px]"
          >
            Edit
          </button>

          <button
            onClick={() => setDeleteItem(item)}
            className="rounded-full border border-[#F1C5C5] px-4 py-1.5 text-[12px] text-[#D64545]"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D7D9DF] border-t-black" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 z-30 mb-4 border border-[#D7D9DF] bg-white">
        <div className="flex items-center justify-between px-8 py-5">
          <h1 className="font-adamina text-[24px] text-[#111]">Reviews</h1>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-[#0F0F0F] px-5 py-2 text-[13px] font-semibold text-white cursor-pointer"
          >
            + Add Review
          </button>
        </div>
      </div>

      <div className="p-6">
        <AdminTable data={reviews} columns={columns} />
      </div>

      <AnimatePresence>
        {showForm && (
          <ReviewForm
            review={editingItem || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSaved={() => {
              loadReviews();
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-2 text-xl font-semibold">Delete Review</h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete{" "}
                <strong>{deleteItem.title}</strong>?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteItem(null)}
                  className="rounded-full border border-[#D7D9DF] px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-full bg-[#D64545] px-4 py-2 text-white disabled:opacity-50 cursor-pointer"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
