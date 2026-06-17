"use client";

import Image from "next/image";
import { useLocale } from "next-intl";

interface Block {
  type: "content" | "image" | "gallery" | "list";

  content_en?: string;
  content_ar?: string;

  image?: string;

  images?: string[];

  items_en?: string[];
  items_ar?: string[];
}

interface Section {
  title_en: string;
  title_ar: string;
  blocks: Block[];
}

interface Props {
  sections: Section[];
}

export default function NewsSections({ sections }: Props) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="max-w-5xl mx-auto px-8">
      {sections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="mb-24">
          <h2
            className={`${
              isArabic ? "font-cairo" : "font-adamina"
            } text-2xl md:text-3xl mb-10`}
          >
            {isArabic ? section.title_ar : section.title_en}
          </h2>

          {section.blocks.map((block, blockIndex) => {
            if (block.type === "content") {
              return (
                <div key={blockIndex} className="mb-10">
                  <p className="text-lg leading-9 text-black/80 whitespace-pre-line">
                    {isArabic ? block.content_ar : block.content_en}
                  </p>
                </div>
              );
            }

            if (block.type === "image" && block.image) {
              return (
                <div key={blockIndex} className="mb-10">
                  <Image
                    src={block.image}
                    alt=""
                    width={1400}
                    height={900}
                    className="w-full rounded-3xl object-cover"
                  />
                </div>
              );
            }

            if (block.type === "list") {
              const items = isArabic ? block.items_ar : block.items_en;

              return (
                <ul
                  key={blockIndex}
                  className="list-disc ps-6 space-y-4 text-lg leading-8 mb-10"
                >
                  {items?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
            }

            if (block.type === "gallery") {
              return (
                <div
                  key={blockIndex}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
                >
                  {block.images?.map((img, i) => (
                    <Image
                      key={i}
                      src={img}
                      alt=""
                      width={700}
                      height={700}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ))}
                </div>
              );
            }

            return null;
          })}
        </section>
      ))}
    </div>
  );
}
