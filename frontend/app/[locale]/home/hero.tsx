"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  return (
    <section className="relative h-screen overflow-hidden">
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="/homeImg/hero.svg"
          alt="Hero"
          fill
          priority
          className="object-contain md:object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/10" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 h-full mt-3 sm:mt-4 md:mt-5">
        <div className="mx-auto h-full flex items-center px-4 sm:px-2 md:px-4 lg:px-20">
          <div className="w-full lg:w-fit flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[52px] sm:text-[42px] md:text-[56px] lg:text-[70px] leading-none font-light text-white"
            >
              {t("title1")}
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className={`
    ${locale === "en" ? "font-adamina" : "font-cairo"}
    text-[72px] sm:text-[68px] md:text-[88px] lg:text-[110px]
    font-light text-white p-0
  `}
            >
              {t("title2")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white text-sm sm:text-base md:text-lg max-w-md"
            >
              {t("subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col items-center sm:flex-row sm:items-center gap-4 sm:gap-5 mt-6 sm:mt-8 md:mt-10"
            >
              <button className="h-15 sm:h-13.75 w-90 sm:w-auto sm:min-w-50 md:min-w-74.75 rounded-full bg-black text-white cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] text-[18px] md:text-[21px]">
                {t("explore")}
              </button>
              <div
                onClick={() =>
                  document
                    .getElementById("reviews")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="flex flex-col justify-center items-center sm:items-start bg-white rounded-full px-5 h-15 sm:h-13.75 w-90 sm:w-auto sm:min-w-50 md:min-w-74.75 cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] md:pl-7.5"
              >
                <div className="flex items-center justify-center sm:justify-start gap-0.5 text-[22px] sm:text-[18px] text-blue-600 leading-none">
                  ★★★★★
                </div>
                <span className="text-center sm:text-left text-[16px] sm:text-[14px] text-gray-600 leading-none mt-0.5 sm:mt-1">
                  {t("reviews")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
