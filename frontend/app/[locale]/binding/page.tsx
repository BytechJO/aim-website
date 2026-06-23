"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import BindingImages from "./BindingImages";
import BindingHero from "./BindingHero";
import Loading from "./loading";
import ContactModal from "../components/ContactModal";
interface Binding {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string | null;
  subtitle_ar: string | null;
  description_en: string;
  description_ar: string;
  example_images: string[];
}
export default function BindingPage() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [Bindings, setBindings] = useState<Binding[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState<
    "message" | "callback"
  >("callback");
  useEffect(() => {
    const fetchBinding = async () => {
      try {
        const res = await fetch(ENDPOINTS.PRODUCTS);
        const data = await res.json();

        setBindings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBinding();
  }, []);
  useEffect(() => {
    if (!search.trim()) return;

    const q = search.toLowerCase().trim();

    const matchedBinding = Bindings.find((item) => {
      const titleEn = item.title_en?.toLowerCase() || "";
      const titleAr = item.title_ar?.toLowerCase() || "";
      const subtitleEn = item.subtitle_en?.toLowerCase() || "";
      const subtitleAr = item.subtitle_ar?.toLowerCase() || "";

      return (
        titleEn.includes(q) ||
        titleAr.includes(q) ||
        subtitleEn.includes(q) ||
        subtitleAr.includes(q)
      );
    });

    if (matchedBinding) {
      const element = document.getElementById(matchedBinding.slug);

      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 120;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }
  }, [search, Bindings]);

  useEffect(() => {
    if (!Bindings.length) return;

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
  }, [Bindings]);

  if (loading) {
    return <Loading />;
  }
  return (
    <section className="overflow-x-clip">
      {" "}
      <div className="max-w-362.5 mx-auto flex items-start">
        {/* Sidebar */}
        <aside
          className={`hidden lg:block w-100 shrink-0 sticky top-18 self-start bg-[#F3F3F3] 
    before:absolute before:top-0 before:bottom-0 before:w-screen before:bg-[#F3F3F3] before:content-['']
    ${isArabic ? "before:left-full" : "before:right-full"}`}
        >
          <div className="relative p-8">
            <h3 className="text-[16px] mb-3">
              {isArabic ? "ابحث عن نوع تجليد" : "Find a binding type"}
            </h3>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isArabic ? "ابحث" : "Search"}
              className="w-full rounded-xl bg-white px-5 py-4 outline-none"
            />

            <h3 className="text-2xl mt-8 mb-4">
              {isArabic ? "أنواع التجليد" : "Binding types"}
            </h3>

            <div className="space-y-4">
              {Bindings.map((item) => (
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
                  <span className="font-medium">
                    {isArabic ? item.title_ar : item.title_en}
                  </span>

                  {(isArabic ? item.subtitle_ar : item.subtitle_en) && (
                    <span className="text-black/60 ml-2">
                      — {isArabic ? item.subtitle_ar : item.subtitle_en}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-[#EBDD7D] mt-8 p-8">
              <h3 className="text-2xl mb-4">
                {isArabic ? "هل تحتاج مساعدة؟" : "Need help choosing?"}
              </h3>

              <p className="leading-6 mb-8">
                {isArabic
                  ? "غير متأكد من نوع التجليد المناسب لكتابك؟ تواصل معنا وسنساعدك في اختيار الخيار الأمثل من حيث المظهر والمتانة والميزانية."
                  : "Not sure which binding type is best for your book? Contact us and we'll help you choose the perfect option based on appearance, durability, and budget."}
              </p>

              <div className="flex gap-4">
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
                  className="px-4 py-4 rounded-full bg-[#F3F3F3] text-[#285FE7] font-semibold hover:bg-white transition"
                >
                  {isArabic ? "تواصل معنا" : "Contact us"}
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <BindingHero />

          <div className="max-w-5xl mx-auto px-8">
            {Bindings.map((category) => (
              <section
                key={category.id}
                id={category.slug}
                className="scroll-mt-32 mb-32"
              >
                <div className="flex flex-wrap items-end gap-4 mb-8">
                  <h2 className="font-adamina text-4xl md:text-6xl">
                    {isArabic ? category.title_ar : category.title_en}
                  </h2>

                  {(isArabic ? category.subtitle_ar : category.subtitle_en) && (
                    <span className="text-2xl md:text-3xl text-black/70">
                      {isArabic ? category.subtitle_ar : category.subtitle_en}
                    </span>
                  )}
                </div>

                <p className="text-[18px] leading-8 max-w-5xl mb-12">
                  {isArabic ? category.description_ar : category.description_en}
                </p>

                {category.example_images?.length > 0 && (
                  <BindingImages images={category.example_images} />
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
