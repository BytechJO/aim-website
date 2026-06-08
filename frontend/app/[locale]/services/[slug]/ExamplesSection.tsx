"use client";

import Image from "next/image";
import { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useLocale } from "next-intl";

export default function ExamplesSection({ images }: { images: string[] }) {
  const locale = useLocale();

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#examples-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();

    return () => lightbox.destroy();
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <h2 className="font-adamina text-[56px] text-black mb-3">
        {locale === "ar" ? "أمثلة" : "Examples"}
      </h2>

      <p
        className={`text-[13px] text-[#444] mb-8 ${
          locale === "en" ? "font-adamina" : "font-cairo"
        }`}
      >
        {locale === "ar"
          ? "بعض الأمثلة على منتجاتنا بهذا النوع من التجليد"
          : "Some examples of our products with this type of binding"}
      </p>
      {/* Mobile */}
      <div id="examples-gallery" className="grid grid-cols-3 gap-3 md:hidden">
        {images.map((img, index) => (
          <a
            key={index}
            href={img}
            data-pswp-width="1600"
            data-pswp-height="1600"
            className="relative aspect-square overflow-hidden"
          >
            <Image src={img} alt="" fill className="object-cover" />
          </a>
        ))}
      </div>

      {/* Desktop */}
      <div
        id="examples-gallery"
        className="hidden md:grid grid-cols-12 gap-3 h-105"
      >
        <a
          href={images[0]}
          data-pswp-width="1600"
          data-pswp-height="1600"
          className="col-span-3 relative h-full overflow-hidden"
        >
          <Image
            src={images[0]}
            alt=""
            fill
            className="object-cover hover:scale-105 transition duration-500"
          />
        </a>

        <div className="col-span-4 h-full grid grid-cols-2 grid-rows-2 gap-3">
          {images.slice(1, 5).map((img, index) => (
            <a
              key={index}
              href={img}
              data-pswp-width="1600"
              data-pswp-height="1600"
              className="relative h-full overflow-hidden"
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </a>
          ))}
        </div>

        <a
          href={images[5]}
          data-pswp-width="1600"
          data-pswp-height="1600"
          className="col-span-3 relative h-full overflow-hidden"
        >
          <Image
            src={images[5]}
            alt=""
            fill
            className="object-cover hover:scale-105 transition duration-500"
          />
        </a>

        <div className="col-span-2 h-full flex flex-col gap-3">
          {images.slice(6, 8).map((img, index) => (
            <a
              key={index}
              href={img}
              data-pswp-width="1600"
              data-pswp-height="1600"
              className="relative flex-1 overflow-hidden"
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover hover:scale-105 transition duration-500"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
