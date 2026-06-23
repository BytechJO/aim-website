"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
type SubEnhancement = {
  title_en: string;
  title_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string[];
  sort_order?: number;
};

type Enhancement = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url: string[];
  sort_order: number;
  sub_enhancements?: SubEnhancement[];
};
type Card = {
  id: string;
  slug: string;
  image?: string;
  title: string;
  subtitle: string;
};
interface Props {
  enhancements: Enhancement[];
}

export default function EnhancementsGrid({ enhancements }: Props) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [showAll, setShowAll] = useState(false);
  const cards: Card[] = enhancements
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((category) => {
      if ((category.sub_enhancements?.length ?? 0) > 0) {
        return (
          category.sub_enhancements
            ?.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((type, index) => ({
              id: `${category.id}-${index}`,
              slug: category.slug,
              image: type.image_url?.[0],
              title: isArabic ? category.title_ar : category.title_en,
              subtitle: isArabic ? type.title_ar : type.title_en,
            })) ?? []
        );
      }

      return [
        {
          id: String(category.id), // ← مهم
          slug: category.slug,
          image: category.image_url?.[0],
          title: isArabic ? category.title_ar : category.title_en,
          subtitle: "",
        },
      ];
    });
  const visibleCards = showAll ? cards : cards.slice(0, 6);

  return (
    <section className="bg-[#F3F3F3] py-15">
      <div className="max-w-362.5 mx-auto px-6 py-15">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center justify-between gap-6">
            <h2
              className={`${
                locale === "en" ? "font-adamina" : "font-noto-arabic"
              } text-5xl md:text-7xl lg:text-[70px] leading-none text-black`}
            >
              {isArabic ? "التحسينات" : "Enhancements"}
            </h2>

            <Link
              href="/enhancement"
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
              ? "نقدم مجموعة واسعة من تحسينات الكتب والطباعة التي تضيف لمسة احترافية وفريدة لمنتجك النهائي."
              : "One should not judge the book by its cover, but everyone knows how important the first impression is. Print enhancements are one of the ways to make the book more beautiful and memorable."}
          </p>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
          {visibleCards.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/enhancement#${item.slug}`}
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
