"use client";

export default function CMSNavigation() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Navigation</h2>
          <p className="text-sm text-gray-500">
            Manage navbar links and dropdowns.
          </p>
        </div>

        <button
          type="button"
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
        >
          Add Link
        </button>
      </div>

      <div className="text-sm text-gray-500">
        Navigation table will be here.
      </div>
    </div>
  );
}
