"use client";

import Image from "next/image";
import { useEffect } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { useLocale } from "next-intl";

function GalleryImage({
  img,
  className = "",
}: {
  img: string;
  className?: string;
}) {
  return (
    <a
      href={img}
      data-pswp-width="1600"
      data-pswp-height="1600"
      className={`relative block w-full h-full overflow-hidden ${className}`}
    >
      <Image
        src={img}
        alt=""
        fill
        className="object-cover hover:scale-105 transition duration-500"
      />
    </a>
  );
}

export default function ExamplesSection({ images }: { images: string[] }) {
  const locale = useLocale();

  const validImages = images.filter(Boolean);
  const count = validImages.length;

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#examples-gallery",
      children: "a",
      pswpModule: () => import("photoswipe"),
    });

    lightbox.init();

    return () => lightbox.destroy();
  }, []);

  if (!count) return null;

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
        {validImages.map((img, index) => (
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
      <div id="examples-gallery" className="hidden md:block">
        {/* 1 */}
        {count === 1 && (
          <div className="grid grid-cols-1 gap-3 h-87.5 w-100">
            <GalleryImage img={validImages[0]} className="w-full h-full" />
          </div>
        )}

        {/* 2 */}
        {count === 2 && (
          <div className="grid grid-cols-2 gap-3 h-80 w-120">
            {validImages.map((img, index) => (
              <GalleryImage key={index} img={img} className="h-full" />
            ))}
          </div>
        )}

        {/* 3 */}
        {count === 3 && (
          <div className="grid grid-cols-3 gap-3 h-87.5">
            {validImages.map((img, index) => (
              <GalleryImage key={index} img={img} className="h-full" />
            ))}
          </div>
        )}

        {/* 4 */}
        {count === 4 && (
          <div className="grid grid-cols-12 gap-3 h-87.5">
            <GalleryImage img={validImages[0]} className="col-span-4 h-full" />

            <div className="col-span-4 flex flex-col gap-3">
              <GalleryImage img={validImages[1]} className="flex-1" />
              <GalleryImage img={validImages[2]} className="flex-1" />
            </div>

            <GalleryImage img={validImages[3]} className="col-span-4 h-full" />
          </div>
        )}

        {/* 5 */}
        {count === 5 && (
          <div className="grid grid-cols-12 gap-3 h-87.5">
            <GalleryImage img={validImages[0]} className="col-span-4 h-full" />

            <div className="col-span-4 flex flex-col gap-3">
              <GalleryImage img={validImages[1]} className="flex-1" />
              <GalleryImage img={validImages[2]} className="flex-1" />
            </div>

            <div className="col-span-4 flex flex-col gap-3">
              <GalleryImage img={validImages[3]} className="flex-1" />
              <GalleryImage img={validImages[4]} className="flex-1" />
            </div>
          </div>
        )}

        {/* 6 */}
        {count === 6 && (
          <div className="grid grid-cols-3 grid-rows-2 gap-3 h-87.5">
            {validImages.map((img, index) => (
              <GalleryImage key={index} img={img} />
            ))}
          </div>
        )}

        {/* 7 أو أكثر */}
        {/* 7 */}
        {count === 7 && (
          <div className="grid grid-cols-12 gap-3 h-87.5">
            <GalleryImage img={validImages[0]} className="col-span-3 h-full" />

            <div className="col-span-9 h-full grid grid-cols-3 grid-rows-2 gap-3">
              {validImages.slice(1, 7).map((img, index) => (
                <GalleryImage key={index} img={img} />
              ))}
            </div>
          </div>
        )}

        {/* 8 - 10 */}
        {count >= 8 && count <= 10 && (
          <div className="grid grid-cols-12 gap-3 h-87.5">
            <GalleryImage img={validImages[0]} className="col-span-3 h-full" />

            <div className="col-span-4 h-full grid grid-cols-3 grid-rows-2 gap-3">
              {validImages.slice(1, 7).map((img, index) => (
                <GalleryImage key={index} img={img} />
              ))}
            </div>

            {validImages[7] && (
              <GalleryImage
                img={validImages[7]}
                className="col-span-3 h-full"
              />
            )}

            {validImages.length > 8 && (
              <div className="col-span-2 flex flex-col gap-3">
                {validImages.slice(8, 10).map((img, index) => (
                  <GalleryImage key={index} img={img} className="flex-1" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 11+ */}
        {count > 10 && (
          <div className="grid grid-cols-5 gap-3">
            {validImages.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <GalleryImage img={img} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
