"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import EnhancementForm from "./EnhancementForm";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";

type Enhancement = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string[];
  sort_order: number;
  sub_enhancements?: unknown[];
};

export default function Enhancements() {
  const { showToast } = useToast();
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Enhancement | null>(
    null,
  );
  const [deleteProduct, setDeleteProduct] = useState<Enhancement | null>(null);
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    if (!deleteProduct) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(
        `${ENDPOINTS.ENHANCEMENTS}/${deleteProduct.id}`,
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

      showToast("Enhancement deleted successfully", "ok");

      // eslint-disable-next-line react-hooks/immutability
      await loadEnhancements();

      setDeleteProduct(null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Delete failed",
        "err",
      );
    } finally {
      setDeleting(false);
    }
  };
  useEffect(() => {
    loadEnhancements();
  }, []);
  const loadEnhancements = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.ENHANCEMENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setEnhancements(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns: AdminColumn<Enhancement>[] = [
    {
      key: "enhancement",
      label: "Enhancement",
      width: "20%",
      render: (enhancement) => (
        <div className="flex items-center gap-3">
          {enhancement.image_url?.[0] ? (
            <Image
              src={enhancement.image_url[0]}
              alt={enhancement.title_en}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div
              className="
      flex
      h-11
      w-11
      shrink-0
      items-center
      justify-center
      rounded-lg
      bg-[#F3F4F6]
      text-sm
      font-semibold
      text-[#111]
      border
      border-[#D7D9DF]
    "
            >
              {enhancement.title_en?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-[#1A1A1A]">
              {enhancement.title_en}
            </div>

            <div className="truncate text-[12px] text-[#9A9A9A]">
              {enhancement.title_ar}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "slug",
      label: "Slug",
      width: "15%",
      render: (enhancement) => (
        <div className="truncate font-mono text-[13px] text-[#4B4B4B]">
          {enhancement.slug}
        </div>
      ),
    },

    {
      key: "description",
      label: "Description",
      width: "30%",
      render: (enhancement) => (
        <div className="truncate text-[13px] text-[#7A7A7A]">
          {enhancement.description_en || "—"}
        </div>
      ),
    },

    {
      key: "subEnhancements",
      label: "Sub Items",
      width: "10%",
      render: (enhancement) => (
        <span className="text-[14px] text-[#4B4B4B]">
          {enhancement.sub_enhancements?.length || 0}
        </span>
      ),
    },

    {
      key: "order",
      label: "Order",
      width: "8%",
      render: (enhancement) => (
        <span className="text-[14px] text-[#4B4B4B]">
          {enhancement.sort_order}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      width: "17%",
      render: (enhancement) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingProduct(enhancement);
              setShowForm(true);
            }}
            className="rounded-full border border-[#D7D9DF] px-4 py-1.5 text-[12px] font-medium transition hover:bg-[#F6F6F6] cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => setDeleteProduct(enhancement)}
            className="rounded-full border border-[#F1C5C5] px-4 py-1.5 text-[12px] font-medium text-[#D64545] transition hover:bg-[#FFF5F5] cursor-pointer"
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
      {/* Header */}
      <div
        className="
    sticky
    top-0
    z-30
    mb-4
    border
    border-[#D7D9DF]
    bg-white
  "
      >
        <div className="flex items-center justify-between px-8 py-5">
          <h1 className="font-adamina text-[24px] text-[#111]">Enhancements</h1>

          <button
            onClick={() => setShowForm(true)}
            className="
    group
    rounded-full
    bg-[#0F0F0F]
    px-5
    py-2
    text-[13px]
    font-semibold
    text-white
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]
    active:translate-y-0
    active:scale-[0.98]
    cursor-pointer
  "
          >
            <span className="inline-flex items-center gap-2">
              <span className="transition-transform duration-300 group-hover:rotate-90">
                +
              </span>
              Add Enhancement
            </span>
          </button>
        </div>
      </div>
      <div className="p-6">
        {/* Table */}
        <AdminTable data={enhancements} columns={columns} />
      </div>

      <AnimatePresence>
        {showForm && (
          <EnhancementForm
            enhancement={editingProduct || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
            onSaved={() => {
              loadEnhancements();
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteProduct && (
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
              <h3 className="mb-2 text-xl font-semibold">Delete Enhancement</h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete{" "}
                <strong>{deleteProduct.title_en}</strong>?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteProduct(null)}
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
