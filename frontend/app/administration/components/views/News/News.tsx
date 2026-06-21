"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import NewsForm from "./NewsForm";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";
type NewsBlock =
  | { type: "content"; content_en: string; content_ar: string }
  | { type: "image"; image: string | File | null }
  | { type: "gallery"; images: (string | File)[] }
  | {
      type: "list";
      list_style: "bullet" | "numbered";
      items_en: string[];
      items_ar: string[];
    };

type NewsSection = {
  title_en: string;
  title_ar: string;
  blocks: NewsBlock[];
};

type NewsItem = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;

  description_en?: string;
  description_ar?: string;

  hero_image?: string;
  thumbnail_image?: string;

  title_color?: string;

  sections?: NewsSection[];

  is_published: boolean;
  sort_order: number;
};

export default function News() {
  const { showToast } = useToast();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const [deleteItem, setDeleteItem] = useState<NewsItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.NEWS_ADMIN, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setNews(data);
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

      const response = await fetch(`${ENDPOINTS.NEWS_ADMIN}/${deleteItem.id}`, {
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

      showToast("News deleted successfully", "ok");

      await loadNews();

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

  const columns: AdminColumn<NewsItem>[] = [
    {
      key: "news",
      label: "News",
      width: "25%",
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.thumbnail_image ? (
            <Image
              src={item.thumbnail_image}
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
      width: "18%",
      render: (item) => (
        <div className="truncate font-mono text-[13px] text-[#4B4B4B]">
          {item.slug}
        </div>
      ),
    },

    {
      key: "published",
      label: "Published",
      width: "10%",
      render: (item) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.is_published
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.is_published ? "Published" : "Draft"}
        </span>
      ),
    },

    {
      key: "sections",
      label: "Sections",
      width: "10%",
      render: (item) => (
        <span className="text-[14px] text-[#4B4B4B]">
          {item.sections?.length || 0}
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
          <h1 className="font-adamina text-[24px] text-[#111]">News</h1>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-[#0F0F0F] px-5 py-2 text-[13px] font-semibold text-white cursor-pointer"
          >
            + Add News
          </button>
        </div>
      </div>

      <div className="p-6">
        <AdminTable data={news} columns={columns} />
      </div>
      <div className="px-6 pb-10">
        <h2 className="mb-6 text-xl font-semibold">Homepage Preview</h2>

        {news.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 rounded-2xl border border-[#D7D9DF] bg-[#FAFAFA] p-6">
            {/* Main News */}
            <div className="relative min-h-100 overflow-hidden rounded-xl">
              <Image
                src={news[0].hero_image || news[0].thumbnail_image || ""}
                alt={news[0].title_en}
                fill
                className="object-cover"
              />

              <div className="absolute bottom-0 left-0 w-full bg-white/95 p-5">
                <div className="mb-2 text-xs text-[#707070]">
                  ORDER #{news[0].sort_order}
                </div>

                <h3 className="font-semibold">{news[0].title_en}</h3>

                <p className="mt-2 line-clamp-2 text-sm text-[#707070]">
                  {news[0].description_en}
                </p>
              </div>
            </div>

            {/* Side News */}
            <div className="space-y-4">
              {news.slice(1, 3).map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-[#D7D9DF] bg-white"
                >
                  <div className="relative h-32">
                    <Image
                      src={item.thumbnail_image || item.hero_image || ""}
                      alt={item.title_en}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="mb-2 text-xs text-[#707070]">
                      ORDER #{item.sort_order}
                    </div>

                    <h4 className="line-clamp-2 text-sm font-semibold">
                      {item.title_en}
                    </h4>

                    <p className="mt-2 line-clamp-2 text-xs text-[#707070]">
                      {item.description_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {showForm && (
          <NewsForm
            news={editingItem || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            onSaved={() => {
              loadNews();
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
              <h3 className="mb-2 text-xl font-semibold">Delete News</h3>

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
