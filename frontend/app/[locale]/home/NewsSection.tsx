"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { motion } from "framer-motion";

export default function NewsSection() {
  const t = useTranslations("NewsSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const sideNews = [
    {
      id: 1,
      title: t("sideNews1Title"),
      image: "/homeImg/news-small-1.svg",
    },
    {
      id: 2,
      title: t("sideNews2Title"),
      description: t("sideNews2Description"),
      image: "/homeImg/news-small-2.svg",
    },
  ];

  return (
    <section className="py-20 ">
      <div className="max-w-[95%] mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl lg:text-7xl font-light text-[#202543] mb-10"
        >
          {t("title")}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main News */}
          <div className="group relative min-h-90 lg:min-h-140 overflow-hidden cursor-pointer">
            <Image
              src="/homeImg/news-main.svg"
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
              <h3 className="text-[18px] font-medium">{t("mainNewsTitle")}</h3>
              <p className="mt-4 text-[14px] leading-6 text-black/70">
                {t("mainNewsDescription")}
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
          </div>

          {/* Side News */}
          <div className="grid grid-cols-1 gap-4">
            {sideNews.map((item) => (
              <div
                key={item.id}
                className="group bg-white hover:bg-[#EFEFEF] transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-47.5 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-[14px] leading-5">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-[12px] text-black/70">
                      {item.description}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
