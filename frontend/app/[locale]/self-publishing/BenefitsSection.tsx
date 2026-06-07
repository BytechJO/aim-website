"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";


export default function BenefitsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();
  const isArabic = locale === "ar";
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      id: 1,
      title: {
        en: "For everyone",
        ar: "للجميع",
      },
      text: {
        en: "Self-publishing is for anyone creating their own publications.",
        ar: "النشر الذاتي مناسب لكل من يرغب في إنشاء منشوراته الخاصة.",
      },
      moreText: {
        en: "Whether you're an author, photographer, artist, teacher, or entrepreneur, self-publishing gives you complete freedom to bring your ideas to life.",
        ar: "سواء كنت كاتبًا أو مصورًا أو فنانًا أو معلمًا أو رائد أعمال، فإن النشر الذاتي يمنحك الحرية الكاملة لتحويل أفكارك إلى واقع.",
      },
      color: "bg-[#EFC0E6]",
    },
    {
      id: 2,
      title: {
        en: "Completely in control",
        ar: "تحكم كامل",
      },
      text: {
        en: "You're in the driver's seat.",
        ar: "أنت من يقود العملية بالكامل.",
      },
      moreText: {
        en: "You manage every stage of the publishing process and make all key decisions regarding your book.",
        ar: "أنت تدير جميع مراحل عملية النشر وتتخذ كل القرارات المهمة المتعلقة بكتابك.",
      },
      color: "bg-[#9EDAF1]",
    },
    {
      id: 3,
      title: {
        en: "Risk reduced",
        ar: "تقليل المخاطر",
      },
      text: {
        en: "Get a proof.",
        ar: "احصل على نسخة تجريبية.",
      },
      moreText: {
        en: "Order a sample copy before printing the full run to ensure everything meets your expectations.",
        ar: "اطلب نسخة تجريبية قبل الطباعة الكاملة للتأكد من أن كل شيء يطابق توقعاتك.",
      },
      color: "bg-[#F7E487]",
    },
    {
      id: 4,
      title: {
        en: "Your vision. Your decisions",
        ar: "رؤيتك، قراراتك",
      },
      text: {
        en: "Self-publishing is for anyone creating their own publications.",
        ar: "النشر الذاتي مناسب لكل من يرغب في إنشاء منشوراته الخاصة.",
      },
      moreText: {
        en: "You decide on the format, paper, design, price, and distribution of your publication.",
        ar: "أنت من يحدد المقاس ونوع الورق والتصميم والسعر وطريقة توزيع منشورك.",
      },
      color: "bg-[#F7E487]",
    },
    {
      id: 5,
      title: {
        en: "100% profits",
        ar: "100٪ من الأرباح لك",
      },
      text: {
        en: "No middlemen in self-publishing.",
        ar: "لا يوجد وسطاء في النشر الذاتي.",
      },
      moreText: {
        en: "All profits from book sales go directly to you, without sharing revenue with publishers or distributors.",
        ar: "تذهب جميع أرباح مبيعات الكتب إليك مباشرة دون مشاركة الإيرادات مع الناشرين أو الموزعين.",
      },
      color: "bg-[#CBB0E8]",
    },
    {
      id: 6,
      title: {
        en: "Sell directly",
        ar: "بع مباشرة",
      },
      text: {
        en: "Don't pay agents.",
        ar: "لا تدفع عمولات للوكلاء.",
      },
      moreText: {
        en: "Reach your readers through your own website, social media channels, events, and marketplaces.",
        ar: "يمكنك الوصول إلى قرائك من خلال موقعك الإلكتروني ومنصات التواصل الاجتماعي والفعاليات والمتاجر الإلكترونية.",
      },
      color: "bg-[#F8B29F]",
    },
  ];

  const leftCards = cards.slice(0, 3);
  const rightCards = cards.slice(3, 6);

  const getDelay = (index: number, side: "left" | "right") => {
    const base = side === "left" ? 0 : 150;
    return base + index * 120;
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatBook {
          0%,
          100% {
            transform: translateX(-50%) translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateX(-50%) translateY(-14px) rotate(2deg);
          }
        }
        @keyframes floatHand {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          60% {
            transform: scale(1.3);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        @keyframes pulseRing {
          0% {
            box-shadow: 0 0 0 0 rgba(47, 104, 255, 0.3);
          }
          70% {
            box-shadow: 0 0 0 12px rgba(47, 104, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(47, 104, 255, 0);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(3deg);
          }
          75% {
            transform: rotate(-3deg);
          }
        }

        .card-enter {
          opacity: 0;
          transform: translateY(60px) scale(0.96);
        }
        .card-visible {
          animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .heading-enter {
          opacity: 0;
          transform: translateY(-30px);
        }
        .heading-visible {
          animation: fadeSlideDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .book-float {
          animation: floatBook 4s ease-in-out infinite;
        }
        .hand-float {
          animation: floatHand 3.5s ease-in-out infinite;
        }
        .dot-pop {
          opacity: 0;
          transform: scale(0);
        }
        .dot-visible {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .dot-pulse {
          animation: pulseRing 2s ease-in-out infinite;
        }
        .card-hover {
          transition:
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.4s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.15);
        }
        .arrow-btn {
          transition:
            transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            background-color 0.3s ease;
        }
        .group:hover .arrow-btn {
          transform: scale(1.15);
          background-color: rgba(255, 255, 255, 0.6);
        }
        .title-line {
          overflow: visible;
          display: block;
        }
        .title-line-inner {
          display: inline-block;
        }
        .title-line-enter {
          transform: translateY(100%);
          opacity: 0;
        }
        .title-line-visible {
          transition:
            transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.9s ease;
          transform: translateY(0);
          opacity: 1;
        }
        .expand-content {
          transition:
            max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.4s ease,
            margin-top 0.4s ease;
        }
        .read-more-text {
          transition:
            color 0.3s ease,
            letter-spacing 0.3s ease;
        }
        .group:hover .read-more-text {
          letter-spacing: 0.05em;
        }
        .card-shine {
          position: relative;
          overflow: hidden;
        }
        .card-shine::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
          transition: left 0.6s ease;
          pointer-events: none;
          z-index: 1;
        }
        .card-shine:hover::before {
          left: 120%;
        }
      `}</style>

      <section ref={sectionRef} className="py-10 overflow-hidden">
        <div className="max-w-[95%] mx-auto px-4 lg:px-8">
          {/* Heading with line-by-line animation */}
          <h2
            className={`
    ${locale === "en" ? "font-adamina" : "font-cairo"}
    text-center text-3xl lg:text-6xl mb-10 md:mb-20
    ${isVisible ? "heading-visible" : "heading-enter"}
  `}
            style={{ animationDelay: "0ms" }}
          >
            <span
              className={`title-line ${
                isVisible ? "title-line-visible" : "title-line-enter"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <span className="title-line-inner">
                {isArabic
                  ? "نحن نُعلّم ونقدّم الاستشارات."
                  : "We educate and advise."}
              </span>
            </span>
            <br />
            <span
              className={`title-line ${
                isVisible ? "title-line-visible" : "title-line-enter"
              }`}
              style={{ transitionDelay: "250ms" }}
            >
              <span className="title-line-inner">
                {" "}
                {isArabic ? "أعلى جودة طباعة" : "Highest print quality"}
              </span>
            </span>
            <br />
            <span
              className={`title-line ${
                isVisible ? "title-line-visible" : "title-line-enter"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <span className="title-line-inner">
                {" "}
                {isArabic ? "مضمونة." : "guaranteed."}
              </span>
            </span>
          </h2>

          <div className="relative mx-auto max-w-220">
            {/* Decorative book - floating */}
            <div
              className={`hidden md:block absolute -top-20 left-1/2 z-20 w-35 h-35 ${
                isVisible ? "book-float" : ""
              }`}
              style={{
                transform: "translateX(-50%)",
                animationDelay: "0.8s",
              }}
            >
              <Image
                src="/self-publishing/book-open.svg"
                alt="Book"
                fill
                className={`object-contain ${isArabic ? "-scale-x-100" : ""}`}
              />
            </div>

            {/* Small shapes with pop-in */}
            <div className="hidden md:block">
              <div
                className={`absolute top-2 left-10 w-4 h-4 bg-[#2F68FF] ${
                  isVisible ? "dot-visible dot-pulse" : "dot-pop"
                }`}
                style={{ animationDelay: "600ms" }}
              />
              <div
                className={`absolute top-8 right-16 w-2 h-2 rounded-full bg-[#9D63FF] ${
                  isVisible ? "dot-visible" : "dot-pop"
                }`}
                style={{ animationDelay: "750ms" }}
              />
              <div
                className={`absolute top-24 -right-6 w-4 h-4 bg-[#BDEFF1] ${
                  isVisible ? "dot-visible" : "dot-pop"
                }`}
                style={{ animationDelay: "900ms" }}
              />
              <div
                className={`absolute top-[38%] -left-8 w-3 h-3 rounded-full bg-[#F4A16D] ${
                  isVisible ? "dot-visible" : "dot-pop"
                }`}
                style={{ animationDelay: "1050ms" }}
              />
              <div
                className={`absolute bottom-28 -left-2 w-4 h-4 bg-[#9D63FF] ${
                  isVisible ? "dot-visible" : "dot-pop"
                }`}
                style={{ animationDelay: "1200ms" }}
              />
              <div
                className={`absolute bottom-10 -right-12 w-5 h-5 bg-[#9D63FF] ${
                  isVisible ? "dot-visible" : "dot-pop"
                }`}
                style={{ animationDelay: "1350ms" }}
              />
              <div
                className={`absolute top-[45%] right-8 w-4 h-4 rounded-full bg-[#2F68FF] ${
                  isVisible ? "dot-visible dot-pulse" : "dot-pop"
                }`}
                style={{ animationDelay: "1500ms" }}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="flex flex-col gap-4">
                {leftCards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`
                      ${card.color}
                      min-h-20.5 md:min-h-70.5
                      p-7 flex flex-col justify-between
                      cursor-pointer group
                      card-hover card-shine
                      ${isVisible ? "card-visible" : "card-enter"}
                    `}
                    style={{
                      animationDelay: `${getDelay(index, "left")}ms`,
                    }}
                    onClick={() =>
                      setExpanded(expanded === card.id ? null : card.id)
                    }
                  >
                    <div>
                      <h3 className="text-3xl lg:text-[45px] font-medium leading-10">
                        {isArabic ? card.title.ar : card.title.en}
                      </h3>

                      <p className="mt-4 text-sm lg:text-[28px] leading-10">
                        {isArabic ? card.text.ar : card.text.en}
                      </p>

                      <div
                        className={`expand-content overflow-hidden ${
                          expanded === card.id
                            ? "max-h-40 opacity-100 mt-4"
                            : "max-h-0 opacity-0 mt-0"
                        }`}
                      >
                        <p className="text-sm lg:text-base leading-6">
                          {isArabic ? card.moreText.ar : card.moreText.en}
                        </p>
                      </div>
                    </div>

                    <button className="flex items-center gap-3 mt-6 cursor-pointer relative z-10">
                      <span className="text-sm read-more-text">
                        {expanded === card.id
                          ? isArabic
                            ? "عرض أقل"
                            : "Show less"
                          : isArabic
                            ? "اقرأ المزيد"
                            : "Read more"}
                      </span>

                      <span className="arrow-btn w-8 h-10 rounded-full border border-black/40 flex items-center justify-center">
                        {expanded === card.id ? (
                          <Image
                            src="/homeImg/arrowRight.svg"
                            alt="Arrow"
                            width={26}
                            height={14}
                            className="-rotate-90 transition-transform duration-700"
                          />
                        ) : (
                          <Image
                            src="/homeImg/arrowRight.svg"
                            alt="Arrow"
                            width={26}
                            height={14}
                            className="rotate-90 transition-transform duration-700 group-hover:rotate-120"
                          />
                        )}
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4 mt-4">
                {rightCards.map((card, index) => (
                  <div key={card.id}>
                    <div
                      className={`
                        ${card.color}
                        min-h-20.5 md:min-h-70.5
                        p-7 flex flex-col justify-between
                        cursor-pointer group
                        card-hover card-shine
                        ${isVisible ? "card-visible" : "card-enter"}
                      `}
                      style={{
                        animationDelay: `${getDelay(index, "right")}ms`,
                      }}
                      onClick={() =>
                        setExpanded(expanded === card.id ? null : card.id)
                      }
                    >
                      <div>
                        <h3 className="text-3xl lg:text-[45px] font-medium leading-tight">
                          {isArabic ? card.title.ar : card.title.en}
                        </h3>

                        <p className="mt-4 text-sm lg:text-[28px] leading-10">
                          {isArabic ? card.text.ar : card.text.en}
                        </p>

                        <div
                          className={`expand-content overflow-hidden ${
                            expanded === card.id
                              ? "max-h-40 opacity-100 mt-4"
                              : "max-h-0 opacity-0 mt-0"
                          }`}
                        >
                          <p className="text-sm lg:text-base leading-6">
                            {isArabic ? card.moreText.ar : card.moreText.en}
                          </p>
                        </div>
                      </div>

                      <button className="flex items-center gap-3 mt-6 cursor-pointer relative z-10">
                        <span className="text-sm read-more-text">
                          {expanded === card.id
                            ? isArabic
                              ? "عرض أقل"
                              : "Show less"
                            : isArabic
                              ? "اقرأ المزيد"
                              : "Read more"}
                        </span>

                        <span className="arrow-btn w-8 h-10 rounded-full border border-black/40 flex items-center justify-center">
                          {expanded === card.id ? (
                            <Image
                              src="/homeImg/arrowRight.svg"
                              alt="Arrow"
                              width={26}
                              height={14}
                              className="-rotate-90 transition-transform duration-700"
                            />
                          ) : (
                            <Image
                              src="/homeImg/arrowRight.svg"
                              alt="Arrow"
                              width={26}
                              height={14}
                              className="rotate-90 transition-transform duration-700 group-hover:rotate-120"
                            />
                          )}
                        </span>
                      </button>
                    </div>

                    {/* Hand illustration - floating */}
                    {index === 0 && (
                      <div
                        className={`hidden md:block relative z-20 -mt-14 -mb-17 pointer-events-none ${
                          isVisible ? "hand-float" : "opacity-0"
                        }`}
                        style={{
                          animationDelay: "1.2s",
                          transition: "opacity 0.6s ease 1.2s",
                        }}
                      >
                        <Image
                          src="/self-publishing/hand-money.svg"
                          alt="Hand"
                          width={240}
                          height={90}
                          className={`object-contain ${isArabic ? "-scale-x-100" : ""}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
