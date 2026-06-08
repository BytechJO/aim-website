"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

type Product = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  image: string;
};

export default function RelatedProductsSection() {
  const relatedProducts = [
    {
      id: 2,
      slug: "hardcover-perfect-bound",
      title_en: "Hardcover",
      title_ar: "غلاف مقوى",
      subtitle_en: "perfect bound",
      subtitle_ar: "تجليد لاصق",
      image: "/homeImg/book.svg",
    },
    {
      id: 3,
      slug: "softcover-thread-sewn",
      title_en: "Softcover",
      title_ar: "غلاف ورقي",
      subtitle_en: "thread sewn",
      subtitle_ar: "خياطة بالخيط",
      image: "/homeImg/book.svg",
    },
  ];
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="max-w-7xl mx-auto px-6 py-15">
      <h2
        className={`text-6xl mb-12 ${
          locale === "en" ? "font-adamina" : "font-cairo"
        }`}
      >
        {isArabic ? "منتجات ذات صلة" : "Related products"}
      </h2>
      <div className="flex gap-6 flex-wrap">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/services/${product.slug}`}
            className="group"
          >
            <div className="relative w-[200px] h-[200px] overflow-hidden">
              <Image
                src={product.image}
                alt={isArabic ? product.title_ar : product.title_en}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 "
              />
            </div>

            <h3 className="mt-3 text-xl font-bold group-hover:text-[#204DBE]">
              {isArabic ? product.title_ar : product.title_en}
            </h3>

            {(isArabic ? product.subtitle_ar : product.subtitle_en) && (
              <p className="text-gray-600">
                {isArabic ? product.subtitle_ar : product.subtitle_en}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
