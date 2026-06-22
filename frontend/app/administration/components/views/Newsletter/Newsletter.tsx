"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";

type Subscriber = {
  id: number;
  email: string;
  locale: string;
  is_confirmed: boolean;
  unsubscribed_at: string | null;
  created_at: string;
};

export default function Newsletter() {
  const { showToast } = useToast();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteItem, setDeleteItem] = useState<Subscriber | null>(null);

  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.NEWSLETTER, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setSubscribers(data);
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

      const response = await fetch(`${ENDPOINTS.NEWSLETTER}/${deleteItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      showToast("Subscriber deleted successfully", "ok");

      await loadSubscribers();

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
  const total = subscribers.length;

  const confirmed = subscribers.filter((s) => s.is_confirmed).length;

  const active = subscribers.filter((s) => !s.unsubscribed_at).length;

  const unsubscribed = subscribers.filter((s) => s.unsubscribed_at).length;
  const columns: AdminColumn<Subscriber>[] = [
    {
      key: "email",
      label: "Email",
      width: "35%",
      render: (item) => (
        <div className="font-medium text-[#111]">{item.email}</div>
      ),
    },

    {
      key: "locale",
      label: "Locale",
      width: "10%",
      render: (item) => (
        <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#4F46E5]">
          {item.locale.toUpperCase()}
        </span>
      ),
    },

    {
      key: "confirmed",
      label: "Confirmed",
      width: "12%",
      render: (item) =>
        item.is_confirmed ? (
          <span className="font-semibold text-green-600">✓ Yes</span>
        ) : (
          <span className="text-[#999]">—</span>
        ),
    },

    {
      key: "status",
      label: "Status",
      width: "12%",
      render: (item) =>
        item.unsubscribed_at ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
            Unsubscribed
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
            Active
          </span>
        ),
    },

    {
      key: "joined",
      label: "Joined",
      width: "15%",
      render: (item) => (
        <span className="text-xs text-[#707070]">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      width: "16%",
      render: (item) => (
        <button
          onClick={() => setDeleteItem(item)}
          className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
        >
          Delete
        </button>
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
            Newsletter Subscribers
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
        <div className="rounded-2xl border border-[#D7D9DF] bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[#707070]">
            Total
          </p>

          <h3 className="mt-2 text-3xl font-semibold">{total}</h3>
        </div>

        <div className="rounded-2xl border border-[#D7D9DF] bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[#707070]">
            Confirmed
          </p>

          <h3 className="mt-2 text-3xl font-semibold text-green-600">
            {confirmed}
          </h3>
        </div>

        <div className="rounded-2xl border border-[#D7D9DF] bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[#707070]">
            Active
          </p>

          <h3 className="mt-2 text-3xl font-semibold text-[#111]">{active}</h3>
        </div>

        <div className="rounded-2xl border border-[#D7D9DF] bg-white p-5">
          <p className="text-xs uppercase tracking-wider text-[#707070]">
            Unsubscribed
          </p>

          <h3 className="mt-2 text-3xl font-semibold text-red-600">
            {unsubscribed}
          </h3>
        </div>
      </div>
      <div className="p-6 pt-0">
        <AdminTable data={subscribers} columns={columns} />
      </div>
      <AnimatePresence>
        {deleteItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                scale: 0.95,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.95,
                opacity: 0,
              }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-2 text-xl font-semibold">Delete Subscriber</h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete subscriber
                <br />
                <strong>{deleteItem.email}</strong>?
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
