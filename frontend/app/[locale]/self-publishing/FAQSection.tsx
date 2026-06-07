"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function FAQSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const faqs = [
    {
      question: {
        en: "What is the price difference between a softcover and a hardcover?",
        ar: "ما الفرق في السعر بين الغلاف الورقي والغلاف المقوى؟",
      },
      answer: {
        en: "The final price depends on the format, print run, paper type and finishing options selected.",
        ar: "يعتمد السعر النهائي على المقاس وعدد النسخ ونوع الورق وخيارات التشطيب المختارة.",
      },
    },
    {
      question: {
        en: "I am hesitating between a thread-sewn and a perfect-bound hard cover. Which one should I choose?",
        ar: "أنا متردد بين الغلاف المقوى المخيط بالخيط والغلاف المقوى الملصق. أيهما أختار؟",
      },
      answer: {
        en: "Thread-sewn binding is more durable, while perfect binding is often more economical.",
        ar: "التجليد المخيط بالخيط أكثر متانة، بينما يكون التجليد اللاصق أكثر اقتصادية في كثير من الأحيان.",
      },
    },
    {
      question: {
        en: "How many enhancements can be used in a cover design?",
        ar: "كم عدد التأثيرات أو التحسينات التي يمكن استخدامها في تصميم الغلاف؟",
      },
      answer: {
        en: "You can combine several enhancements such as foil stamping, embossing and spot UV.",
        ar: "يمكنك الجمع بين عدة تأثيرات مثل الطباعة بالرقائق المعدنية والنقش البارز وطلاء UV الموضعي.",
      },
    },
    {
      question: {
        en: "Can I order a thread for my book in a colour other than white?",
        ar: "هل يمكنني اختيار لون خيط غير الأبيض لكتابي؟",
      },
      answer: {
        en: "Yes, depending on the project specifications and availability.",
        ar: "نعم، وذلك حسب مواصفات المشروع وتوفر الألوان المطلوبة.",
      },
    },
    {
      question: {
        en: "What is the best paper for my publication?",
        ar: "ما أفضل نوع ورق لمنشوري؟",
      },
      answer: {
        en: "The best paper depends on your publication type, budget and desired finish.",
        ar: "يعتمد أفضل نوع ورق على نوع المنشور والميزانية والنتيجة النهائية التي ترغب بها.",
      },
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-[#F6F6F6]">
      <div className="max-w-[95%] mx-auto px-4 lg:px-8 ">
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-24">
          {/* Title */}
          <div>
            <motion.h2
              className={`
  ${locale === "en" ? "font-adamina" : "font-cairo"}
  text-3xl lg:text-6xl font-light leading-[1.1] text-[#202543]
`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              {(isArabic
                ? ["الأسئلة", "الشائعة", "والمتكررة"]
                : ["Frequently", "asked", "questions"]
              ).map((word) => (
                <motion.span
                  key={word}
                  className="block"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
          </div>

          {/* FAQ */}
          <div>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="group border-b border-[#D9D9D9]">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className=" w-full flex items-center justify-between py-6 text-left cursor-pointer"
                  >
                    <span
                      className={`text-xl lg:text-xl font-medium group-hover:text-[#285FE7] `}
                    >
                      {isArabic ? faq.question.ar : faq.question.en}
                    </span>
                    <span
                      className={`w-10 h-8 rounded-full border flex items-center justify-center shrink-0 ml-6 transition-all duration-300 ${
                        isOpen
                          ? "bg-[#359DDA] border-[#359DDA]"
                          : "border-[#D9D9D9] group-hover:bg-[#359DDA]"
                      }`}
                    >
                      {isOpen ? (
                        <Image
                          src="/homeImg/arrowRight.svg"
                          alt="Arrow"
                          width={20}
                          height={14}
                          className="-rotate-90 transition-transform duration-700"
                        />
                      ) : (
                        <Image
                          src="/homeImg/arrowRight.svg"
                          alt="Arrow"
                          width={20}
                          height={14}
                          className="rotate-90 transition-transform duration-700 group-hover:translate-y-1"
                        />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-8 max-w-4xl">
                      <p className="text-lg leading-9 text-black/80">
                        {isArabic ? faq.answer.ar : faq.answer.en}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
