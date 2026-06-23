"use client";

import { useState } from "react";
import CMSPages from "./CMSPages";
import CMSNavigation from "./CMSNavigation";

type CMSTab = "pages" | "navigation";

export default function CMSDashboard() {
  const [activeTab, setActiveTab] = useState<CMSTab>("pages");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#151515]">CMS</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage dynamic pages, sections, styles, and navigation.
          </p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "pages"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Pages
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("navigation")}
          className={`px-4 py-3 text-sm font-medium transition ${
            activeTab === "navigation"
              ? "border-b-2 border-black text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          Navigation
        </button>
      </div>

      {activeTab === "pages" && <CMSPages />}
      {activeTab === "navigation" && <CMSNavigation />}
    </div>
  );
}
