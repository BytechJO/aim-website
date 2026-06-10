"use client";

export default function CoverGeneratorForm() {
  return (
    <aside className="w-full bg-[#F3F3F3] min-h-screen px-14 py-6">
      {/* Tabs */}
      <div className="flex items-center gap-8 text-[14px]">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" checked readOnly />
          <span>Cover</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" readOnly />
          <span>Jacket</span>
        </label>
      </div>

      {/* Project Name */}
      <div className="mt-8">
        <label className="block text-[13px] font-medium mb-2">
          Project name
        </label>

        <input
          placeholder="Enter name"
          className="w-full h-16 rounded-xl bg-white px-4 outline-none"
        />
      </div>

      {/* Width Height */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div>
          <label className="block text-[13px] font-medium mb-2">Width</label>

          <div className="h-16 bg-white rounded-xl px-4 flex items-center justify-between">
            <input
              type="number"
              defaultValue={165}
              className="outline-none w-full"
            />
            <span className="text-gray-500">mm</span>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-2">Height</label>

          <div className="h-16 bg-white rounded-xl px-4 flex items-center justify-between">
            <input
              type="number"
              defaultValue={235}
              className="outline-none w-full"
            />
            <span className="text-gray-500">mm</span>
          </div>
        </div>
      </div>

      {/* Binding */}
      <div className="mt-6">
        <label className="block text-[13px] font-medium mb-2">
          Binding type
        </label>

        <select className="w-full h-16 rounded-xl bg-white px-4 outline-none">
          <option>Softcover - perfect bound</option>
        </select>
      </div>

      {/* Page Count + Paper */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div>
          <label className="block text-[13px] font-medium mb-2">
            Page count
          </label>

          <input
            defaultValue={200}
            className="w-full h-16 rounded-xl bg-white px-4 outline-none"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium mb-2">
            Paper type
          </label>

          <select className="w-full h-16 rounded-xl bg-white px-4 outline-none">
            <option>Alto Creme</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
