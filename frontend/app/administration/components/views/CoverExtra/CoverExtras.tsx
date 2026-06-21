"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import CoverExtraForm from "./CoverExtraForm";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";

type CoverExtra = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string[];
  sort_order: number;
  is_active?: boolean;
};

export default function CoverExtras() {
  const { showToast } = useToast();

  const [coverExtras, setCoverExtras] = useState<CoverExtra[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CoverExtra | null>(null);

  const [deleteItem, setDeleteItem] = useState<CoverExtra | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadCoverExtras();
  }, []);

  const loadCoverExtras = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.COVER_EXTRAS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setCoverExtras(data);
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

      const response = await fetch(
        `${ENDPOINTS.COVER_EXTRAS}/${deleteItem.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        let message = "Delete failed";

        try {
          const data = await response.json();
          message = data.error || message;
        } catch {}

        throw new Error(message);
      }

      showToast("Cover Extra deleted successfully", "ok");

      await loadCoverExtras();

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

  const columns: AdminColumn<CoverExtra>[] = [
    {
      key: "coverExtra",
      label: "Cover Extra",
      width: "25%",
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.image_url?.[0] ? (
            <Image
              src={item.image_url[0]}
              alt={item.title_en}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#D7D9DF] bg-[#F3F4F6] text-sm font-semibold text-[#111]">
              {item.title_en?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-[#1A1A1A]">
              {item.title_en}
            </div>

            <div className="truncate text-[12px] text-[#9A9A9A]">
              {item.title_ar}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "slug",
      label: "Slug",
      width: "20%",
      render: (item) => (
        <div className="truncate font-mono text-[13px] text-[#4B4B4B]">
          {item.slug}
        </div>
      ),
    },

    {
      key: "description",
      label: "Description",
      width: "30%",
      render: (item) => (
        <div className="truncate text-[13px] text-[#7A7A7A]">
          {item.description_en || "—"}
        </div>
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
          <h1 className="font-adamina text-[24px] text-[#111]">Cover Extras</h1>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-[#0F0F0F] px-5 py-2 text-[13px] font-semibold text-white cursor-pointer"
          >
            + Add Cover Extra
          </button>
        </div>
      </div>

      <div className="p-6">
        <AdminTable data={coverExtras} columns={columns} />
      </div>

      <AnimatePresence>
        {showForm && (
          <CoverExtraForm
            coverExtra={editingItem || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSaved={() => {
              loadCoverExtras();
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
              <h3 className="mb-2 text-xl font-semibold">Delete Cover Extra</h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete{" "}
                <strong>{deleteItem.title_en}</strong>?
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
