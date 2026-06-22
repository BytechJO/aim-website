"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import InstagramForm from "./InstagramForm";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";

type InstagramPost = {
  id: number;
  image_url: string;
  caption: string;
  instagram_link: string;
  post_date: string;
  sort_order: number;
  is_active: boolean;
};

export default function Instagram() {
  const { showToast } = useToast();

  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InstagramPost | null>(null);

  const [deleteItem, setDeleteItem] = useState<InstagramPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.INSTAGRAM, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setPosts(data);
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

      const response = await fetch(`${ENDPOINTS.INSTAGRAM}/${deleteItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let message = "Delete failed";

        try {
          const data = await response.json();
          message = data.error || message;
        } catch {}

        throw new Error(message);
      }

      showToast("Instagram post deleted successfully", "ok");

      await loadPosts();

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

  const handleReorder = async (newPosts: InstagramPost[]) => {
    const previousPosts = [...posts];

    const normalizedPosts = newPosts.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    try {
      setPosts(normalizedPosts);
      setSavingOrder(true);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.INSTAGRAM}/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ids: normalizedPosts.map((item) => item.id),
        }),
      });

      if (!response.ok) {
        let message = "Reorder failed";

        try {
          const data = await response.json();
          message = data.error || message;
        } catch {}

        throw new Error(message);
      }

      showToast("Order updated successfully", "ok");

      await loadPosts();
    } catch (error) {
      setPosts(previousPosts);

      showToast(
        error instanceof Error ? error.message : "Reorder failed",
        "err",
      );
    } finally {
      setSavingOrder(false);
    }
  };

  const columns: AdminColumn<InstagramPost>[] = [
    {
      key: "post",
      label: "Post",
      width: "28%",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Image
            src={item.image_url || "/placeholder.png"}
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-lg object-cover"
          />

          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium text-[#1A1A1A]">
              {item.caption || "No Caption"}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "date",
      label: "Date",
      width: "14%",
      render: (item) => (
        <span className="text-[13px] text-[#4B4B4B]">
          {item.post_date ? new Date(item.post_date).toLocaleDateString() : "-"}
        </span>
      ),
    },

    {
      key: "link",
      label: "Instagram",
      width: "18%",
      render: (item) => (
        <a
          href={item.instagram_link}
          target="_blank"
          rel="noreferrer"
          className="text-[13px] text-blue-600 underline"
        >
          Open Post
        </a>
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
      render: (item) => (
        <span className="text-[14px] text-[#4B4B4B]">{item.sort_order}</span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      width: "17%",
      render: (item) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingItem(item);
              setShowForm(true);
            }}
            className="rounded-full border border-[#D7D9DF] px-4 py-1.5 text-[12px] font-medium hover:bg-[#F6F6F6] cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => setDeleteItem(item)}
            className="rounded-full border border-[#F1C5C5] px-4 py-1.5 text-[12px] font-medium text-[#D64545] hover:bg-[#FFF5F5] cursor-pointer"
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
          <h1 className="font-adamina text-[24px] text-[#111]">
            Instagram Posts
          </h1>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-[#0F0F0F] px-5 py-2 text-[13px] font-semibold text-white cursor-pointer"
          >
            + Add Post
          </button>
        </div>
      </div>

      <div className="p-6">
        <AdminTable
          data={posts}
          columns={columns}
          draggable
          dragWidth="5%"
          savingOrder={savingOrder}
          onReorder={handleReorder}
        />
      </div>

      <AnimatePresence>
        {showForm && (
          <InstagramForm
            post={editingItem || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSaved={() => {
              loadPosts();
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
              <h3 className="mb-2 text-xl font-semibold">
                Delete Instagram Post
              </h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete this post?
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
