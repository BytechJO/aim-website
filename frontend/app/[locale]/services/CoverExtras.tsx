"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";

type CoverExtra = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string[];
  sort_order: number;
};

type Card = {
  id: string;
  slug: string;
  image?: string;
  title: string;
  subtitle: string;
};
interface Props {
  coverExtras: CoverExtra[];
}

export default function CoverExtras({ coverExtras }: Props) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [showAll, setShowAll] = useState(false);
  const cards: Card[] = [...coverExtras]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      id: String(item.id),
      slug: item.slug,
      image: item.image_url?.[0],
      title: isArabic ? item.title_ar : item.title_en,
      subtitle: "",
    }));
  const visibleCards = showAll ? cards : cards.slice(0, 6);

  return (
    <section className="py-15">
      <div className="max-w-362.5 mx-auto px-6 py-15">
        {/* Header */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2
              className={`${
                locale === "en" ? "font-adamina" : "font-noto-arabic"
              } text-5xl md:text-7xl lg:text-[70px] leading-none text-black`}
            >
              {isArabic ? "إضافات الغلاف" : "Cover Extras"}
            </h2>

            <Link
              href={`/${locale}/cover-extras`}
              className="hidden lg:flex items-center gap-3 shrink-0 group"
            >
              <span className="text-[20px] border-b border-black pb-1">
                {isArabic ? "عرض الكل" : "See all"}
              </span>

              <div className="w-12 h-8 rounded-full bg-[#E8B090] flex items-center justify-center group-hover:bg-[#359DDA]">
                {isArabic ? "⟵" : "⟶"}
              </div>
            </Link>
          </div>

          <p className="mt-8 text-[18px] lg:text-[20px] leading-[1.7] text-black/85 max-w-275">
            {isArabic
              ? "ستجد العديد من الخيارات الإضافية التي تُحسّن مظهر كتابك وخصائصه، مما يُثري تجربة القارئ وفهمه. تشمل هذه الخيارات حلول تجليد الكتب التي يُمكن إضافتها أو تعديلها في كتابك، وذلك بحسب نوع التجليد المُستخدم، وبما يتناسب مع نوع الكتاب وغرضه وتصميمه الجرافيكي."
              : "You will find a great deal of additional options which can improve the appearance of your book and its features, thus enhancing the reader’s experience and perception. These options include bookbinding solutions which can be added or modified in your publication, depending on the type of binding used, and adapted to the kind and purpose of the book and its graphic design."}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
          {visibleCards.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/cover-extras#${item.slug}`}
              className="group"
            >
              <div className="relative h-57.5 overflow-hidden bg-white">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[#EAEAEA]" />
                )}
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-[20px] text-black">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="mt-1 text-[18px] text-black">{item.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Show More */}
        {cards.length > 6 && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-4 text-[20px] cursor-pointer group"
            >
              {showAll
                ? isArabic
                  ? "عرض أقل"
                  : "Show less"
                : isArabic
                  ? "عرض المزيد"
                  : "Show more"}

              <div className="w-15 h-7 rounded-full border border-gray-300 flex items-center justify-center group-hover:bg-[#359DDA]">
                {showAll ? "↑" : "↓"}
              </div>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
