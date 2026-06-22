"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";

type User = {
  id: number;
  email: string;
  full_name: string;
  job_number?: string;
  position?: string;
  role: "admin" | "super_admin";
  approval_status?: "pending" | "approved" | "rejected";
};

type Props = {
  user?: User;
  onClose: () => void;
  onSaved: () => void;
};

export default function UserForm({ user, onClose, onSaved }: Props) {
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    password: "",
    job_number: user?.job_number || "",
    position: user?.position || "",
    role: user?.role || "admin",
    approval_status: user?.approval_status || "approved",
  });
  const update = (key: string, value: string) => {
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
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        job_number: form.job_number,
        position: form.position,
        approval_status: form.approval_status,
        role: form.role,
      };

      const response = await fetch(
        user ? `${ENDPOINTS.USERS}/${user.id}` : ENDPOINTS.USERS,
        {
          method: user ? "PUT" : "POST",
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

      showToast("User created successfully", "ok");

      onSaved();
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
          <h2 className="font-adamina text-3xl text-[#111]">Create User</h2>
        </div>

        <div className="space-y-6 p-8">
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
              Full Name
            </label>

            <input
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              />
            </div>

            {!user && (
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                  Password
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Job Number
              </label>

              <input
                value={form.job_number}
                onChange={(e) => update("job_number", e.target.value)}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Position
              </label>

              <input
                value={form.position}
                onChange={(e) => update("position", e.target.value)}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Role
              </label>

              <select
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Approval Status
              </label>

              <select
                value={form.approval_status}
                onChange={(e) => update("approval_status", e.target.value)}
                className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
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
            {saving ? "Saving..." : user ? "Save Changes" : "Create User"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
