"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function InstagramSection() {
  const t = useTranslations("InstagramSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const instagramPosts = [
    {
      id: 1,
      image: "/homeImg/instagram/post1.svg",
      date: "20 January 2026",
      caption:
        "Time for a ‘private moment’ 😉 We present to you ✨ a festive notebook, entirely our own creation – that is to say, we are both its originators and creators. And we are very proud of this notebook 😍",
      link: "#",
    },
    {
      id: 2,
      image: "/homeImg/instagram/post2.svg",
      date: "20 January 2026",
      caption:
        "Time for a ‘private moment’ 😉 We present to you ✨ a festive notebook, entirely our own creation – that is to say, we are both its originators and creators. And we are very proud of this notebook 😍",
      link: "#",
    },
    {
      id: 3,
      image: "/homeImg/instagram/post3.svg",
      date: "20 January 2026",
      caption:
        "Time for a ‘private moment’ 😉 We present to you ✨ a festive notebook, entirely our own creation – that is to say, we are both its originators and creators. And we are very proud of this notebook 😍",
      link: "#",
    },
    {
      id: 4,
      image: "/homeImg/instagram/post4.svg",
      date: "20 January 2026",
      caption: "Packaging materials",
      link: "#",
    },
    {
      id: 5,
      image: "/homeImg/instagram/post5.svg",
      date: "20 January 2026",
      caption: "Recycled paper collection",
      link: "#",
    },
    {
      id: 6,
      image: "/homeImg/instagram/post3.svg",
      date: "20 January 2026",
      caption:
        "Time for a ‘private moment’ 😉 We present to you ✨ a festive notebook, entirely our own creation – that is to say, we are both its originators and creators. And we are very proud of this notebook 😍",
      link: "#",
    },
  ];

  const [current, setCurrent] = useState(0);

  const maxSlide = instagramPosts.length - 3.5;
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

    const next = Math.min(mobileCurrent + 1, instagramPosts.length - 1);

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
    <section className="py-20 overflow-hidden bg-[#F5F5F5]">
      <div className="w-full lg:max-w-[80%] mx-auto px-4 lg:px-8 ">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <h2
            className={`${locale === "en" ? "font-adamina" : "font-cairo"} text-4xl lg:text-7xl font-light text-[#202543] leading-none`}
          >
            {t("Instagram")}
          </h2>

          <Link
            href="https://www.instagram.com/aim.ambition.press/"
            target="_blank"
            className={`flex items-center gap-2 text-sm underline underline-offset-6 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <span>{t("Follow us")}</span>

            <Image
              src="/homeImg/arrowcorner.svg"
              alt=""
              width={14}
              height={14}
            />
          </Link>
        </div>
        {/* MOBILE */}
        <div
          ref={mobileSliderRef}
          onScroll={handleMobileScroll}
          className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {instagramPosts.map((post) => (
            <div key={post.id} className="w-full shrink-0 snap-center">
              <div className=" relative h-full">
                <div className="absolute top-6 right-6 flex gap-2 z-20">
                  {" "}
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
                    disabled={mobileCurrent === instagramPosts.length - 1}
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

                <div className="group flex flex-col h-full">
                  <div className="relative aspect-4/5 overflow-hidden bg-[#f5f5f5]">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 mt-3">{post.date}</p>

                  <p className="text-sm mt-2 leading-6 line-clamp-3 grow">
                    {post.caption}
                  </p>

                  <Link
                    href={post.link}
                    className="flex items-center gap-2 mt-auto pt-4 text-sm"
                  >
                    {t("View on Instagram")}
                    <Image
                      src="/homeImg/arrowCircle.svg"
                      alt=""
                      width={20}
                      height={18}
                      className={isArabic ? "rotate-180" : ""}
                    />
                  </Link>
                </div>
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
            {instagramPosts.map((post) => (
              <div
                key={post.id}
                className="w-full md:w-1/2 lg:w-[20%] shrink-0 px-4"
              >
                <div className="group h-full flex flex-col">
                  <div className="relative aspect-4/5 overflow-hidden bg-[#f5f5f5]">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 mt-3">{post.date}</p>

                  <p className="text-sm mt-2 leading-6 line-clamp-3 grow">
                    {post.caption}
                  </p>

                  <Link
                    href={post.link}
                    className="flex items-center gap-2 mt-auto pt-4 text-sm"
                  >
                    {t("View on Instagram")}
                    <Image
                      src="/homeImg/arrowCircle.svg"
                      alt=""
                      width={20}
                      height={18}
                      className={isArabic ? "rotate-180" : ""}
                    />
                  </Link>
                </div>
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
      </div>
    </section>
  );
}
