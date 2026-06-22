"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ImageUploader from "@/app/shared/ImageUploader";
import ImageGalleryUploader from "@/app/shared/ImageGalleryUploader";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";
import Book3D from "@/app/[locale]/services/[slug]/Book3D";
type Product = {
  id: number;

  slug: string;

  title_en: string;
  title_ar: string;

  subtitle_en?: string;
  subtitle_ar?: string;

  image_url?: string;

  is_active: boolean;

  description_en?: string;
  description_ar?: string;

  best_use_en?: string;
  best_use_ar?: string;

  eco_friendly_en?: string;
  eco_friendly_ar?: string;

  model_3d?: string;

  find_out_more_images?: string[];
  example_images?: string[];

  format_min_en?: string;
  format_min_ar?: string;

  format_max_en?: string;
  format_max_ar?: string;

  thickness_min_en?: string;
  thickness_min_ar?: string;

  thickness_max_en?: string;
  thickness_max_ar?: string;

  materials_en?: string;
  materials_ar?: string;

  extras_en?: string;
  extras_ar?: string;

  enhancements_en?: string;
  enhancements_ar?: string;
};
type Props = {
  onClose: () => void;
  onSaved?: () => void;
  product?: Product;
};
type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  type?: string;
};
export default function BindingForm({ onClose, onSaved, product }: Props) {
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title_en: product?.title_en || "",
    title_ar: product?.title_ar || "",

    subtitle_en: product?.subtitle_en || "",
    subtitle_ar: product?.subtitle_ar || "",

    slug: product?.slug || "",

    is_active: product?.is_active ?? true,

    description_en: product?.description_en || "",
    description_ar: product?.description_ar || "",

    best_use_en: product?.best_use_en || "",
    best_use_ar: product?.best_use_ar || "",

    eco_friendly_en: product?.eco_friendly_en || "",
    eco_friendly_ar: product?.eco_friendly_ar || "",

    model_3d: product?.model_3d || "",
    model_3d_file: null as File | null,
    image_file: null,

    find_out_more_images: product?.find_out_more_images || [],
    example_images: product?.example_images || [],

    format_min_en: product?.format_min_en || "",
    format_min_ar: product?.format_min_ar || "",
    format_max_en: product?.format_max_en || "",
    format_max_ar: product?.format_max_ar || "",

    thickness_min_en: product?.thickness_min_en || "",
    thickness_min_ar: product?.thickness_min_ar || "",
    thickness_max_en: product?.thickness_max_en || "",
    thickness_max_ar: product?.thickness_max_ar || "",

    materials_en: product?.materials_en || "",
    materials_ar: product?.materials_ar || "",

    extras_en: product?.extras_en || "",
    extras_ar: product?.extras_ar || "",

    enhancements_en: product?.enhancements_en || "",
    enhancements_ar: product?.enhancements_ar || "",
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

  const handleSaveProduct = async () => {
    try {
      if (!form.title_en.trim()) {
        showToast("Title is required", "err");
        return;
      }
      if (!form.image_file && !product?.image_url) {
        showToast("Main image is required", "err");
        return;
      }

      setSaving(true);
      const token = localStorage.getItem("admin_token");

      let image_url = product?.image_url || "";

      if (form.image_file) {
        image_url = await uploadImage(form.image_file);
      }

      const find_out_more_images = await Promise.all(
        form.find_out_more_images.map(async (item) => {
          if (typeof item === "string") {
            return item;
          }

          return await uploadImage(item);
        }),
      );

      const example_images = await Promise.all(
        form.example_images.map(async (item) => {
          if (typeof item === "string") {
            return item;
          }

          return await uploadImage(item);
        }),
      );
      let model_3d = form.model_3d;

      if (form.model_3d_file) {
        model_3d = await uploadImage(form.model_3d_file);
      }
      const payload = {
        slug: form.slug,

        title_en: form.title_en,
        title_ar: form.title_ar,

        subtitle_en: form.subtitle_en,
        subtitle_ar: form.subtitle_ar,

        image_url,

        is_active: form.is_active,

        description_en: form.description_en,
        description_ar: form.description_ar,

        best_use_en: form.best_use_en,
        best_use_ar: form.best_use_ar,

        eco_friendly_en: form.eco_friendly_en,
        eco_friendly_ar: form.eco_friendly_ar,

        model_3d,
        find_out_more_images,
        example_images,

        format_min_en: form.format_min_en,
        format_min_ar: form.format_min_ar,

        format_max_en: form.format_max_en,
        format_max_ar: form.format_max_ar,

        thickness_min_en: form.thickness_min_en,
        thickness_min_ar: form.thickness_min_ar,

        thickness_max_en: form.thickness_max_en,
        thickness_max_ar: form.thickness_max_ar,

        materials_en: form.materials_en,
        materials_ar: form.materials_ar,

        extras_en: form.extras_en,
        extras_ar: form.extras_ar,

        enhancements_en: form.enhancements_en,
        enhancements_ar: form.enhancements_ar,
      };

      const res = await fetch(
        product ? `${ENDPOINTS.PRODUCTS}/${product.id}` : ENDPOINTS.PRODUCTS,
        {
          method: product ? "PUT" : "POST",
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
          data.error || (product ? "Update failed" : "Create failed"),
        );
      }
      showToast(
        product
          ? "Product updated successfully"
          : "Product created successfully",
        "ok",
      );

      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);

      showToast(
        err instanceof Error
          ? err.message
          : product
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
  const generateSlug = (title: string, subtitle: string) =>
    `${title} ${subtitle}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  const previewModel =
    form.model_3d_file instanceof File
      ? URL.createObjectURL(form.model_3d_file)
      : form.model_3d;
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
            {product ? "Edit Binding" : "New Binding"}
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
                    ...(product
                      ? {}
                      : {
                          slug: generateSlug(v, prev.subtitle_en),
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
                label="Subtitle (EN)"
                value={form.subtitle_en}
                onChange={(v) => {
                  setForm((prev) => ({
                    ...prev,
                    subtitle_en: v,
                    ...(product
                      ? {}
                      : {
                          slug: generateSlug(prev.title_en, v),
                        }),
                  }));
                }}
              />

              <Input
                label="Subtitle (AR)"
                value={form.subtitle_ar}
                dir="rtl"
                onChange={(v) => update("subtitle_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Input
                label="Slug"
                value={form.slug}
                onChange={(v) => update("slug", v)}
              />{" "}
              <Select
                label="Active"
                value={String(form.is_active)}
                onChange={(v) => update("is_active", v === "true")}
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

            <FormRow>
              <Textarea
                label="Best Use (EN)"
                value={form.best_use_en}
                onChange={(v) => update("best_use_en", v)}
              />

              <Textarea
                label="Best Use (AR)"
                dir="rtl"
                value={form.best_use_ar}
                onChange={(v) => update("best_use_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Input
                label="Eco-Friendly (EN)"
                value={form.eco_friendly_en}
                onChange={(v) => update("eco_friendly_en", v)}
              />

              <Input
                label="Eco-Friendly (AR)"
                dir="rtl"
                value={form.eco_friendly_ar}
                onChange={(v) => update("eco_friendly_ar", v)}
              />
            </FormRow>
          </Section>

          <Section title="Images">
            <div>
              <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Card Image
              </label>

              <ImageUploader
                value={form.image_file}
                initialImage={product?.image_url}
                onChange={(file) => update("image_file", file)}
              />
            </div>

            <div>
              <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                3D Model (.glb)
              </label>

              {!previewModel ? (
                <label
                  className="
        flex h-28 cursor-pointer items-center justify-center
        rounded-xl border-2 border-dashed border-[#D7D9DF]
        bg-[#F8F8F8]
        hover:bg-[#F2F2F2]
      "
                >
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    className="hidden"
                    onChange={(e) =>
                      update("model_3d_file", e.target.files?.[0] || null)
                    }
                  />

                  <span className="text-sm text-[#707070]">
                    Upload 3D Model
                  </span>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-[#D7D9DF]">
                    <Book3D modelUrl={previewModel} height="200px" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-[#D7D9DF] bg-[#F8F8F8] px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">3D Model Attached</p>

                      <p className="text-xs text-[#707070]">
                        {form.model_3d_file instanceof File
                          ? form.model_3d_file.name
                          : "Current uploaded model"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          model_3d: "",
                          model_3d_file: null,
                        }))
                      }
                      className="
            rounded-full
            border
            border-[#F1C5C5]
            px-4
            py-2
            text-sm
            text-[#D64545]
            hover:bg-[#FFF5F5]
            cursor-pointer
          "
                    >
                      Remove Model
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Find Out More Images
              </label>

              <ImageGalleryUploader
                values={form.find_out_more_images}
                onChange={(images) => update("find_out_more_images", images)}
              />
            </div>

            <div className="mt-4">
              <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                Example Images
              </label>

              <ImageGalleryUploader
                values={form.example_images}
                onChange={(images) => update("example_images", images)}
              />
            </div>
          </Section>
          <Section title="Options — Format">
            <FormRow>
              <Input
                label="Format Min (EN)"
                value={form.format_min_en}
                onChange={(v) => update("format_min_en", v)}
              />

              <Input
                label="Format Min (AR)"
                value={form.format_min_ar}
                dir="rtl"
                onChange={(v) => update("format_min_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Input
                label="Format Max (EN)"
                value={form.format_max_en}
                onChange={(v) => update("format_max_en", v)}
              />

              <Input
                label="Format Max (AR)"
                value={form.format_max_ar}
                dir="rtl"
                onChange={(v) => update("format_max_ar", v)}
              />
            </FormRow>
          </Section>
          <Section title="Options — Thickness">
            <FormRow>
              <Input
                label="Thickness Min (EN)"
                value={form.thickness_min_en}
                onChange={(v) => update("thickness_min_en", v)}
              />

              <Input
                label="Thickness Min (AR)"
                value={form.thickness_min_ar}
                dir="rtl"
                onChange={(v) => update("thickness_min_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Input
                label="Thickness Max (EN)"
                value={form.thickness_max_en}
                onChange={(v) => update("thickness_max_en", v)}
              />

              <Input
                label="Thickness Max (AR)"
                value={form.thickness_max_ar}
                dir="rtl"
                onChange={(v) => update("thickness_max_ar", v)}
              />
            </FormRow>
          </Section>
          <Section title="Options — Materials / Extras / Enhancements">
            <FormRow>
              <Textarea
                label="Materials (EN)"
                value={form.materials_en}
                onChange={(v) => update("materials_en", v)}
              />

              <Textarea
                label="Materials (AR)"
                value={form.materials_ar}
                dir="rtl"
                onChange={(v) => update("materials_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Textarea
                label="Extras (EN)"
                value={form.extras_en}
                onChange={(v) => update("extras_en", v)}
              />

              <Textarea
                label="Extras (AR)"
                value={form.extras_ar}
                dir="rtl"
                onChange={(v) => update("extras_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Textarea
                label="Enhancements (EN)"
                value={form.enhancements_en}
                onChange={(v) => update("enhancements_en", v)}
              />

              <Textarea
                label="Enhancements (AR)"
                value={form.enhancements_ar}
                dir="rtl"
                onChange={(v) => update("enhancements_ar", v)}
              />
            </FormRow>
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
            onClick={handleSaveProduct}
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
              ? product
                ? "Saving..."
                : "Creating..."
              : product
                ? "Save Changes"
                : "Create Binding"}
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

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Select({ label, value, onChange }: SelectProps) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
        {label}
      </label>

      <select
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
          cursor-pointer
        "
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
  );
}
