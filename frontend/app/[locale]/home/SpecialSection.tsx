"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
export default function SpecialSection() {
  const t = useTranslations("SpecialSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  return (
    <section className="">
      <div className="max-w-[95%] mx-auto px-4 lg:px-8">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`
    ${locale === "en" ? "font-adamina" : "font-cairo"}
    text-4xl lg:text-7xl font-light text-[#202543] md:mb-14
  `}
        >
          {t("title")}
        </motion.h2>
        <div className="relative overflow-visible">
          <div className="hidden lg:block">
            {/* Decorations */}

            <div
              className={`absolute top-[-4%] ${
                isArabic ? "right-[2%]" : "left-[2%]"
              } w-4 h-4 rounded-full bg-[#F4A16D] z-30 pointer-events-none`}
            />

            <div
              className={`absolute top-[-5%] ${
                isArabic ? "right-[60%]" : "left-[60%]"
              } w-5 h-5 bg-[#A66BFF] z-30 pointer-events-none`}
            />

            <div
              className={`absolute bottom-[13%] ${
                isArabic ? "right-[12%]" : "left-[18%]"
              } w-10 h-10 rounded-full bg-[#F3A67D] z-30 pointer-events-none`}
            />

            <div
              className={`absolute bottom-[28%] ${
                isArabic ? "right-[45.5%]" : "left-[46.5%]"
              } w-5 h-5 bg-[#A66BFF] z-30 pointer-events-none`}
            />

            <Image
              src="/homeImg/star.svg"
              alt="Star"
              width={24}
              height={24}
              className={`absolute bottom-[18%] ${
                isArabic ? "left-[28%]" : "right-[25%]"
              } z-30 pointer-events-none`}
            />

            <div
              className={`absolute top-1/2 ${
                isArabic ? "left-0" : "right-0"
              } w-4 h-4 rounded-full bg-[#F4A16D] z-30 pointer-events-none`}
            />
          </div>

          <div className="flex flex-col gap-0">
            {/* Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[45%_55%]">
              {" "}
              {/* Image Card */}
              <div>
                <div className="relative h-105 overflow-hidden">
                  <Image
                    src="/homeImg/special1.svg"
                    alt="Printing"
                    fill
                    className="object-cover"
                  />

                  <span
                    className={`absolute top-6 ${
                      isArabic ? "right-6" : "left-6"
                    } text-sm font-light text-white z-20`}
                  >
                    01
                  </span>
                </div>
              </div>
              {/* Main Text */}
              <div className="flex flex-col px-1 gap-4 md:px-10 justify-center">
                <span className="text-sm mb-3 mt-3 md:mt-0">02</span>

                <h3 className="text-[20px] lg:text-[45px] font-light leading-tight">
                  {t("card1Title")}
                </h3>

                <p className="mt-6 text-lg text-black/70 max-w-xl">
                  {t("card1Description")}
                </p>

                <Link
                  href="/self-publishing"
                  className="mt-2 w-fit px-12 py-4 rounded-full bg-black text-white hover:bg-[#514D4D] cursor-pointer inline-block"
                >
                  {t("exploreButton")}
                </Link>
              </div>
            </div>

            {/* Bottom Row */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 ${
                isArabic ? "lg:ml-25" : "lg:mr-20"
              }`}
            >
              {" "}
              {/* Card 03 */}
              <div className="md:-mt-15 md:ml-10">
                <div className="bg-amber-50 md:bg-white shadow-none md:[box-shadow:-15px_0_30px_rgba(0,0,0,0.08)] p-1 md:p-6 md:rotate-[-10deg] mt-15 w-full md:w-75 relative z-10 h-87.5 flex flex-col gap-8">
                  <span className="text-[#F3A67D] text-sm p-1">03</span>
                  <h4 className="mt-3 text-2xl font-semibold flex justify-center ">
                    {t("card3Title")}
                  </h4>
                  <div className="flex justify-center ">
                    <p className="text-xl"> {t("card3Description")}</p>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Link
                      href="/about"
                      className="px-8 py-3 rounded-full bg-black text-white w-45 hover:bg-[#514D4D] cursor-pointer inline-flex items-center justify-center"
                    >
                      {t("exploreButton")}
                    </Link>
                  </div>
                </div>
              </div>
              {/* White Info Card */}
              <div className="bg-[#F6F6F6] p-2 md:p-8 shadow-sm relative z-20 w-full">
                {" "}
                <div className=" ml-1 md:ml-6">
                  <span className="text-[#224EFF] text-sm">04</span>

                  <h4 className="mt-3 text-[18px] font-semibold">
                    {t("card4Title")}
                  </h4>

                  <p className="mt-6 leading-6 text-black/70 text-[14px]">
                    {t("card4Description")}
                  </p>

                  <button className="mt-10 px-10 py-4 rounded-full bg-black text-white w-65 hover:bg-[#514D4D] cursor-pointer">
                    {t("learnMoreButton")}
                  </button>
                </div>
              </div>
              {/* Bottom Image */}
              <div>
                <div className="relative h-120 w-full overflow-hidden">
                  <Image
                    src="/homeImg/special2.png"
                    alt="Tree"
                    fill
                    className="object-cover md:object-contain"
                  />

                  <span
                    className={`absolute top-6 ${
                      isArabic ? "right-6" : "left-6"
                    } text-sm font-light text-white z-20`}
                  >
                    05
                  </span>
                </div>
              </div>
              {/* Right Card */}
              <div className="bg-[#F6F6F6] p-8 flex flex-col justify-center w-full h-100">
                {" "}
                <div className="ml-6">
                  <h4 className="mt-3  font-semibold text-[24px]">
                    {t("card5Title")}
                  </h4>

                  <p className="mt-6 text-[16px] leading-8 text-black/70">
                    {t("card5Description")}
                  </p>

                  <Link
                    href="/about"
                    className="mt-10 w-fit px-10 py-4 rounded-full bg-black text-white hover:bg-[#514D4D] cursor-pointer inline-flex items-center justify-center"
                  >
                    {t("readMoreButton")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
