"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ENDPOINTS } from "@/app/api/endpoints";
interface Review {
  id: number;
  title: string;
  body: string;
  author: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
}
export default function ReviewsSection() {
  const t = useTranslations("ReviewsSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(ENDPOINTS.REVIEWS_LATEST);

        if (!res.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await res.json();

        setReviews(data.filter((item: Review) => item.is_active));
      } catch (error) {
        console.error("Reviews fetch error:", error);
      }
    };

    fetchReviews();
  }, []);
  const [current, setCurrent] = useState(0);

  const visibleCards = 3.5;
  const step = 3.5;

  const maxSlide = Math.max(0, reviews.length - visibleCards);

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
      <div className="max-w-300.5 mx-auto px-4 sm:px-6 lg:px-8">
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
              className={`${locale === "en" ? "font-adamina" : "font-noto-arabic"} text-4xl lg:text-[50px] text-[#202543]`}
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
                  {review.body}
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
            className={`flex gap-8 transition-transform duration-700 ease-in-out`}
            style={{
              transform: isArabic
                ? `translateX(${current * 28.57}%)`
                : `translateX(-${current * 28.57}%)`,
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="w-full md:w-1/2 lg:w-[28.57%] shrink-0"
              >
                <div
                  className="text-blue-600 text-xl mb-4 tracking-[2px]"
                  dir="ltr"
                >
                  {"★".repeat(review.rating)}
                  <span className="text-gray-300">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
                <h3
                  dir="ltr"
                  className="text-[32px] font-medium mb-6 text-left"
                >
                  {review.title}
                </h3>

                <p dir="ltr" className="leading-8 text-[16px] mb-6 text-left">
                  {review.body}
                </p>

                <p dir="ltr" className="text-sm text-left">
                  {review.author}
                </p>
              </div>
            ))}
          </div>

          {current > 0 && (
            <button
              onClick={() => setCurrent((prev) => Math.max(prev - step, 0))}
              className={`absolute top-1/2 -translate-y-1/2 w-20 h-16 rounded-full bg-[#E8B090] opacity-70 hover:opacity-100 flex items-center justify-center z-20 ${
                isArabic ? "right-0" : "left-0"
              }`}
            >
              <Image
                src="/homeImg/arrowRight.svg"
                alt="Previous"
                width={26}
                height={14}
                className={isArabic ? "" : "rotate-180"}
              />
            </button>
          )}

          {current < maxSlide && (
            <button
              onClick={() =>
                setCurrent((prev) => Math.min(prev + step, maxSlide))
              }
              className={`absolute top-1/2 -translate-y-1/2 w-20 h-16 rounded-full bg-[#E8B090] opacity-70 hover:opacity-100 flex items-center justify-center z-20 ${
                isArabic ? "left-0" : "right-0"
              }`}
            >
              <Image
                src="/homeImg/arrowRight.svg"
                alt="Next"
                width={26}
                height={14}
                className={isArabic ? "rotate-180" : ""}
              />
            </button>
          )}
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
