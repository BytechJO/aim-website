"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

type Product = {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  image_url: string;
};

export default function RelatedProductsSection({
  products,
}: {
  products: Product[];
}) {
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
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/${locale}/services/${product.slug}`}
            className="group"
          >
            <div className="relative w-50 h-50 overflow-hidden">
              <Image
                src={product.image_url}
                alt={isArabic ? product.title_ar : product.title_en}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
