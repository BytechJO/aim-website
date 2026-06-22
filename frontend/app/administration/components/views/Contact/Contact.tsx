"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";

type Contact = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  inquiry_type: string;
  status: "new" | "read" | "replied";
  created_at: string;
};

type StatusFilter = "all" | "new" | "read" | "replied";

export default function Contacts() {
  const { showToast } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [deleteItem, setDeleteItem] = useState<Contact | null>(null);

  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(ENDPOINTS.CONTACT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setContacts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const updateStatus = async (
    id: number,
    status: "new" | "read" | "replied",
  ) => {
    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.CONTACT}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                status,
              }
            : contact,
        ),
      );

      showToast("Status updated successfully", "ok");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Update failed",
        "err",
      );
    }
  };
  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.CONTACT}/${deleteItem.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      showToast("Inquiry deleted successfully", "ok");

      await loadContacts();

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
  const filteredContacts =
    statusFilter === "all"
      ? contacts
      : contacts.filter((contact) => contact.status === statusFilter);

  const columns: AdminColumn<Contact>[] = [
    {
      key: "from",
      label: "From",
      width: "22%",
      render: (item) => (
        <div>
          <div className="font-semibold text-[#111]">{item.name}</div>

          <div className="text-xs text-[#707070]">{item.email}</div>

          {item.phone && (
            <div className="text-xs text-[#999]">{item.phone}</div>
          )}
        </div>
      ),
    },

    {
      key: "type",
      label: "Type",
      width: "12%",
      render: (item) => (
        <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#4F46E5]">
          {item.inquiry_type}
        </span>
      ),
    },

    {
      key: "message",
      label: "Message",
      width: "30%",
      render: (item) => (
        <div className="line-clamp-3 text-sm leading-6 text-[#707070]">
          {item.message}
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      width: "14%",
      render: (item) => (
        <select
          value={item.status}
          onChange={(e) =>
            updateStatus(item.id, e.target.value as "new" | "read" | "replied")
          }
          className="rounded-lg border border-[#D7D9DF] bg-white px-3 py-1.5 text-xs cursor-pointer"
        >
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      ),
    },

    {
      key: "date",
      label: "Date",
      width: "12%",
      render: (item) => (
        <span className="text-xs text-[#707070]">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      width: "10%",
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
          <div>
            <h1 className="font-adamina text-[24px] text-[#111]">
              Contact Inquiries
            </h1>

            <p className="mt-1 text-xs text-[#707070]">
              {filteredContacts.length} inquiries
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-[#D7D9DF] px-4 py-2 text-sm cursor-pointer"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        <AdminTable data={filteredContacts} columns={columns} />
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-2 text-xl font-semibold">Delete Inquiry</h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete the inquiry from{" "}
                <strong>{deleteItem.name}</strong>?
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
