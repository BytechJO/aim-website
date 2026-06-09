"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
export default function ProductsSection() {
  const t = useTranslations("products");
  const locale = useLocale();
  const products = [
    {
      id: 1,
      slug: "hardcover-thread-sewn",
      title_en: "Hardcover",
      title_ar: "غلاف مقوى",
      subtitle_en: "thread sewn",
      subtitle_ar: "خياطة بالخيط",
      image: "/homeImg/product/hardcover-thread-sewn.png",
    },
    {
      id: 2,
      slug: "hardcover-perfect-bound",
      title_en: "Hardcover",
      title_ar: "غلاف مقوى",
      subtitle_en: "perfect bound",
      subtitle_ar: "تجليد لاصق",
      image: "/homeImg/product/hardcover-perfect-bound.webp",
    },
    {
      id: 3,
      slug: "softcover-thread-sewn",
      title_en: "Softcover",
      title_ar: "غلاف ورقي",
      subtitle_en: "thread sewn",
      subtitle_ar: "خياطة بالخيط",
      image: "/homeImg/product/miekka_szyta_gif.gif",
    },
    {
      id: 4,
      slug: "softcover-perfect-bound",
      title_en: "Softcover",
      title_ar: "غلاف ورقي",
      subtitle_en: "perfect bound",
      subtitle_ar: "تجليد لاصق",
      image: "/homeImg/product/softcover-perfect-bound.webp",
    },
    {
      id: 5,
      slug: "softcover-saddle-stitched",
      title_en: "Softcover",
      title_ar: "غلاف ورقي",
      subtitle_en: "saddle stitched",
      subtitle_ar: "تدبيس سرجي",
      image: "/homeImg/product/softcover-saddle-stitched.webp",
    },
    {
      id: 6,
      slug: "half-binding",
      title_en: "Half-binding",
      title_ar: "تجليد نصفي",
      subtitle_en: "",
      subtitle_ar: "",
      image: "/homeImg/product/half-binding.webp",
    },
    {
      id: 7,
      slug: "flexo-binding",
      title_en: "Flexo binding",
      title_ar: "تجليد فليكسو",
      subtitle_en: "",
      subtitle_ar: "",
      image: "/homeImg/product/flexo-binding.gif",
    },
    {
      id: 8,
      slug: "spiral-binding",
      title_en: "Spiral binding",
      title_ar: "تجليد حلزوني",
      subtitle_en: "",
      subtitle_ar: "",
      image: "/homeImg/product/spiral-binding.webp",
    },
    {
      id: 9,
      slug: "open-spine-binding",
      title_en: "Open-spine binding",
      title_ar: "تجليد مفتوح الظهر",
      subtitle_en: "",
      subtitle_ar: "",
      image: "/homeImg/product/open-spine-binding.webp",
    },
    {
      id: 10,
      slug: "swiss-binding",
      title_en: "Swiss binding",
      title_ar: "تجليد سويسري",
      subtitle_en: "",
      subtitle_ar: "",
      image: "/homeImg/product/swiss-binding.webp",
    },
  ];
  return (
    <section className="py-15">
      <div className="max-w-[95%] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-10"
        >
          <h2
            className={`
    ${locale === "en" ? "font-adamina" : "font-cairo"}
    text-3xl lg:text-[55px]
    font-light text-[#202543] max-w-200
  `}
          >
            {t("See what your print could look like")}
          </h2>

          <Link
            href="/services"
            className="group flex items-center gap-2 text-[17px] font-medium mt-4 lg:mt-6 cursor-pointer"
          >
            {t("Explore our products and services")}

            <span className="w-10 h-6 rounded-full bg-[#E8B090] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#359DDA]">
              <Image
                src={
                  locale === "ar"
                    ? "/homeImg/arrowLeft.svg"
                    : "/homeImg/arrowRight.svg"
                }
                alt="Arrow"
                width={20}
                height={10}
              />
            </span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/services/${item.slug}`}
              className="group block"
            >
              <div>
                <div className="relative h-100 md:h-65 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title_en}
                    fill
                    className="object-covertransition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-[20px] font-bold group-hover:text-[#204DBE]">
                    {locale === "ar" ? item.title_ar : item.title_en}
                  </p>

                  {(locale === "ar" ? item.subtitle_ar : item.subtitle_en) && (
                    <p className="text-[18px]">
                      {locale === "ar" ? item.subtitle_ar : item.subtitle_en}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
