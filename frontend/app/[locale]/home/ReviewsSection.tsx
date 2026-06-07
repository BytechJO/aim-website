"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
export default function ReviewsSection() {
  const t = useTranslations("ReviewsSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const reviews = [
    {
      id: 1,
      title: "Professionalism 10/10",
      text: `(...) I could go on and on… but when something is truly good, it speaks for itself. So I’ll keep it brief: Entrusting your first "book baby" to Totem is a little nerve-wracking—you can't help but worry. But what a surprise! Not only does the book look better than I ever imagined, but it also smells so freshly printed that my morning coffee tastes twice as good. Professionalism: 10/10. Patience with the customer: 11/10. The team’s sense of humor: priceless. Thanks to you guys, I can now successfully pretend to be a serious author. I highly recommend Totem to anyone who wants to see their thoughts turned into something that truly looks like a real book — not some cheap printout from a local copy shop.`,
      author: "Anita",
    },
    {
      id: 2,
      title: "Great communication",
      text: "Highly recommended! Great communication, proactive support at every stage, and a highly professional approach. Even though our book was a school project with a tight budget and a strict deadline, it turned out beautifully and received a ton of compliments. You guys are amazing, thank you! :)",
      author: "Anita",
    },
    {
      id: 3,
      title: "Incredible support",
      text: "First and foremost: wonderful people, incredible support, and absolutely fantastic print quality. The final product was outstanding, and the customer service was top-tier. We didn't experience a single hiccup throughout the entire process. My review is full of superlatives, but with their amazing approach to clients, top-notch quality, and attention to detail, I simply can't find any other words. I wholeheartedly recommend this printing house to everyone! :)",
      author: "City Media",
    },
    {
      id: 4,
      title: "The staff could not be more helpful",
      text: "Working with Totem was a highly professional experience, and the staff couldn't have been more helpful. From discussing the quote all the way to the final print, they patiently explained every single detail to me. I definitely recommend them, and I’m already coming back with my next publishing project. :)",
      author: "Barbara",
    },
    {
      id: 5,
      title: "Amazing quality",
      text: "Highly recommended! This was our second time printing a book here — this time, a beautifully illustrated photo and text album. Great collaboration, expert advice on choosing the right format, colors, and paper, plus absolute perfection from the initial design all the way to the final finish. Smooth shipping, delivered perfectly on time. Pure class!",
      author: "James",
    },
    {
      id: 6,
      title: "Highly recommended",
      text: "I am from Portugal and came across Totem online. The help I got in the process from the team and the final results were beyond my expectations, perfectly matching my idea with a quality better than I could have imagined. I had the help of several members of the team and can pledge for their kind helpfulness and proficient service. I was unfamiliar with the processes behind printing, and learned a lot in the process! The delivery went smoothly without delays or trouble; the package arrived a day earlier than expected, well protected and packed. I would at all situations recommended Totem services to friends and colleagues",
      author: "Sarah",
    },
  ];

  const [current, setCurrent] = useState(0);

  const maxSlide = reviews.length - 3.5;
  const isEnd = current >= maxSlide;

  const handleDesktopSlide = () => {
    if (!isEnd) {
      setCurrent((prev) => Math.min(prev + 3, maxSlide));
    } else {
      setCurrent((prev) => Math.max(prev - 3, 0));
    }
  };

  const [mobileCurrent, setMobileCurrent] = useState(0);
  const mobileSliderRef = useRef<HTMLDivElement | null>(null);

  const getMobileLeft = (index: number) => {
    if (!mobileSliderRef.current) return 0;

    const width = mobileSliderRef.current.offsetWidth;
    return isArabic ? -index * width : index * width;
  };

  const handleMobileScroll = () => {
    if (!mobileSliderRef.current) return;

    const width = mobileSliderRef.current.offsetWidth;
    const left = mobileSliderRef.current.scrollLeft;

    const index = Math.round(Math.abs(left) / width);
    setMobileCurrent(index);
  };

  const nextMobileSlide = () => {
    if (!mobileSliderRef.current) return;

    const next = Math.min(mobileCurrent + 1, reviews.length - 1);

    mobileSliderRef.current.scrollTo({
      left: getMobileLeft(next),
      behavior: "smooth",
    });
  };

  const prevMobileSlide = () => {
    if (!mobileSliderRef.current) return;

    const prev = Math.max(mobileCurrent - 1, 0);

    mobileSliderRef.current.scrollTo({
      left: getMobileLeft(prev),
      behavior: "smooth",
    });
  };
  return (
    <section id="reviews" className="py-20 overflow-hidden">
      <div className="w-full lg:max-w-[80%] mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-16"
        >
          <div>
            <h2
              className={`${locale === "en" ? "font-adamina" : "font-cairo"} text-4xl lg:text-[50px] text-[#202543]`}
            >
              {t("Read our clients’ reviews")}
            </h2>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-blue-600 text-xl">★★★★★</span>
              <p className="text-lg">
                {t("215 independent reviews on Google")}
              </p>
            </div>
          </div>

          <button className="group flex items-center gap-2 text-[16px] font-medium mb-10 cursor-pointer">
            {t("See all the reviews on Google")}

            <span className="w-10 h-6 rounded-full bg-[#E8B090] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#359DDA] ">
              <Image
                src="/homeImg/arrowRight.svg"
                alt="Arrow"
                width={20}
                height={10}
                className={isArabic ? "rotate-180" : ""}
              />
            </span>
          </button>
        </motion.div>

        {/* MOBILE */}
        <div
          ref={mobileSliderRef}
          onScroll={handleMobileScroll}
          className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {reviews.map((review) => (
            <div key={review.id} className="w-full shrink-0 snap-center">
              <div className=" relative h-full">
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={prevMobileSlide}
                    disabled={mobileCurrent === 0}
                    className="w-13 h-10 rounded-full bg-[#E8B090] flex items-center justify-center disabled:opacity-40"
                  >
                    <Image
                      src="/homeImg/arrowRight.svg"
                      alt="Previous"
                      width={14}
                      height={14}
                      className={isArabic ? "" : "rotate-180"}
                    />
                  </button>

                  <button
                    onClick={nextMobileSlide}
                    disabled={mobileCurrent === reviews.length - 1}
                    className="w-13 h-10 rounded-full bg-[#E8B090] flex items-center justify-center disabled:opacity-40"
                  >
                    <Image
                      src="/homeImg/arrowRight.svg"
                      alt="Next"
                      width={14}
                      height={14}
                      className={isArabic ? "rotate-180" : ""}
                    />
                  </button>
                </div>

                <div className="text-blue-600 text-xl mb-4">★★★★★</div>

                <h3 className="text-[28px] font-medium mb-6 pr-24" dir="ltr">
                  {review.title}
                </h3>

                <p className="leading-8 text-[16px] mb-6" dir="ltr">
                  {review.text}
                </p>

                <p className="text-sm" dir="ltr">
                  {review.author}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block relative overflow-hidden lg:w-[110%]">
          <div
            className={`flex transition-transform duration-700 ease-in-out`}
            style={{
              transform: isArabic
                ? `translateX(${current * 28.57}%)`
                : `translateX(-${current * 28.57}%)`,
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-full md:w-1/2 lg:w-[28.57%] shrink-0 px-6"
              >
                <div className="text-blue-600 text-xl mb-4" dir="ltr">
                  ★★★★★
                </div>

                <h3
                  dir="ltr"
                  className="text-[32px] font-medium mb-6 text-left"
                >
                  {review.title}
                </h3>

                <p dir="ltr" className="leading-8 text-[16px] mb-6 text-left">
                  {review.text}
                </p>

                <p dir="ltr" className="text-sm text-left">
                  {review.author}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleDesktopSlide}
            className={`absolute top-1/2 -translate-y-1/2 w-20 h-16 rounded-full bg-[#E8B090] opacity-70 hover:opacity-100 hover:bg-[#d99a77] transition-all duration-300 flex items-center justify-center z-20 ${
              isArabic
                ? isEnd
                  ? "right-0"
                  : "left-0"
                : isEnd
                  ? "left-0"
                  : "right-0"
            }`}
          >
            <Image
              src="/homeImg/arrowRight.svg"
              alt="Arrow"
              width={26}
              height={14}
              className={
                isArabic
                  ? isEnd
                    ? ""
                    : "rotate-180"
                  : isEnd
                    ? "rotate-180"
                    : ""
              }
            />
          </button>
        </div>
        <div className="py-20 -mx-4 lg:mx-0">
          <div className="rounded-2xl bg-linear-to-r from-[#E8DD7A] to-[#EB8C67] px-8 py-12 md:px-16 md:py-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="max-w-120">
                <h2 className="text-4xl md:text-5xl font-light text-black mb-6 leading-tight">
                  {t("Want to have your book printed?")}
                </h2>

                <p className="text-base md:text-lg text-black leading-8">
                  {t("bannerDescription")}
                </p>
              </div>

              <Link
                href="self-publishing"
                className="inline-flex items-center justify-center bg-white rounded-full px-10 py-5 text-lg font-medium text-[#202543] hover:scale-105 transition-all duration-300"
              >
                {t("Find out more about self-publishing")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
