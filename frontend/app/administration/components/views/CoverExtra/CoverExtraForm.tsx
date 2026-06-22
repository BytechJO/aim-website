"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ImageGalleryUploader from "@/app/shared/ImageGalleryUploader";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";

type CoverExtra = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: (string | File)[];
  is_active?: boolean;
};

type Props = {
  onClose: () => void;
  onSaved?: () => void;
  coverExtra?: CoverExtra;
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  type?: string;
};

export default function CoverExtraForm({
  onClose,
  onSaved,
  coverExtra,
}: Props) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title_en: coverExtra?.title_en || "",
    title_ar: coverExtra?.title_ar || "",
    slug: coverExtra?.slug || "",
    description_en: coverExtra?.description_en || "",
    description_ar: coverExtra?.description_ar || "",
    image_url: coverExtra?.image_url || [],
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

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  type FormValue = string | number | boolean | File | (string | File)[] | null;

  const update = (key: string, value: FormValue) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveCoverExtra = async () => {
    try {
      if (!form.title_en.trim()) {
        showToast("Title is required", "err");
        return;
      }

      setSaving(true);

      const token = localStorage.getItem("admin_token");

      const image_url = await Promise.all(
        form.image_url.map(async (item) => {
          if (typeof item === "string") {
            return item;
          }

          return await uploadImage(item);
        }),
      );

      const payload = {
        slug: form.slug,
        title_en: form.title_en,
        title_ar: form.title_ar,
        description_en: form.description_en,
        description_ar: form.description_ar,
        image_url,
        is_active: true,
      };

      const res = await fetch(
        coverExtra
          ? `${ENDPOINTS.COVER_EXTRAS}/${coverExtra.id}`
          : ENDPOINTS.COVER_EXTRAS,
        {
          method: coverExtra ? "PUT" : "POST",
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
          data.error || (coverExtra ? "Update failed" : "Create failed"),
        );
      }

      showToast(
        coverExtra
          ? "Cover Extra updated successfully"
          : "Cover Extra created successfully",
        "ok",
      );

      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);

      showToast(
        err instanceof Error
          ? err.message
          : coverExtra
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
            {coverExtra ? "Edit Cover Extra" : "New Cover Extra"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-[#707070] transition hover:bg-[#F6F6F6] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <Section title="Basic Info">
            <FormRow>
              <Input
                label="Title (English)"
                value={form.title_en}
                onChange={(v) => {
                  setForm((prev) => ({
                    ...prev,
                    title_en: v,
                    ...(coverExtra
                      ? {}
                      : {
                          slug: generateSlug(v),
                        }),
                  }));
                }}
              />

              <Input
                label="Title (Arabic)"
                dir="rtl"
                value={form.title_ar}
                onChange={(v) => update("title_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Input
                label="Slug"
                value={form.slug}
                onChange={(v) => update("slug", v)}
              />
            </FormRow>
          </Section>

          <Section title="Content">
            <FormRow>
              <Textarea
                label="Description (EN)"
                value={form.description_en}
                onChange={(v) => update("description_en", v)}
              />

              <Textarea
                label="Description (AR)"
                dir="rtl"
                value={form.description_ar}
                onChange={(v) => update("description_ar", v)}
              />
            </FormRow>
          </Section>

          <Section title="Images">
            <ImageGalleryUploader
              values={form.image_url}
              onChange={(images) => update("image_url", images)}
            />
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
            onClick={handleSaveCoverExtra}
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
              ? coverExtra
                ? "Saving..."
                : "Creating..."
              : coverExtra
                ? "Save Changes"
                : "Create Cover Extra"}
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
        rows={4}
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
