"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ImageUploader from "@/app/shared/ImageUploader";
import { ENDPOINTS } from "@/app/api/endpoints";
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

type Props = {
  onClose: () => void;
  onSaved?: () => void;
  post?: InstagramPost;
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  type?: string;
};

export default function InstagramForm({ onClose, onSaved, post }: Props) {
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    image_url: post?.image_url || "",
    caption: post?.caption || "",
    instagram_link: post?.instagram_link || "",
    post_date: post?.post_date?.split("T")[0] || "",
    sort_order: post?.sort_order || 0,
    is_active: post?.is_active ?? true,
  });

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    const token = localStorage.getItem("admin_token");

    const res = await fetch(ENDPOINTS.UPLOAD, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data.url as string;
  };

  const update = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSavePost = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("admin_token");

      let image_url = form.image_url;

      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      const payload = {
        image_url,
        caption: form.caption,
        instagram_link: form.instagram_link,
        post_date: form.post_date,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };

      const res = await fetch(
        post ? `${ENDPOINTS.INSTAGRAM}/${post.id}` : ENDPOINTS.INSTAGRAM,
        {
          method: post ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || (post ? "Update failed" : "Create failed"),
        );
      }

      showToast(
        post
          ? "Instagram post updated successfully"
          : "Instagram post created successfully",
        "ok",
      );

      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);

      showToast(
        err instanceof Error
          ? err.message
          : post
            ? "Update failed"
            : "Create failed",
        "err",
      );
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
          max-h-[88vh]
          overflow-y-auto
          rounded-2xl
          border
          border-[#D7D9DF]
          bg-white
          shadow-[0_8px_40px_rgba(0,0,0,0.12)]
        "
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D7D9DF] bg-white px-8 py-5">
          <h2 className="font-adamina text-3xl text-[#0F0F0F]">
            {post ? "Edit Instagram Post" : "New Instagram Post"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-[#707070] transition hover:bg-[#F6F6F6] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <Section title="Image">
            <ImageUploader
              value={imageFile}
              initialImage={form.image_url}
              onChange={(file) => setImageFile(file)}
            />
          </Section>

          <Section title="Content">
            <FormRow>
              <Textarea
                label="Caption"
                value={form.caption}
                onChange={(v) => update("caption", v)}
              />

              <Input
                label="Instagram Link"
                value={form.instagram_link}
                onChange={(v) => update("instagram_link", v)}
              />
            </FormRow>
          </Section>

          <Section title="Settings">
            <FormRow>
              <Input
                label="Post Date"
                type="date"
                value={form.post_date}
                onChange={(v) => update("post_date", v)}
              />

              <Input
                label="Sort Order"
                type="number"
                value={String(form.sort_order)}
                onChange={(v) => update("sort_order", Number(v))}
              />
            </FormRow>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Status
              </label>

              <select
                value={String(form.is_active)}
                onChange={(e) => update("is_active", e.target.value === "true")}
                className="
                  w-full
                  rounded-[10px]
                  border
                  border-[#D7D9DF]
                  bg-[#F6F6F6]
                  px-4
                  py-2.5
                  text-sm
                "
              >
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </Section>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#E6E6E6] bg-white px-8 py-5">
          <button
            onClick={onClose}
            className="rounded-full border border-[#D7D9DF] px-5 py-2 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSavePost}
            disabled={saving}
            className="
              rounded-full
              bg-black
              px-5
              py-2
              text-white
              disabled:opacity-50
              cursor-pointer
            "
          >
            {saving
              ? post
                ? "Saving..."
                : "Creating..."
              : post
                ? "Save Changes"
                : "Create Post"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="mb-5 border-b border-[#D7D9DF] pb-2">
        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#707070]">
          {title}
        </h3>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
  );
}

function Input({ label, value, onChange, type = "text", dir }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
        {label}
      </label>

      <input
        dir={dir}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-[10px]
          border
          border-[#D7D9DF]
          bg-[#F6F6F6]
          px-4
          py-2.5
          text-sm
          outline-none
          transition-all
          focus:border-[#285FE7]
          focus:bg-white
          focus:ring-4
          focus:ring-[#285FE7]/10
        "
      />
    </div>
  );
}

function Textarea({ label, value, onChange, dir }: Omit<FieldProps, "type">) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
        {label}
      </label>

      <textarea
        dir={dir}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          min-h-25
          w-full
          resize-y
          rounded-[10px]
          border
          border-[#D7D9DF]
          bg-[#F6F6F6]
          px-4
          py-2.5
          text-sm
          outline-none
          transition-all
          focus:border-[#285FE7]
          focus:bg-white
          focus:ring-4
          focus:ring-[#285FE7]/10
        "
      />
    </div>
  );
}
