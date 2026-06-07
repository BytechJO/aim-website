"use client";
import { useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";

export default function StepsSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const steps = [
    {
      id: "01",
      title: {
        en: "Define the parameters of the book you want to print",
        ar: "حدد مواصفات الكتاب الذي ترغب في طباعته",
      },
      description: {
        en: "See the list of parameters and our guidelines",
        ar: "اطلع على قائمة المواصفات وإرشاداتنا",
      },
      image: "/self-publishing/step1.svg",
      button: false,
    },
    {
      id: "02",
      title: {
        en: "Contact us and set the details",
        ar: "تواصل معنا وحدد التفاصيل",
      },
      image: "/self-publishing/step2.svg",
      button: true,
    },
    {
      id: "03",
      title: {
        en: "The printed edition is delivered to a designated address",
        ar: "يتم تسليم النسخ المطبوعة إلى العنوان المحدد",
      },
      image: "/self-publishing/step3.svg",
      button: false,
    },
  ];
  return (
    <section className="py-24">
      <div className="max-w-[90%] mx-auto px-4 lg:px-8">
        <motion.h2
          className={`
    ${locale === "en" ? "font-adamina" : "font-cairo"}
    text-4xl lg:text-6xl font-light text-[#202543] mb-14
  `}
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {isArabic
            ? "ثلاث خطوات لعملية الطلب"
            : "Three steps of the order process"}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div
              key={step.id}
              className="border border-[#BDBDBD] rounded-3xl p-6 min-h-77.5 flex flex-col"
            >
              <span className="text-sm text-black/70">{step.id}</span>

              <div className="relative w-21 h-21 mt-5">
                <Image
                  src={step.image}
                  alt={step.title.en}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="mt-5 text-[27px] leading-tight font-normal">
                {isArabic ? step.title.ar : step.title?.en}
              </h3>

              <div className="mt-auto">
                {step.button ? (
                  <button className="mt-8 bg-[#285FE7] text-white rounded-full px-10 py-3 hover:bg-[#517DE9] cursor-pointer">
                    {isArabic ? "هيا نتحدث" : "Let&apos;s talk"}
                  </button>
                ) : (
                  step.description && (
                    <div className="flex items-center justify-between mt-8">
                      <p className="text-sm text-black/70">
                        {isArabic ? step.description.ar : step.description.en}
                      </p>
                      <span className="arrow-btn w-10 h-8 rounded-full border border-black/40 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-black/5">
                        <Image
                          src="/homeImg/arrowRight.svg"
                          alt="Arrow"
                          width={26}
                          height={14}
                          className={isArabic ? "rotate-180" : ""}
                        />
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
