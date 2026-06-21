"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ImageGalleryUploader from "@/app/shared/ImageGalleryUploader";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";
type Enhancement = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: (string | File)[];
  sub_enhancements?: unknown[];
  sort_order: number;
};
type SubEnhancement = {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url: (string | File)[];
  sort_order: number;
};
type Props = {
  onClose: () => void;
  onSaved?: () => void;
  enhancement?: Enhancement;
};
type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  type?: string;
};
export default function EnhancementForm({
  onClose,
  onSaved,
  enhancement,
}: Props) {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title_en: enhancement?.title_en || "",
    title_ar: enhancement?.title_ar || "",
    slug: enhancement?.slug || "",
    description_en: enhancement?.description_en || "",
    description_ar: enhancement?.description_ar || "",
    sort_order: enhancement?.sort_order || 0,
    image_url: enhancement?.image_url || [],
    sub_enhancements: (enhancement?.sub_enhancements as SubEnhancement[]) || [],
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

  const handleSaveEnhancement = async () => {
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

      const sub_enhancements = await Promise.all(
        form.sub_enhancements.map(async (sub) => ({
          ...sub,

          image_url: await Promise.all(
            sub.image_url.map(async (item) => {
              if (typeof item === "string") {
                return item;
              }

              return await uploadImage(item);
            }),
          ),
        })),
      );

      const payload = {
        slug: form.slug,

        title_en: form.title_en,
        title_ar: form.title_ar,

        description_en: form.description_en,
        description_ar: form.description_ar,

        image_url,

        sort_order: Number(form.sort_order) || 0,

        sub_enhancements,
      };

      const res = await fetch(
        enhancement
          ? `${ENDPOINTS.ENHANCEMENTS}/${enhancement.id}`
          : ENDPOINTS.ENHANCEMENTS,
        {
          method: enhancement ? "PUT" : "POST",
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
          data.error || (enhancement ? "Update failed" : "Create failed"),
        );
      }

      showToast(
        enhancement
          ? "Enhancement updated successfully"
          : "Enhancement created successfully",
        "ok",
      );

      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);

      showToast(
        err instanceof Error
          ? err.message
          : enhancement
            ? "Update failed"
            : "Create failed",
        "err",
      );
    } finally {
      setSaving(false);
    }
  };
  type FormValue = string | number | boolean | File | (string | File)[] | null;
  const update = (key: string, value: FormValue) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const addSubEnhancement = () => {
    setForm((prev) => ({
      ...prev,
      sub_enhancements: [
        ...(prev.sub_enhancements as SubEnhancement[]),
        {
          title_en: "",
          title_ar: "",
          description_en: "",
          description_ar: "",
          image_url: [],
          sort_order: (prev.sub_enhancements as SubEnhancement[]).length,
        },
      ],
    }));
  };
  const removeSubEnhancement = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sub_enhancements: (prev.sub_enhancements as SubEnhancement[]).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const moveSubEnhancement = (index: number, dir: number) => {
    const arr = [...(form.sub_enhancements as SubEnhancement[])];

    const ni = index + dir;

    if (ni < 0 || ni >= arr.length) return;

    [arr[index], arr[ni]] = [arr[ni], arr[index]];

    setForm((prev) => ({
      ...prev,
      sub_enhancements: arr,
    }));
  };

  const updateSubEnhancement = (
    index: number,
    key: keyof SubEnhancement,
    value: SubEnhancement[keyof SubEnhancement],
  ) => {
    const arr = [...(form.sub_enhancements as SubEnhancement[])];

    arr[index] = {
      ...arr[index],
      [key]: value,
    };

    setForm((prev) => ({
      ...prev,
      sub_enhancements: arr,
    }));
  };
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
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
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D7D9DF] bg-white px-8 py-5">
          <h2 className="font-adamina text-3xl text-[#0F0F0F]">
            {enhancement ? "Edit Binding" : "New Binding"}
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
                    ...(enhancement
                      ? {}
                      : {
                          slug: generateSlug(v),
                        }),
                  }));
                }}
              />

              <Input
                label="Title (Arabic)"
                value={form.title_ar}
                dir="rtl"
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

            <FormRow>
              <Input
                label="Sort Order"
                type="number"
                value={String(form.sort_order)}
                onChange={(v) => update("sort_order", Number(v))}
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
          <Section title="Sub Enhancements">
            <button
              type="button"
              onClick={addSubEnhancement}
              className="mb-4 rounded-full bg-black px-4 py-2 text-white cursor-pointer"
            >
              + Add Sub Enhancement
            </button>

            {(form.sub_enhancements as SubEnhancement[]).map((sub, index) => (
              <div
                key={index}
                className="mb-5 rounded-xl border border-[#D7D9DF] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold">Sub Enhancement {index + 1}</h4>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveSubEnhancement(index, -1)}
                      disabled={index === 0}
                      title="Move up"
                      className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#D7D9DF]
      bg-white text-sm text-[#555]
      transition
      hover:-translate-y-0.5 hover:bg-[#F6F6F6] hover:text-black
      disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0
      cursor-pointer
    "
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      onClick={() => moveSubEnhancement(index, 1)}
                      disabled={index === form.sub_enhancements.length - 1}
                      title="Move down"
                      className="
      flex h-8 w-8 items-center justify-center
      rounded-full border border-[#D7D9DF]
      bg-white text-sm text-[#555]
      transition
      hover:translate-y-0.5 hover:bg-[#F6F6F6] hover:text-black
      disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0
      cursor-pointer
    "
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() => removeSubEnhancement(index)}
                      title="Delete"
                      className="
      ml-1 flex h-8 items-center gap-1.5
      rounded-full border border-[#F1C5C5]
      bg-[#FFF8F8]
      px-3
      text-xs font-semibold text-[#D64545]
      transition
      hover:-translate-y-0.5 hover:bg-[#FFF0F0] hover:shadow-sm
      active:translate-y-0
      cursor-pointer
    "
                    >
                      <span className="text-sm leading-none">×</span>
                      Delete
                    </button>
                  </div>
                </div>

                <FormRow>
                  <Input
                    label="Title EN"
                    value={sub.title_en}
                    onChange={(v) => updateSubEnhancement(index, "title_en", v)}
                  />

                  <Input
                    label="Title AR"
                    dir="rtl"
                    value={sub.title_ar}
                    onChange={(v) => updateSubEnhancement(index, "title_ar", v)}
                  />
                </FormRow>

                <FormRow>
                  <Textarea
                    label="Description EN"
                    value={sub.description_en}
                    onChange={(v) =>
                      updateSubEnhancement(index, "description_en", v)
                    }
                  />

                  <Textarea
                    label="Description AR"
                    dir="rtl"
                    value={sub.description_ar}
                    onChange={(v) =>
                      updateSubEnhancement(index, "description_ar", v)
                    }
                  />
                </FormRow>

                <div className="mt-4">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                    Images
                  </label>

                  <ImageGalleryUploader
                    values={sub.image_url}
                    onChange={(images) =>
                      updateSubEnhancement(index, "image_url", images)
                    }
                  />
                </div>

                <div className="mt-4">
                  <Input
                    label="Sort Order"
                    type="number"
                    value={String(sub.sort_order)}
                    onChange={(v) =>
                      updateSubEnhancement(index, "sort_order", Number(v))
                    }
                  />
                </div>
              </div>
            ))}
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
            onClick={handleSaveEnhancement}
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
              ? enhancement
                ? "Saving..."
                : "Creating..."
              : enhancement
                ? "Save Changes"
                : "Create Enhancement"}
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
