"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
interface Product {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  image_url: string;
}
export default function BindingTypesSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [products, setProducts] = useState<Product[]>([]);

  const [activeTitle, setActiveTitle] = useState("all");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(ENDPOINTS.PRODUCTS);
        const data = await res.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);
  const titles = [
    "all",
    ...Array.from(new Set(products.map((product) => product.title_en))),
  ];

  const filteredProducts =
    activeTitle === "all"
      ? products
      : products.filter((product) => product.title_en === activeTitle);

  return (
    <section className="max-w-7xl mx-auto px-6 py-15">
      <h2
        className={`text-[72px] leading-none mb-8 ${
          isArabic ? "font-cairo" : "font-adamina"
        }`}
      >
        {isArabic ? "أنواع التجليد" : "Binding types"}
      </h2>

      <p className="max-w-5xl text-[18px] text-[#444] mb-8">
        {isArabic
          ? "نطبع الكتب رقمياً بكميات صغيرة ومتوسطة. نوفر جميع أنواع التجليد مع أي تحسينات ترغب بها. إذا كنت تريد رؤية الشكل النهائي للكتاب قبل الطباعة، يمكنك طلب نسخة تجريبية. كما نطبع الكتالوجات والكتيبات والمجلات والتقارير السنوية والتقويمات وغيرها."
          : "We print books digitally in short and medium runs. We offer every kind of binding with any enhancement you like. If you want to see what the book will look like in its final shape, order a sample copy. We print conventional books, but also catalogues, brochures, folders, annual reports, instruction manuals, magazines and planners."}
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        {titles.map((title) => {
          const label =
            title === "all"
              ? isArabic
                ? "الكل"
                : "All"
              : isArabic
                ? products.find((product) => product.title_en === title)
                    ?.title_ar
                : title;

          const isActive = activeTitle === title;

          return (
            <button
              key={title}
              type="button"
              onClick={() => setActiveTitle(title)}
              className={`px-5 py-2 rounded-full border transition ${
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredProducts.map((item) => (
          <Link
            key={item.id}
            href={`/services/${item.slug}`}
            className="group block"
          >
            <div className="relative h-65 overflow-hidden">
              <Image
                src={item.image_url}
                alt={locale === "ar" ? item.title_ar : item.title_en}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="mt-4">
              <p className="text-[20px] font-semibold group-hover:text-[#204DBE]">
                {locale === "ar" ? item.title_ar : item.title_en}
              </p>

              {(locale === "ar" ? item.subtitle_ar : item.subtitle_en) && (
                <p className="text-[18px] text-[#444]">
                  {locale === "ar" ? item.subtitle_ar : item.subtitle_en}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
