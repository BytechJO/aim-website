"use client";

import Image from "next/image";

type Props = {
  value: File | null;
  initialImage?: string;
  onChange: (file: File | null) => void;
};

export default function ImageUploader({
  value,
  initialImage,
  onChange,
}: Props) {
  const preview = value ? URL.createObjectURL(value) : initialImage || null;

  return (
    <label
      className="
        flex
        min-h-40
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
        border-[#D7D9DF]
        bg-[#FAFAFA]
        transition
        hover:border-[#285FE7]
      "
    >
      <input
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            onChange(file);
          }
        }}
      />
      {preview  ? (
        <div className="flex flex-col items-center p-2">
          <Image
            src={preview as string}
            alt="uploaded preview"
            width={280}
            height={140}
            unoptimized
            className="max-h-35 rounded-lg object-contain"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(null);
            }}
            className="
        mt-3
        rounded-full
        border
        border-red-200
        px-4
        py-1.5
        text-[11px]
        font-semibold
        text-red-600
        transition
        hover:bg-red-50
        cursor-pointer
      "
          >
            Remove Image
          </button>
        </div>
      ) : (
        <>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#D7D9DF] bg-white">
            ↑
          </div>

          <p className="text-sm font-medium">Click or drag to upload</p>

          <p className="mt-1 text-xs text-[#B7B7B7]">PNG · JPG · SVG · WebP</p>
        </>
      )}
    </label>
  );
}
