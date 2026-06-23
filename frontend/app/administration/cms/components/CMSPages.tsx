"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import CMSPageForm, { CMSPage, CMSPageFormData } from "./CMSPageForm";
import CMSSections from "./CMSSections";

export default function CMSPages() {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sectionsPage, setSectionsPage] = useState<CMSPage | null>(null);
  const getToken = () => {
    return localStorage.getItem("admin_token") || "";
  };

  const loadPages = async () => {
    try {
      setLoading(true);

      const response = await fetch(ENDPOINTS.PAGES);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load pages");
      }

      setPages(data);
    } catch (error) {
      console.error("Load pages error:", error);
      alert("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPages();
  }, []);

  const openCreate = () => {
    setEditingPage(null);
    setShowForm(true);
  };

  const openEdit = (page: CMSPage) => {
    setEditingPage(page);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPage(null);
  };

  const savePage = async (formData: CMSPageFormData) => {
    try {
      setSaving(true);

      const url = editingPage
        ? ENDPOINTS.PAGE_BY_ID(editingPage.id)
        : ENDPOINTS.PAGES;

      const method = editingPage ? "PUT" : "POST";

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

      await loadPages();
      closeForm();
    } catch (error) {
      console.error("Save page error:", error);
      alert(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async (page: CMSPage) => {
    const ok = confirm(`Delete page "${page.title_en}"?`);

    if (!ok) return;

    try {
      setDeletingId(page.id);

      const response = await fetch(ENDPOINTS.PAGE_BY_ID(page.id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Delete failed");
      }

      await loadPages();
    } catch (error) {
      console.error("Delete page error:", error);
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };
  if (sectionsPage) {
    return (
      <CMSSections page={sectionsPage} onBack={() => setSectionsPage(null)} />
    );
  }
  return (
    <div className="rounded-3xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">Pages</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage website pages.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Page
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-40 items-center justify-center text-sm text-gray-500">
          Loading pages...
        </div>
      ) : pages.length === 0 ? (
        <div className="flex min-h-52 flex-col items-center justify-center px-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
            📄
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            No pages yet
          </h3>
          <p className="mt-1 max-w-md text-sm text-gray-500">
            Start by creating your first dynamic page. After that you can add
            sections and control its content.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-5 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create First Page
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-4 font-semibold">Page</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-gray-100 text-sm last:border-0 hover:bg-gray-50/70"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-950">
                      {page.title_en}
                    </div>
                    <div className="mt-1 text-gray-500" dir="rtl">
                      {page.title_ar}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                      /{page.slug}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        page.is_published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {page.is_published ? "Published" : "Draft"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {page.created_at
                      ? new Date(page.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(page)}
                        className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setSectionsPage(page)}
                        className="rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-white"
                      >
                        Sections
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === page.id}
                        onClick={() => deletePage(page)}
                        className="rounded-full border border-red-100 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === page.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CMSPageForm
        open={showForm}
        page={editingPage}
        saving={saving}
        onClose={closeForm}
        onSubmit={savePage}
      />
    </div>
  );
}
