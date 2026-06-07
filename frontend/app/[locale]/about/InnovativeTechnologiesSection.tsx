"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

export default function InnovativeTechnologiesSection() {
  const t = useTranslations("InnovativeTechnologies");
  const locale = useLocale();

  const technologies = [
    {
      logo: "/standards/screen.svg",
      title: t("screen.title"),
      description: t("screen.description"),
    },
    {
      logo: "/standards/konica.svg",
      title: t("konica.title"),
      description: t("konica.description"),
    },
    {
      logo: "/standards/canon.svg",
      title: t("canon.title"),
      description: t("canon.description"),
    },
    {
      logo: "/standards/ricoh.svg",
      title: t("ricoh.title"),
      description: t("ricoh.description"),
    },
  ];

  return (
    <section className="w-full  py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-[720px]"
        >
          <h2
            className={`${locale === "en" ? "font-adamina" : "font-cairo"} text-[48px] md:text-[72px] leading-none text-black whitespace-nowrap`}
          >
            {t("title")}
          </h2>

          <p className="mt-8 text-[14px] md:text-[16px] leading-7 text-[#333] max-w-[620px]">
            {t("description")}
          </p>
        </motion.div>

        {/* Category */}
        <div className="mt-20">
          <h3 className="text-[32px] md:text-[40px] text-black">
            {t("printing")}
          </h3>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20 mt-12">
          {technologies.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
            >
              {/* line */}
              <div className="h-px bg-[#D8D8D8] mb-8" />

              {/* logo */}
              <div className="h-[40px] flex items-center">
                <Image
                  src={item.logo}
                  alt={item.title}
                  width={170}
                  height={40}
                  className="object-contain w-auto h-auto"
                />
              </div>

              {/* text */}
              <p className="mt-8 text-[14px] leading-7 text-[#333] max-w-[520px]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
