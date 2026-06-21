"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import AdminTable, { AdminColumn } from "../../AdminTable";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/shared/ToastProvider";

type User = {
  id: number;
  email: string;
  full_name: string;
  job_number?: string;
  position?: string;
  role: "admin" | "super_admin";
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function Users() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [deleteItem, setDeleteItem] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadUsers(statusFilter);
  }, [statusFilter]);

  const loadUsers = async (status: StatusFilter = "all") => {
    try {
      setLoading(true);

      const token = localStorage.getItem("admin_token");

      const url =
        status === "all"
          ? ENDPOINTS.USERS
          : `${ENDPOINTS.USERS}?status=${status}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load users");
      }

      setUsers(data);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to load users",
        "err",
      );
    } finally {
      setLoading(false);
    }
  };

  const setApproval = async (
    user: User,
    approval_status: "approved" | "rejected",
  ) => {
    try {
      setActionLoadingId(user.id);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.USERS}/${user.id}/approval`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approval_status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Action failed");
      }

      showToast(
        approval_status === "approved"
          ? "User approved successfully"
          : "User rejected successfully",
        "ok",
      );

      await loadUsers(statusFilter);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Action failed",
        "err",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const setRole = async (user: User, role: "admin" | "super_admin") => {
    try {
      setActionLoadingId(user.id);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.USERS}/${user.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Role update failed");
      }

      showToast("Role updated successfully", "ok");

      await loadUsers(statusFilter);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Role update failed",
        "err",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("admin_token");

      const response = await fetch(`${ENDPOINTS.USERS}/${deleteItem.id}`, {
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

      showToast("User deleted successfully", "ok");

      await loadUsers(statusFilter);

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
  const columns: AdminColumn<User>[] = [
    {
      key: "user",
      label: "User",
      width: "25%",
      render: (user) => (
        <div>
          <div className="font-semibold text-[#111]">{user.full_name}</div>

          <div className="text-xs text-[#707070]">{user.email}</div>
        </div>
      ),
    },

    {
      key: "job",
      label: "Job Number",
      width: "10%",
      render: (user) => user.job_number || "-",
    },

    {
      key: "position",
      label: "Position",
      width: "15%",
      render: (user) => user.position || "-",
    },

    {
      key: "role",
      label: "Role",
      width: "12%",
      render: (user) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.role === "super_admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {user.role}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      width: "12%",
      render: (user) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.approval_status === "approved"
              ? "bg-green-100 text-green-700"
              : user.approval_status === "rejected"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {user.approval_status}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      width: "26%",
      render: (user) => (
        <div className="flex flex-wrap gap-2">
          {user.approval_status === "pending" && (
            <>
              <button
                disabled={actionLoadingId === user.id}
                onClick={() => setApproval(user, "approved")}
                className="rounded-full bg-green-600 px-3 py-1 text-xs text-white cursor-pointer"
              >
                Approve
              </button>

              <button
                disabled={actionLoadingId === user.id}
                onClick={() => setApproval(user, "rejected")}
                className="rounded-full bg-red-600 px-3 py-1 text-xs text-white cursor-pointer"
              >
                Reject
              </button>
            </>
          )}

          {user.role === "admin" ? (
            <button
              disabled={actionLoadingId === user.id}
              onClick={() => setRole(user, "super_admin")}
              className="rounded-full bg-purple-600 px-3 py-1 text-xs text-white cursor-pointer"
            >
              Make Super
            </button>
          ) : (
            <button
              disabled={actionLoadingId === user.id}
              onClick={() => setRole(user, "admin")}
              className="rounded-full bg-slate-700 px-3 py-1 text-xs text-white cursor-pointer"
            >
              Make Admin
            </button>
          )}

          <button
            onClick={() => setDeleteItem(user)}
            className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 cursor-pointer"
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
          <h1 className="font-adamina text-[24px] text-[#111]">Users</h1>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-[#D7D9DF] px-4 py-2"
          >
            <option value="all">All Users</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        <AdminTable data={users} columns={columns} />
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
              <h3 className="mb-2 text-xl font-semibold">Delete User</h3>

              <p className="text-sm text-[#707070]">
                Are you sure you want to delete{" "}
                <strong>{deleteItem.full_name}</strong>?
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
