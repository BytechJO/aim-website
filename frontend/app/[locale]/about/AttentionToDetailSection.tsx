"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

export default function AttentionToDetailSection() {
  const t = useTranslations("AttentionToDetail");
  const locale = useLocale();

  const cards = [
    {
      title: t("card1.title"),
      description: t("card1.description"),
    },
    {
      title: t("card2.title"),
      description: t("card2.description"),
    },
    {
      title: t("card3.title"),
      description: t("card3.description"),
    },
    {
      title: t("card4.title"),
      description: t("card4.description"),
    },
  ];
  return (
    <section className="w-full bg-[#F6F6F6] py-20 md:py-5 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2
            className={`${locale === "en" ? "font-adamina" : "font-cairo"} text-[40px] md:text-[56px] text-black`}
          >
            {t("title")}
          </h2>

          <p className="mt-6 text-[12px] md:text-[14px] text-black">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto mt-14 max-w-[960px]"
        >
          <Image
            src="/standards/attention-collage.png"
            alt="Printing process collage"
            width={960}
            height={380}
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-18">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="bg-white px-8 py-9 min-h-[300px]"
            >
              <h3 className="text-[22px] leading-7 font-normal text-black">
                {card.title}
              </h3>

              <p className="mt-6 text-[13px] leading-5 text-black">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
