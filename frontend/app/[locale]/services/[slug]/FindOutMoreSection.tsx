"use client";

import Image from "next/image";
import { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useLocale } from "next-intl";

type FindOutMoreSectionProps = {
  description: {
    ar: string;
    en: string;
  };
  images: string[];
};
export default function FindOutMoreSection({
  description,
  images,
}: FindOutMoreSectionProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  return (
    <section className="py-10">
      <h2 className="text-[28px] font-light text-black mb-10">
        {isArabic ? "اكتشف المزيد" : "Find out more"}
      </h2>

      <div
        id="gallery"
        className="grid grid-cols-3 md:grid-cols-3 gap-4 md:max-w-[50%]"
      >
        {images.map((src, index) => (
          <a
            key={index}
            href={src}
            data-pswp-width="1600"
            data-pswp-height="1600"
            className="relative aspect-square overflow-hidden"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover hover:scale-105 transition"
            />
          </a>
        ))}
      </div>
      <div className="mt-10 md:max-w-[50%]">
        <h3 className="text-[24px] font-semibold text-black mb-4">
          {isArabic ? "صديق للبيئة" : "Eco-friendly"}
        </h3>

        <p className="text-[16px] leading-8 text-[#333]">
          {isArabic ? description.ar : description.en}
        </p>
      </div>
    </section>
  );
}
