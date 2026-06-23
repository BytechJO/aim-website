"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
interface NewsItem {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  hero_image: string;
  thumbnail_image?: string;
}
export default function NewsSection() {
  const t = useTranslations("NewsSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(ENDPOINTS.NEWS);
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNews();
  }, []);
  const mainNews = news[0];
  const sideNews = news.slice(1, 3);
  return (
    <section className="py-20 ">
      <div className="max-w-362.5 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${locale === "en" ? "font-adamina" : "font-noto-arabic"} text-4xl lg:text-7xl font-light text-[#202543] mb-10`}
        >
          {t("title")}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main News */}
          {mainNews && (
            <Link
              href={`/${locale}/news/${mainNews.slug}`}
              className="group relative min-h-90 lg:min-h-140 overflow-hidden cursor-pointer"
            >
              <Image
                src={mainNews.hero_image}
                alt="News"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div
                className={`absolute bottom-0 ${
                  isArabic ? "left-0" : "right-0"
                } w-full sm:w-90 bg-white group-hover:bg-[#EFEFEF] transition-all duration-300 p-6`}
              >
                {" "}
                <h3 className="text-[18px] font-medium">
                  {isArabic ? mainNews.title_ar : mainNews.title_en}
                </h3>
                <p className="mt-4 text-[14px] leading-6 text-black/70 line-clamp-2">
                  {isArabic ? mainNews.description_ar : mainNews.description_en}
                </p>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <span className="text-[12px] text-black/60">
                    {t("readMore")}
                  </span>

                  <span className="w-8 h-5 rounded-full border border-black/20 flex items-center justify-center bg-white group-hover:bg-[#359DDA] transition-all duration-300">
                    <Image
                      src="/homeImg/arrowRight.svg"
                      alt="Arrow"
                      width={16}
                      height={8}
                      className={`${isArabic ? "rotate-180" : ""}`}
                    />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Side News */}
          <div className="grid grid-cols-1 gap-4">
            {sideNews.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/news/${item.slug}`}
                className="group bg-white hover:bg-[#EFEFEF] transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-40.5 overflow-hidden">
                  <Image
                    src={item.thumbnail_image || item.hero_image}
                    alt={item.title_en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-[14px] leading-5">
                    {" "}
                    {isArabic ? item.title_ar : item.title_en}
                  </h3>
                  {item.description_en && (
                    <p className="mt-2 text-[12px] text-black/70 line-clamp-2">
                      {isArabic ? item.description_ar : item.description_en}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <span className="text-[12px] text-black/60">
                      {t("readMore")}
                    </span>

                    <span className="w-8 h-5 rounded-full border border-black/20 flex items-center justify-center bg-white group-hover:bg-[#359DDA] transition-all duration-300">
                      <Image
                        src="/homeImg/arrowRight.svg"
                        alt="Arrow"
                        width={16}
                        height={8}
                        className={`${isArabic ? "rotate-180" : ""}`}
                      />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
