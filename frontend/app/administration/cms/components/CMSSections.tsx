"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import { CMSPage } from "./CMSPageForm";
import CMSSectionForm, {
  CMSSection,
  CMSSectionFormData,
} from "./CMSSectionForm";

type Props = {
  page: CMSPage;
  onBack: () => void;
};

export default function CMSSections({ page, onBack }: Props) {
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<CMSSection | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getToken = () => {
    return localStorage.getItem("admin_token") || "";
  };

  const loadSections = async () => {
    try {
      setLoading(true);

      const response = await fetch(ENDPOINTS.PAGE_SECTIONS_BY_PAGE(page.id));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load sections");
      }

      setSections(data);
    } catch (error) {
      console.error("Load sections error:", error);
      alert("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSections();
  }, [page.id]);

  const openCreate = () => {
    setEditingSection(null);
    setShowForm(true);
  };

  const openEdit = (section: CMSSection) => {
    setEditingSection(section);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSection(null);
  };

  const saveSection = async (formData: CMSSectionFormData) => {
    try {
      setSaving(true);

      const url = editingSection
        ? ENDPOINTS.PAGE_SECTION(editingSection.id)
        : ENDPOINTS.PAGE_SECTIONS_BY_PAGE(page.id);

      const method = editingSection ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Save failed");
      }

      await loadSections();
      closeForm();
    } catch (error) {
      console.error("Save section error:", error);
      alert(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (section: CMSSection) => {
    const ok = confirm(`Delete section "${section.section_type}"?`);

    if (!ok) return;

    try {
      setDeletingId(section.id);

      const response = await fetch(ENDPOINTS.PAGE_SECTION(section.id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Delete failed");
      }

      await loadSections();
    } catch (error) {
      console.error("Delete section error:", error);
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 text-sm font-medium text-gray-500 hover:text-black"
          >
            ← Back to pages
          </button>

          <h2 className="text-lg font-semibold text-gray-950">
            Sections: {page.title_en}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage sections for /{page.slug}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Section
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center text-sm text-gray-500">
          Loading sections...
        </div>
      ) : sections.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
            🧩
          </div>

          <h3 className="text-base font-semibold text-gray-900">
            No sections yet
          </h3>

          <p className="mt-1 max-w-md text-sm text-gray-500">
            Add the first section to start building this page.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-5 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create First Section
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sections.map((section) => (
                <tr
                  key={section.id}
                  className="border-b border-gray-100 text-sm last:border-0 hover:bg-gray-50/70"
                >
                  <td className="px-6 py-4 text-gray-500">
                    #{section.sort_order}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      {section.section_type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-950">
                      {section.title_en || "-"}
                    </div>
                    <div className="mt-1 text-gray-500" dir="rtl">
                      {section.title_ar || "-"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        section.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {section.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {section.image_url ? "Yes" : "No"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(section)}
                        className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === section.id}
                        onClick={() => deleteSection(section)}
                        className="rounded-full border border-red-100 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === section.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CMSSectionForm
        open={showForm}
        section={editingSection}
        saving={saving}
        onClose={closeForm}
        onSubmit={saveSection}
      />
    </div>
  );
}
