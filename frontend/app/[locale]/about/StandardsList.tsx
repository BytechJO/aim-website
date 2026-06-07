"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

export default function StandardsList() {
  const t = useTranslations("StandardsSection");
  const locale = useLocale();

  const standards = [
    {
      number: "01",
      title: t("item1.title"),
      description: t("item1.description"),
    },
    {
      number: "02",
      title: t("item2.title"),
      description: t("item2.description"),
    },
    {
      number: "03",
      title: t("item3.title"),
      description: t("item3.description"),
    },
  ];
  return (
    <section className="w-full">
      <div className=" md:max-w-[50%] mx-auto px-6 mb-10">
        {standards.map((item, index) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="mb-24 last:mb-0"
          >
            {/* number + line */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[#3F6EE8] text-[20px] font-medium">
                {item.number}
              </span>

              <div className="flex-1 h-px bg-[#D9D9D9]" />
            </div>

            {/* content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <h2
                className={`${locale === "en" ? "font-adamina" : "font-cairo"} text-[48px] md:text-[55px] leading-[0.95] text-black max-w-105`}
              >
                {item.title}
              </h2>

              <p className="text-[15px] leading-7 text-[#2C2C2C] max-w-107.5">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
