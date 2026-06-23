"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { motion } from "framer-motion";
import { useState } from "react";
import ContactModal from "../components/ContactModal";

export default function ContactSection() {
  const t = useTranslations("ContactSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState<"message" | "callback">("message");
  const floatingStyles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-60px);
    }
  }

  .float {
    animation: float 15s ease-in-out infinite;
  }
`;
  return (
    <section>
      <div className="max-w-300.5 mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div
          dir="ltr"
          className="grid lg:grid-cols-2 gap-1 md:gap-12 items-center"
        >
          {/* الصورة */}
          <div className="relative h-75 md:h-150">
            <Image
              src="/homeImg/contact1.png"
              alt="Contact card"
              fill
              className="object-contain"
            />
            <div className="absolute top-[25%] left-[18%] w-4 h-4 rounded-full bg-[#F4A16D] float" />
            <Image
              src="/homeImg/star.svg"
              alt="decorative shape"
              width={20}
              height={20}
              className="absolute top-[25%] right-[12%] w-5 h-5 object-contain float"
            />
            <div className="absolute bottom-[12%] left-[-1%] w-6 h-6 rounded-full bg-[#A66BFF] float" />
            <div className="absolute bottom-[18%] right-[6%] w-6 h-6 rounded-full bg-[#7AB3FF] float" />
          </div>

          {/* النص */}
          <div
            dir={isArabic ? "rtl" : "ltr"}
            className={
              isArabic
                ? "text-center lg:text-right"
                : "text-center lg:text-left"
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-lg text-[#202543] mb-4">{t("p1")}</p>

              <h2
                className={`${locale === "en" ? "font-adamina" : "font-noto-arabic"} text-5xl lg:text-7xl font-light text-[#202543] mb-8`}
              >
                {t("p2")}
              </h2>

              <p className="text-black/70 max-w-lg leading-7">{t("p3")}</p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
                <button
                  onClick={() => {
                    setModalType("message");
                    setOpenModal(true);
                  }}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-black text-white hover:bg-[#514D4D] cursor-pointer"
                >
                  {t("leaveButton")}
                </button>

                <button
                  onClick={() => {
                    setModalType("callback");
                    setOpenModal(true);
                  }}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-black text-white hover:bg-[#514D4D] cursor-pointer"
                >
                  {t("callButton")}
                </button>
              </div>
              <p className="mt-12 text-sm text-black/70 mb-4 md:mb-0 ">
                {t("p4")}
                <a href="mailto:info@example.com" className="ml-2 underline">
                  contact@aim.com.pl
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      <ContactModal
        open={openModal}
        type={modalType}
        onClose={() => setOpenModal(false)}
      />
      <style jsx>{floatingStyles}</style>
    </section>
  );
}
