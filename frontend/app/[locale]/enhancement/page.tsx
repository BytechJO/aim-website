"use client";

import { useLocale } from "next-intl";
import EnhancementHero from "./EnhancementHero";
import EnhancementImages from "./EnhancementImages";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
interface Enhancement {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  sort_order: number;
  image_url: string[];
  images?: string[];
  types?: {
    id: number;
    title_en: string;
    title_ar: string;
    description_en?: string;
    description_ar?: string;
    images?: string[];
  }[];
}
export default function EnhancementPage() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchEnhancements = async () => {
      try {
        const res = await fetch(ENDPOINTS.ENHANCEMENTS);
        const data = await res.json();

        setEnhancements(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEnhancements();
  }, []);
  useEffect(() => {
    if (!search.trim()) return;

    const q = search.toLowerCase().trim();

    for (const category of enhancements) {
      const matchedType = category.types?.find(
        (type) =>
          type.title_en.toLowerCase().includes(q) ||
          type.title_ar.toLowerCase().includes(q),
      );

      if (matchedType) {
        const element = document.getElementById(`type-${matchedType.id}`);

        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 120;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
        return;
      }
    }

    const matchedCategory = enhancements.find(
      (category) =>
        category.title_en.toLowerCase().includes(q) ||
        category.title_ar.toLowerCase().includes(q),
    );

    if (matchedCategory) {
      document.getElementById(matchedCategory.slug)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [search, enhancements]);

  useEffect(() => {
    if (!enhancements.length) return;

    const hash = window.location.hash.replace("#", "");

    if (!hash) return;

    let tries = 0;

    const interval = setInterval(() => {
      const element = document.getElementById(hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        clearInterval(interval);
      }

      tries++;

      if (tries > 20) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [enhancements]);
  return (
    <section>
      <div className="max-w-full mx-auto flex items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block w-100 shrink-0 sticky top-18 self-start bg-[#F3F3F3]">
          <div className="p-8">
            <h3 className="text-[16px] mb-3">
              {isArabic ? "ابحث عن تحسين" : "Find an enhancement"}
            </h3>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? "ابحث" : "Search"}
              className="w-full rounded-xl bg-white px-5 py-4 outline-none"
            />

            <h3 className="text-2xl mt-8 mb-4">
              {" "}
              {isArabic ? "أنواع التحسينات" : "Enhancement type"}
            </h3>

            <div className="space-y-4">
              {enhancements.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.slug)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="block text-left hover:text-[#204DBE] cursor-pointer"
                >
                  {isArabic ? item.title_ar : item.title_en}
                </button>
              ))}
            </div>

            <div className="bg-[#EBDD7D] mt-8 p-8">
              <h3 className="text-2xl mb-4">
                {isArabic ? "هل لديك سؤال؟" : "Do you have a question?"}
              </h3>

              <p className="leading-6 mb-8">
                {isArabic
                  ? "لست متأكدًا من التحسين المناسب لمشروعك؟ تواصل معنا وسنكون سعداء بمساعدتك."
                  : "Not sure which enhancement will work best for your project? Contact us and we'll be happy to advise!"}
              </p>

              <div className="flex gap-4">
                <a
                  href="tel:+962XXXXXXXXX"
                  className="px-8 py-4 rounded-full bg-[#F3F3F3] text-[#285FE7] font-semibold hover:bg-white transition"
                >
                  {isArabic ? "اتصل بنا" : "Call us"}
                </a>

                <a
                  href={`/${locale}/contact`}
                  className="px-8 py-4 rounded-full bg-[#F3F3F3] text-[#285FE7] font-semibold hover:bg-white transition"
                >
                  {isArabic ? "تواصل معنا" : "Contact"}
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <EnhancementHero />

          <div className="max-w-5xl mx-auto px-8">
            {enhancements.map((category) => (
              <section
                key={category.id}
                id={category.slug}
                className="scroll-mt-32 mb-32"
              >
                {(isArabic ? category.title_ar : category.title_en) && (
                  <h2 className="font-adamina text-6xl mb-8">
                    {isArabic ? category.title_ar : category.title_en}
                  </h2>
                )}
                {(isArabic
                  ? category.description_ar
                  : category.description_en) && (
                  <p className="text-xl leading-10 max-w-5xl mb-16">
                    {isArabic
                      ? category.description_ar
                      : category.description_en}
                  </p>
                )}
                {/* صور الكاتيجوري */}
                {category.image_url?.length > 0 && (
                  <div className="mb-20">
                    <EnhancementImages images={category.image_url} />
                  </div>
                )}

                {/* التايبات */}
                {category.types?.map((type) => (
                  <div key={type.id} id={`type-${type.id}`} className="mb-20">
                    <h3 className="text-4xl mb-5">
                      {isArabic ? type.title_ar : type.title_en}
                    </h3>

                    {(isArabic ? type.description_ar : type.description_en) && (
                      <p className="text-xl mb-8">
                        {isArabic ? type.description_ar : type.description_en}
                      </p>
                    )}

                    {type.images && type.images.length > 0 && (
                      <EnhancementImages images={type.images} />
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
