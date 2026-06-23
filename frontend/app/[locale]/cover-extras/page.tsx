"use client";

import { useLocale } from "next-intl";
import CoverExtraImages from "./CoverExtraImages";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import CoverExtrasHero from "./CoverExtrasHero";
import Loading from "./loading";
import ContactModal from "../components/ContactModal";

interface CoverExtra {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  sort_order: number;
  image_url: string[];
}
export default function CoverExtraPage() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [CoverExtras, setCoverExtras] = useState<CoverExtra[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState<
    "message" | "callback"
  >("callback");
  useEffect(() => {
    const fetchCoverExtra = async () => {
      try {
        const res = await fetch(ENDPOINTS.COVER_EXTRAS);
        const data = await res.json();

        setCoverExtras(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverExtra();
  }, []);
  useEffect(() => {
    if (!search.trim()) return;

    const q = search.toLowerCase().trim();
    const matchedCategory = CoverExtras.find(
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
  }, [search, CoverExtras]);

  useEffect(() => {
    if (!CoverExtras.length) return;

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
  }, [CoverExtras]);

  if (loading) {
    return <Loading />;
  }
  return (
    <section className="overflow-x-clip">
      {" "}
      {/* Sidebar */}
      <div className="max-w-362.5 mx-auto flex items-start">
        {/* Sidebar */}
        <aside
          className={`hidden lg:block w-100 shrink-0 sticky top-18 self-start bg-[#F3F3F3] 
    before:absolute before:top-0 before:bottom-0 before:w-screen before:bg-[#F3F3F3] before:content-['']
    ${isArabic ? "before:left-full" : "before:right-full"}`}
        >
          <div className="relative p-8">
            <h3 className="text-[16px] mb-3">
              {isArabic ? "ابحث عن إضافة غلاف" : "Search a cover extra"}
            </h3>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? "ابحث" : "Search"}
              className="w-full rounded-xl bg-white px-5 py-4 outline-none"
            />

            <h3 className="text-2xl mt-8 mb-4">
              {isArabic ? "أنواع الإضافات" : "Cover extra type"}
            </h3>

            <div className="space-y-4">
              {CoverExtras.map((item) => (
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

            <div className="bg-[#EBDD7D] mt-8 p-8 ">
              <h3 className="text-2xl mb-4">
                {isArabic ? "هل لديك سؤال؟" : "Do you have a question?"}
              </h3>

              <p className="leading-6 mb-8">
                {isArabic
                  ? "هل تحتاج إلى حل غير تقليدي غير مدرج هنا؟ تواصل معنا وسنرى ما يمكننا فعله من أجلك."
                  : "Need an unusual solution that is not listed here? Contact us and we’ll see what we can do for you."}
              </p>

              <div className="flex gap-4 whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setContactModalType("callback");
                    setContactModalOpen(true);
                  }}
                  className="px-8 py-4 rounded-full bg-[#F3F3F3] text-[#285FE7] font-semibold hover:bg-white transition cursor-pointer"
                >
                  {isArabic ? "اتصل بنا" : "Call us"}
                </button>
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
          <CoverExtrasHero />

          <div className="max-w-5xl mx-auto px-8">
            {CoverExtras.map((category) => (
              <section
                key={category.id}
                id={category.slug}
                className="scroll-mt-32 mb-32"
              >
                <h2 className="font-adamina text-4xl md:text-6xl mb-8">
                  {isArabic ? category.title_ar : category.title_en}
                </h2>

                <p className="text-[18px] leading-8 max-w-5xl mb-16">
                  {isArabic ? category.description_ar : category.description_en}
                </p>

                {category.image_url?.length > 0 && (
                  <CoverExtraImages images={category.image_url} />
                )}
              </section>
            ))}
          </div>
        </main>
      </div>
      <ContactModal
        open={contactModalOpen}
        type={contactModalType}
        onClose={() => setContactModalOpen(false)}
      />
    </section>
  );
}
