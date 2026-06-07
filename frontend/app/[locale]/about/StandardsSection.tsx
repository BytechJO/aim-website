"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

export default function StandardsSection() {
  const t = useTranslations("StandardsHero");
  const locale = useLocale();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Desktop Background */}
      <div
        className="hidden md:block absolute inset-0 bg-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: "url('/standards/standards.svg')",
        }}
      />

      <div className="relative z-10">
        {/* Mobile Image */}
        <div className="md:hidden flex justify-center pt-10 px-6">
          <Image
            src="/standards/standards.svg"
            alt="Standards"
            width={500}
            height={500}
            className="w-full max-w-md h-auto"
            priority
          />
        </div>

        {/* Content */}
        <div className="flex items-center justify-center md:min-h-screen px-6 py-12 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-150 text-center"
          >
            <h2
              className={`${locale === "en" ? "font-adamina" : "font-cairo"} text-[40px] md:text-[72px] leading-none text-black`}
            >
              {t("title")}
            </h2>

            <p className="mt-6 md:mt-8 text-[14px] md:text-[16px] leading-7 text-[#333]">
              {t("description")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
