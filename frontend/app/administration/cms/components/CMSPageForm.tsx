"use client";

import { useEffect, useState } from "react";

export type CMSPage = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  meta_title_en: string | null;
  meta_title_ar: string | null;
  meta_description_en: string | null;
  meta_description_ar: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

type Props = {
  open: boolean;
  page: CMSPage | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: CMSPageFormData) => void;
};

export type CMSPageFormData = {
  slug: string;
  title_en: string;
  title_ar: string;
  meta_title_en: string;
  meta_title_ar: string;
  meta_description_en: string;
  meta_description_ar: string;
  is_published: boolean;
};

const emptyForm: CMSPageFormData = {
  slug: "",
  title_en: "",
  title_ar: "",
  meta_title_en: "",
  meta_title_ar: "",
  meta_description_en: "",
  meta_description_ar: "",
  is_published: true,
};

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CMSPageForm({
  open,
  page,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CMSPageFormData>(emptyForm);

  useEffect(() => {
    if (page) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        slug: page.slug || "",
        title_en: page.title_en || "",
        title_ar: page.title_ar || "",
        meta_title_en: page.meta_title_en || "",
        meta_title_ar: page.meta_title_ar || "",
        meta_description_en: page.meta_description_en || "",
        meta_description_ar: page.meta_description_ar || "",
        is_published: page.is_published ?? true,
      });
    } else {
      setForm(emptyForm);
    }
  }, [page, open]);

  if (!open) return null;

  const updateField = (key: keyof CMSPageFormData, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title_en: value,
      slug: page ? prev.slug : generateSlug(value),
    }));
  };

  const handleSubmit = () => {
    if (!form.title_en.trim() || !form.title_ar.trim()) {
      alert("Title EN and Title AR are required");
      return;
    }

    onSubmit({
      ...form,
      slug: form.slug.trim() || generateSlug(form.title_en),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              {page ? "Edit Page" : "Add Page"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create dynamic website pages for the CMS.
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
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Title EN
              </span>
              <input
                value={form.title_en}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="About Us"
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
                placeholder="من نحن"
                dir="rtl"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-700">Slug</span>
            <input
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="about-us"
            />
            <span className="text-xs text-gray-400">
              Example: about-us. The page URL will use this slug.
            </span>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Meta Title EN
              </span>
              <input
                value={form.meta_title_en}
                onChange={(e) => updateField("meta_title_en", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="About AIM"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Meta Title AR
              </span>
              <input
                value={form.meta_title_ar}
                onChange={(e) => updateField("meta_title_ar", e.target.value)}
                className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="عن AIM"
                dir="rtl"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Meta Description EN
              </span>
              <textarea
                value={form.meta_description_en}
                onChange={(e) =>
                  updateField("meta_description_en", e.target.value)
                }
                className="min-h-28 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="Short SEO description..."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-700">
                Meta Description AR
              </span>
              <textarea
                value={form.meta_description_ar}
                onChange={(e) =>
                  updateField("meta_description_ar", e.target.value)
                }
                className="min-h-28 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="وصف قصير لمحركات البحث..."
                dir="rtl"
              />
            </label>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-4">
            <div>
              <div className="text-sm font-medium text-gray-800">Published</div>
              <div className="text-xs text-gray-400">
                Show this page on the website.
              </div>
            </div>

            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => updateField("is_published", e.target.checked)}
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
            {saving ? "Saving..." : page ? "Save Changes" : "Create Page"}
          </button>
        </div>
      </div>
    </div>
  );
}
