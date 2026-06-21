"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ImageUploader from "@/app/shared/ImageUploader";
import ImageGalleryUploader from "@/app/shared/ImageGalleryUploader";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";

type ImageValue = string | File | null;

type NewsBlock =
  | { type: "content"; content_en: string; content_ar: string }
  | { type: "image"; image: ImageValue }
  | { type: "gallery"; images: (string | File)[] }
  | {
      type: "list";
      list_style: "bullet" | "numbered";
      items_en: string[];
      items_ar: string[];
    };

type NewsSection = {
  title_en: string;
  title_ar: string;
  blocks: NewsBlock[];
};

type NewsItem = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  hero_image?: string;
  thumbnail_image?: string;
  title_color?: string;
  sections?: NewsSection[];
  is_published: boolean;
  sort_order: number;
};

type Props = {
  onClose: () => void;
  onSaved?: () => void;
  news?: NewsItem;
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  type?: string;
};

export default function NewsForm({ onClose, onSaved, news }: Props) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title_en: news?.title_en || "",
    title_ar: news?.title_ar || "",
    slug: news?.slug || "",
    description_en: news?.description_en || "",
    description_ar: news?.description_ar || "",
    hero_image: (news?.hero_image || null) as ImageValue,
    thumbnail_image: (news?.thumbnail_image || null) as ImageValue,
    title_color: news?.title_color || "#000000",
    sections: (news?.sections || []) as NewsSection[],
    is_published: news?.is_published ?? false,
    sort_order: news?.sort_order || 0,
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

    if (!res.ok) throw new Error(data.error || "Upload failed");

    return data.url as string;
  };

  const uploadMaybe = async (image: ImageValue) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return await uploadImage(image);
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const update = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title_en: "",
          title_ar: "",
          blocks: [],
        },
      ],
    }));
  };

  const removeSection = (sectionIndex: number) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sectionIndex),
    }));
  };

  const moveSection = (sectionIndex: number, dir: number) => {
    const arr = [...form.sections];
    const next = sectionIndex + dir;

    if (next < 0 || next >= arr.length) return;

    [arr[sectionIndex], arr[next]] = [arr[next], arr[sectionIndex]];

    setForm((prev) => ({ ...prev, sections: arr }));
  };

  const updateSection = (
    sectionIndex: number,
    key: "title_en" | "title_ar",
    value: string,
  ) => {
    const arr = [...form.sections];

    arr[sectionIndex] = {
      ...arr[sectionIndex],
      [key]: value,
    };

    setForm((prev) => ({ ...prev, sections: arr }));
  };

  const addBlock = (sectionIndex: number, type: NewsBlock["type"]) => {
    const arr = [...form.sections];

    let block: NewsBlock;

    if (type === "content") {
      block = { type: "content", content_en: "", content_ar: "" };
    } else if (type === "image") {
      block = { type: "image", image: null };
    } else if (type === "gallery") {
      block = { type: "gallery", images: [] };
    } else {
      block = {
        type: "list",
        list_style: "bullet",
        items_en: [""],
        items_ar: [""],
      };
    }

    arr[sectionIndex] = {
      ...arr[sectionIndex],
      blocks: [...arr[sectionIndex].blocks, block],
    };

    setForm((prev) => ({ ...prev, sections: arr }));
  };

  const removeBlock = (sectionIndex: number, blockIndex: number) => {
    const arr = [...form.sections];

    arr[sectionIndex] = {
      ...arr[sectionIndex],
      blocks: arr[sectionIndex].blocks.filter((_, i) => i !== blockIndex),
    };

    setForm((prev) => ({ ...prev, sections: arr }));
  };

  const moveBlock = (sectionIndex: number, blockIndex: number, dir: number) => {
    const arr = [...form.sections];
    const blocks = [...arr[sectionIndex].blocks];
    const next = blockIndex + dir;

    if (next < 0 || next >= blocks.length) return;

    [blocks[blockIndex], blocks[next]] = [blocks[next], blocks[blockIndex]];

    arr[sectionIndex] = {
      ...arr[sectionIndex],
      blocks,
    };

    setForm((prev) => ({ ...prev, sections: arr }));
  };

  const updateBlock = (
    sectionIndex: number,
    blockIndex: number,
    value: NewsBlock,
  ) => {
    const arr = [...form.sections];
    const blocks = [...arr[sectionIndex].blocks];

    blocks[blockIndex] = value;

    arr[sectionIndex] = {
      ...arr[sectionIndex],
      blocks,
    };

    setForm((prev) => ({ ...prev, sections: arr }));
  };

  const handleSaveNews = async () => {
    try {
      if (!form.title_en.trim()) {
        showToast("Title is required", "err");
        return;
      }

      if (!form.hero_image) {
        showToast("Hero image is required", "err");
        return;
      }
      setSaving(true);

      const token = localStorage.getItem("admin_token");

      const hero_image = await uploadMaybe(form.hero_image);
      const thumbnail_image = await uploadMaybe(form.thumbnail_image);

      const sections = await Promise.all(
        form.sections.map(async (section) => ({
          ...section,
          blocks: await Promise.all(
            section.blocks.map(async (block) => {
              if (block.type === "image") {
                return {
                  ...block,
                  image: await uploadMaybe(block.image),
                };
              }

              if (block.type === "gallery") {
                return {
                  ...block,
                  images: await Promise.all(
                    block.images.map(async (img) => {
                      if (typeof img === "string") return img;
                      return await uploadImage(img);
                    }),
                  ),
                };
              }

              return block;
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
        hero_image,
        thumbnail_image,
        title_color: form.title_color,
        sections,
        is_published: form.is_published,
        sort_order: Number(form.sort_order) || 0,
      };

      const res = await fetch(
        news ? `${ENDPOINTS.NEWS_ADMIN}/${news.id}` : ENDPOINTS.NEWS_ADMIN,
        {
          method: news ? "PUT" : "POST",
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
          data.error || (news ? "Update failed" : "Create failed"),
        );
      }

      showToast(
        news ? "News updated successfully" : "News created successfully",
        "ok",
      );

      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 24 }}
        className="max-h-[88vh] w-full max-w-220 overflow-y-auto rounded-2xl border border-[#D7D9DF] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D7D9DF] bg-white px-8 py-5">
          <h2 className="font-adamina text-3xl text-[#0F0F0F]">
            {news ? "Edit News" : "New News"}
          </h2>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-2 text-[#707070] transition hover:bg-[#F6F6F6]"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          <Section title="Basic Info">
            <FormRow>
              <Input
                label="Title EN"
                value={form.title_en}
                onChange={(v) => {
                  setForm((prev) => ({
                    ...prev,
                    title_en: v,
                    ...(news ? {} : { slug: generateSlug(v) }),
                  }));
                }}
              />

              <Input
                label="Title AR"
                dir="rtl"
                value={form.title_ar}
                onChange={(v) => update("title_ar", v)}
              />
            </FormRow>

            <FormRow>
              <Input
                label="Slug"
                value={form.slug}
                onChange={(v) => update("slug", v)}
              />

              <Input
                label="Sort Order"
                type="number"
                value={String(form.sort_order)}
                onChange={(v) => update("sort_order", Number(v))}
              />
            </FormRow>

            <FormRow>
              <Select
                label="Published"
                value={String(form.is_published)}
                onChange={(v) => update("is_published", v === "true")}
              />

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                  Title Color
                </label>

                <input
                  type="color"
                  value={form.title_color}
                  onChange={(e) => update("title_color", e.target.value)}
                  className="h-11 w-full cursor-pointer rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] p-1"
                />
              </div>
            </FormRow>
          </Section>

          <Section title="Images">
            <FormRow>
              <div>
                <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                  Hero Image
                </label>

                <ImageUploader
                  value={
                    form.hero_image instanceof File ? form.hero_image : null
                  }
                  initialImage={
                    typeof form.hero_image === "string"
                      ? form.hero_image
                      : undefined
                  }
                  onChange={(file) => update("hero_image", file)}
                />
              </div>

              <div>
                <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
                  Thumbnail Image
                </label>

                <ImageUploader
                  value={
                    form.thumbnail_image instanceof File
                      ? form.thumbnail_image
                      : null
                  }
                  initialImage={
                    typeof form.thumbnail_image === "string"
                      ? form.thumbnail_image
                      : undefined
                  }
                  onChange={(file) => update("thumbnail_image", file)}
                />
              </div>
            </FormRow>
          </Section>

          <Section title="Description">
            <FormRow>
              <Textarea
                label="Description EN"
                value={form.description_en}
                onChange={(v) => update("description_en", v)}
              />

              <Textarea
                label="Description AR"
                dir="rtl"
                value={form.description_ar}
                onChange={(v) => update("description_ar", v)}
              />
            </FormRow>
          </Section>

          <Section title="Sections">
            <button
              type="button"
              onClick={addSection}
              className="mb-5 cursor-pointer rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              + Add Section
            </button>

            {form.sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="mb-6 rounded-2xl border border-[#D7D9DF] bg-white p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h4 className="flex items-center gap-2 font-semibold text-[#111]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F3F4F6] text-xs font-bold text-[#555]">
                      {sectionIndex + 1}
                    </span>
                    Section
                  </h4>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={sectionIndex === 0}
                      onClick={() => moveSection(sectionIndex, -1)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D7D9DF] text-sm disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={sectionIndex === form.sections.length - 1}
                      onClick={() => moveSection(sectionIndex, 1)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D7D9DF] text-sm disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      ↓
                    </button>

                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="ml-1 flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-[#F1C5C5] bg-[#FFF8F8] px-3 text-xs font-semibold text-[#D64545]"
                    >
                      × Delete
                    </button>
                  </div>
                </div>

                <FormRow>
                  <Input
                    label="Section Title EN"
                    value={section.title_en}
                    onChange={(v) => updateSection(sectionIndex, "title_en", v)}
                  />

                  <Input
                    label="Section Title AR"
                    dir="rtl"
                    value={section.title_ar}
                    onChange={(v) => updateSection(sectionIndex, "title_ar", v)}
                  />
                </FormRow>

                <div className="mt-5 flex flex-wrap gap-2">
                  <BlockButton
                    label="+ Content"
                    onClick={() => addBlock(sectionIndex, "content")}
                  />
                  <BlockButton
                    label="+ Image"
                    onClick={() => addBlock(sectionIndex, "image")}
                  />
                  <BlockButton
                    label="+ Gallery"
                    onClick={() => addBlock(sectionIndex, "gallery")}
                  />
                  <BlockButton
                    label="+ List"
                    onClick={() => addBlock(sectionIndex, "list")}
                  />
                </div>

                <div className="mt-5 space-y-4">
                  {section.blocks.map((block, blockIndex) => (
                    <div
                      key={blockIndex}
                      className="rounded-xl border border-[#E6E6E6] bg-[#FAFAFA] p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <strong className="text-sm capitalize text-[#111]">
                          {block.type} Block
                        </strong>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            disabled={blockIndex === 0}
                            onClick={() =>
                              moveBlock(sectionIndex, blockIndex, -1)
                            }
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#D7D9DF] bg-white text-xs disabled:opacity-35"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            disabled={blockIndex === section.blocks.length - 1}
                            onClick={() =>
                              moveBlock(sectionIndex, blockIndex, 1)
                            }
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#D7D9DF] bg-white text-xs disabled:opacity-35"
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              removeBlock(sectionIndex, blockIndex)
                            }
                            className="rounded-full border border-[#F1C5C5] bg-white px-3 text-xs font-semibold text-[#D64545]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {block.type === "content" && (
                        <FormRow>
                          <Textarea
                            label="Content EN"
                            value={block.content_en}
                            onChange={(v) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                content_en: v,
                              })
                            }
                          />

                          <Textarea
                            label="Content AR"
                            dir="rtl"
                            value={block.content_ar}
                            onChange={(v) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                content_ar: v,
                              })
                            }
                          />
                        </FormRow>
                      )}

                      {block.type === "image" && (
                        <ImageUploader
                          value={
                            block.image instanceof File ? block.image : null
                          }
                          initialImage={
                            typeof block.image === "string"
                              ? block.image
                              : undefined
                          }
                          onChange={(file) =>
                            updateBlock(sectionIndex, blockIndex, {
                              ...block,
                              image: file,
                            })
                          }
                        />
                      )}

                      {block.type === "gallery" && (
                        <ImageGalleryUploader
                          values={block.images}
                          onChange={(images) =>
                            updateBlock(sectionIndex, blockIndex, {
                              ...block,
                              images,
                            })
                          }
                        />
                      )}

                      {block.type === "list" && (
                        <div className="space-y-4">
                          <select
                            value={block.list_style}
                            onChange={(e) =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                list_style: e.target.value as
                                  | "bullet"
                                  | "numbered",
                              })
                            }
                            className="w-full rounded-[10px] border border-[#D7D9DF] bg-white px-4 py-2.5 text-sm"
                          >
                            <option value="bullet">Bullet List</option>
                            <option value="numbered">Numbered List</option>
                          </select>

                          {block.items_en.map((_, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3"
                            >
                              <span className="w-8 shrink-0 text-sm font-semibold text-[#555]">
                                {block.list_style === "numbered"
                                  ? `${index + 1}.`
                                  : "•"}
                              </span>

                              <input
                                value={block.items_en[index] || ""}
                                placeholder="English item"
                                onChange={(e) => {
                                  const items_en = [...block.items_en];
                                  items_en[index] = e.target.value;

                                  updateBlock(sectionIndex, blockIndex, {
                                    ...block,
                                    items_en,
                                  });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();

                                    updateBlock(sectionIndex, blockIndex, {
                                      ...block,
                                      items_en: [...block.items_en, ""],
                                      items_ar: [...block.items_ar, ""],
                                    });
                                  }
                                }}
                                className="flex-1 rounded-[10px] border border-[#D7D9DF] bg-white px-4 py-2.5 text-sm"
                              />

                              <input
                                dir="rtl"
                                value={block.items_ar[index] || ""}
                                placeholder="العنصر العربي"
                                onChange={(e) => {
                                  const items_ar = [...block.items_ar];
                                  items_ar[index] = e.target.value;

                                  updateBlock(sectionIndex, blockIndex, {
                                    ...block,
                                    items_ar,
                                  });
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();

                                    updateBlock(sectionIndex, blockIndex, {
                                      ...block,
                                      items_en: [...block.items_en, ""],
                                      items_ar: [...block.items_ar, ""],
                                    });
                                  }
                                }}
                                className="flex-1 rounded-[10px] border border-[#D7D9DF] bg-white px-4 py-2.5 text-sm"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const items_en = block.items_en.filter(
                                    (_, i) => i !== index,
                                  );

                                  const items_ar = block.items_ar.filter(
                                    (_, i) => i !== index,
                                  );

                                  updateBlock(sectionIndex, blockIndex, {
                                    ...block,
                                    items_en: items_en.length ? items_en : [""],
                                    items_ar: items_ar.length ? items_ar : [""],
                                  });
                                }}
                                className="rounded-full border border-[#F1C5C5] px-3 py-2 text-xs font-semibold text-[#D64545]"
                              >
                                Delete
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              updateBlock(sectionIndex, blockIndex, {
                                ...block,
                                items_en: [...block.items_en, ""],
                                items_ar: [...block.items_ar, ""],
                              })
                            }
                            className="rounded-full border border-[#D7D9DF] px-4 py-2 text-sm"
                          >
                            + Add Item
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#E6E6E6] bg-white px-8 py-5">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full border border-[#D7D9DF] px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveNews}
            disabled={saving}
            className="cursor-pointer rounded-full bg-black px-5 py-2 text-white disabled:opacity-50"
          >
            {saving
              ? news
                ? "Saving..."
                : "Creating..."
              : news
                ? "Save Changes"
                : "Create News"}
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
        className="w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#285FE7] focus:bg-white focus:ring-4 focus:ring-[#285FE7]/10"
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
        className="min-h-25 w-full resize-y rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm outline-none transition-all focus:border-[#285FE7] focus:bg-white focus:ring-4 focus:ring-[#285FE7]/10"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 py-2.5 text-sm"
      >
        <option value="true">Published</option>
        <option value="false">Draft</option>
      </select>
    </div>
  );
}

function BlockButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-full border border-[#D7D9DF] bg-white px-4 py-1.5 text-xs font-semibold text-[#111] transition hover:bg-[#F6F6F6]"
    >
      {label}
    </button>
  );
}
