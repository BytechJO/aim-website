"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";

type EnhancementType = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  images: string[];
  sort_order: number;
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
  types: EnhancementType[];
};
type Card = {
  id: string;
  slug: string;
  image?: string;
  title: string;
  subtitle: string;
};
export default function EnhancementsSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchEnhancements = async () => {
      try {
        const res = await fetch(ENDPOINTS.ENHANCEMENTS);
        const data = await res.json();

        setEnhancements(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEnhancements();
  }, []);

  const cards: Card[] = enhancements
    .sort((a, b) => a.sort_order - b.sort_order)
    .flatMap((category) => {
      if (category.types.length > 0) {
        return [...category.types]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((type) => ({
            id: `${category.id}-${type.id}`,
            slug: category.slug,
            image: type.images?.[0],
            title: isArabic ? category.title_ar : category.title_en,
            subtitle: isArabic ? type.title_ar : type.title_en,
          }));
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
      <div className="max-w-7xl mx-auto px-6 py-15">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 mb-14">
          <div className="max-w-262.5">
            <h2
              className={`${
                locale === "en" ? "font-adamina" : "font-cairo"
              } text-5xl md:text-7xl lg:text-[70px] leading-none text-black`}
            >
              {isArabic ? "التحسينات" : "Enhancements"}
            </h2>

            <p className="mt-8 text-[18px] lg:text-[20px] leading-[1.7] text-black/85 max-w-275">
              {isArabic
                ? "نقدم مجموعة واسعة من تحسينات الكتب والطباعة التي تضيف لمسة احترافية وفريدة لمنتجك النهائي."
                : "One should not judge the book by its cover, but everyone knows how important the first impression is. Print enhancements are one of the ways to make the book more beautiful and memorable."}
            </p>
          </div>

          <Link
            href="/enhancement"
            className="flex items-center gap-3 lg:mt-8 shrink-0 group"
          >
            <span className="text-[20px] border-b border-black pb-1 ">
              {isArabic ? "عرض الكل" : "See all"}
            </span>

            <div className="w-12 h-8 rounded-full bg-[#E8B090] flex items-center justify-center group-hover:bg-[#359DDA]">
              {isArabic ? "⟵" : "⟶"}
            </div>
          </Link>
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
                <h3 className="font-bold text-[20px] text-black">
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
