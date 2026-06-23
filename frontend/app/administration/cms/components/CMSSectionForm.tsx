"use client";

import { useEffect, useState } from "react";

export type CMSSection = {
  id: number;
  page_id: number;
  section_type: string;

  title_en: string | null;
  title_ar: string | null;

  subtitle_en: string | null;
  subtitle_ar: string | null;

  description_en: string | null;
  description_ar: string | null;

  image_url: string | null;

  cta_label_en: string | null;
  cta_label_ar: string | null;
  cta_url: string | null;

  content: Record<string, unknown>;
  styles: Record<string, unknown>;

  sort_order: number;
  is_active: boolean;

  created_at: string;
  updated_at: string;
};

export type CMSSectionFormData = {
  section_type: string;

  title_en: string;
  title_ar: string;

  subtitle_en: string;
  subtitle_ar: string;

  description_en: string;
  description_ar: string;

  image_url: string;

  cta_label_en: string;
  cta_label_ar: string;
  cta_url: string;

  content: Record<string, unknown>;
  styles: Record<string, unknown>;

  is_active: boolean;
};

type Props = {
  open: boolean;
  section: CMSSection | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: CMSSectionFormData) => void;
};

const emptyForm: CMSSectionFormData = {
  section_type: "hero",

  title_en: "",
  title_ar: "",

  subtitle_en: "",
  subtitle_ar: "",

  description_en: "",
  description_ar: "",

  image_url: "",

  cta_label_en: "",
  cta_label_ar: "",
  cta_url: "",

  content: {},
  styles: {
    background_color: "#ffffff",
    text_color: "#111111",
    layout: "image_right",
    alignment: "start",
    padding_top: "80px",
    padding_bottom: "80px",
  },

  is_active: true,
};

const sectionTypes = [
  "hero",
  "text_image",
  "cards",
  "gallery",
  "faq",
  "cta",
  "products_grid",
  "news_grid",
];

export default function CMSSectionForm({
  open,
  section,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CMSSectionFormData>(emptyForm);
  const [contentText, setContentText] = useState("{}");
  const [stylesText, setStylesText] = useState(
    JSON.stringify(emptyForm.styles, null, 2),
  );

  useEffect(() => {
    if (section) {
      const nextForm: CMSSectionFormData = {
        section_type: section.section_type || "hero",

        title_en: section.title_en || "",
        title_ar: section.title_ar || "",

        subtitle_en: section.subtitle_en || "",
        subtitle_ar: section.subtitle_ar || "",

        description_en: section.description_en || "",
        description_ar: section.description_ar || "",

        image_url: section.image_url || "",

        cta_label_en: section.cta_label_en || "",
        cta_label_ar: section.cta_label_ar || "",
        cta_url: section.cta_url || "",

        content: section.content || {},
        styles: section.styles || {},

        is_active: section.is_active ?? true,
      };

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(nextForm);
      setContentText(JSON.stringify(nextForm.content || {}, null, 2));
      setStylesText(JSON.stringify(nextForm.styles || {}, null, 2));
    } else {
      setForm(emptyForm);
      setContentText("{}");
      setStylesText(JSON.stringify(emptyForm.styles, null, 2));
    }
  }, [section, open]);

  if (!open) return null;

  const updateField = (
    key: keyof CMSSectionFormData,
    value: string | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.section_type.trim()) {
      alert("Section type is required");
      return;
    }

    let parsedContent: Record<string, unknown> = {};
    let parsedStyles: Record<string, unknown> = {};

    try {
      parsedContent = JSON.parse(contentText || "{}");
    } catch {
      alert("Content JSON is invalid");
      return;
    }

    try {
      parsedStyles = JSON.parse(stylesText || "{}");
    } catch {
      alert("Styles JSON is invalid");
      return;
    }

    onSubmit({
      ...form,
      content: parsedContent,
      styles: parsedStyles,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              {section ? "Edit Section" : "Add Section"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add content and style for this page section.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        <div className="grid gap-5 px-6 py-6">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-700">
              Section Type
            </span>

            <select
              value={form.section_type}
              onChange={(e) => updateField("section_type", e.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
            >
              {sectionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Title EN
              </span>
              <input
                value={form.title_en}
                onChange={(e) => updateField("title_en", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="Section title"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Title AR
              </span>
              <input
                value={form.title_ar}
                onChange={(e) => updateField("title_ar", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="عنوان السكشن"
                dir="rtl"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Subtitle EN
              </span>
              <input
                value={form.subtitle_en}
                onChange={(e) => updateField("subtitle_en", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Subtitle AR
              </span>
              <input
                value={form.subtitle_ar}
                onChange={(e) => updateField("subtitle_ar", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                dir="rtl"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Description EN
              </span>
              <textarea
                value={form.description_en}
                onChange={(e) => updateField("description_en", e.target.value)}
                className="min-h-28 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Description AR
              </span>
              <textarea
                value={form.description_ar}
                onChange={(e) => updateField("description_ar", e.target.value)}
                className="min-h-28 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                dir="rtl"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-700">Image URL</span>
            <input
              value={form.image_url}
              onChange={(e) => updateField("image_url", e.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="/uploads/image.jpg"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                CTA Label EN
              </span>
              <input
                value={form.cta_label_en}
                onChange={(e) => updateField("cta_label_en", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                CTA Label AR
              </span>
              <input
                value={form.cta_label_ar}
                onChange={(e) => updateField("cta_label_ar", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                dir="rtl"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">CTA URL</span>
              <input
                value={form.cta_url}
                onChange={(e) => updateField("cta_url", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="/contact"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Content JSON
              </span>
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                className="min-h-48 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs outline-none focus:border-black"
                spellCheck={false}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Styles JSON
              </span>
              <textarea
                value={stylesText}
                onChange={(e) => setStylesText(e.target.value)}
                className="min-h-48 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs outline-none focus:border-black"
                spellCheck={false}
              />
            </label>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-4">
            <div>
              <div className="text-sm font-medium text-gray-800">Active</div>
              <div className="text-xs text-gray-400">
                Show this section on the page.
              </div>
            </div>

            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
              className="h-5 w-5 accent-black"
            />
          </label>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit}
            className="rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : section ? "Save Changes" : "Create Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
