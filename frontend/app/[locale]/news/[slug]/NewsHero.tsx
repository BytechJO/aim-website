"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";

interface Props {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  hero_image: string;
  title_color?: string;
}

export default function NewsHero({
  title_en,
  title_ar,
  description_en,
  description_ar,
  hero_image,
  title_color,
}: Props) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <>
      <section>
        <section className="relative">
          <div
          className="absolute inset-0 h-90 lg:h-105 bg-cover"
            style={{
              backgroundImage: `url(${hero_image})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: isArabic ? "scaleX(-1)" : "scaleX(1)",
            }}
          />

          <div className="relative h-90 lg:h-105 flex items-center">
            <div className="max-w-2xl w-full px-8 lg:px-12">
              {" "}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ color: title_color || "#000000" }}
                className={`${
                  isArabic ? "font-noto-arabic" : "font-adamina"
                } text-5xl lg:text-7xl`}
              >
                {isArabic ? title_ar : title_en}
              </motion.h1>
            </div>
          </div>
        </section>
        <div className="py-20">
          <div className="max-w-5xl mx-auto px-8">
            {isArabic ? description_ar : description_en}
          </div>
        </div>
      </section>
    </>
  );
}
