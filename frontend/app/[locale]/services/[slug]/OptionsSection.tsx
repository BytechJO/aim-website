"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import Link from "next/link";
type OptionsProps = {
  options: {
    format: {
      min: { ar: string; en: string };
      max: { ar: string; en: string };
    };
    thickness: {
      min: { ar: string; en: string };
      max: { ar: string; en: string };
    };
    materials: {
      ar: string;
      en: string;
    };
    extras: {
      ar: string;
      en: string;
    };
    enhancements: {
      ar: string;
      en: string;
    };
  };
};

export default function OptionsSection({ options }: OptionsProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="max-w-[50%]">
      <h2 className="text-[35px] font-semibold text-black mb-8">
        {locale === "ar" ? "الخيارات" : "Options"}
      </h2>

      <div className="space-y-4">
        {/* Format */}
        <div className="border border-[#D9D9D9] bg-white px-4 py-4">
          <div className="flex items-center gap-2 border-b border-[#E7E7E7] pb-3">
            <Image src="/options/format.svg" alt="" width={16} height={16} />
            <h3 className="text-[15px] font-medium text-[#222]">
              {isArabic ? "الحجم" : "Format"}
            </h3>
          </div>

          <div className="pt-4 text-[14px] leading-7 text-[#333]">
            <div className="flex gap-8">
              <span className="font-medium min-w-10">min.</span>
              <span>
                {isArabic ? options.format.min.ar : options.format.min.en}
              </span>
            </div>

            <div className="flex gap-8 mt-2">
              <span className="font-medium min-w-10">max.</span>
              <span>
                {isArabic ? options.format.max.ar : options.format.max.en}
              </span>
            </div>
          </div>
        </div>

        {/* Thickness */}
        <div className="border border-[#D9D9D9] bg-white px-4 py-4">
          <div className="flex items-center gap-2 border-b border-[#E7E7E7] pb-3">
            <Image src="/options/thickness.svg" alt="" width={16} height={16} />
            <h3 className="text-[15px] font-medium text-[#222]">
              {isArabic ? "سماكة الكتاب" : "Book block thickness"}
            </h3>
          </div>

          <div className="pt-4 text-[14px] leading-7 text-[#333]">
            <div className="flex gap-8">
              <span className="font-medium min-w-10">min.</span>
              <span>
                {isArabic ? options.thickness.min.ar : options.thickness.min.en}
              </span>
            </div>

            <div className="flex gap-8 mt-2">
              <span className="font-medium min-w-10">max.</span>
              <span>
                {isArabic ? options.thickness.max.ar : options.thickness.max.en}
              </span>
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="border border-[#D9D9D9] bg-white px-4 py-4">
          <div className="flex items-center gap-2 border-b border-[#E7E7E7] pb-3">
            <Image src="/options/materials.svg" alt="" width={16} height={16} />
            <h3 className="text-[15px] font-medium text-[#222]">
              {isArabic ? "مواد الغلاف" : "Cover materials"}
            </h3>
          </div>

          <div className="pt-4 text-[14px] leading-7 text-[#333]">
            {isArabic ? options.materials.ar : options.materials.en}
          </div>
        </div>

        {/* Extras */}
        <div className="border border-[#D9D9D9] bg-white px-4 py-4">
          <div className="flex items-center gap-2 border-b border-[#E7E7E7] pb-3">
            <Image src="/options/extras.svg" alt="" width={16} height={16} />
            <h3 className="text-[15px] font-medium text-[#222]">
              {isArabic ? "إضافات الغلاف" : "Cover extras"}
            </h3>
          </div>

          <div className="pt-4 text-[14px] leading-7 text-[#333]">
            {isArabic ? options.extras.ar : options.extras.en}
          </div>
          <div className="pt-4 text-[14px]  text-[#333]">
            {isArabic
              ? "اقرأ المزيد عن الملحقات والإضافات الخاصة بالغطاء"
              : "Read more about the accessories and cover extras"}
            <span>
              {" "}
              <Link
                href="/cover-extras"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {isArabic ? "هنا" : "Here"}
              </Link>
            </span>
          </div>
        </div>

        {/* Enhancements */}
        <div className="border border-[#D9D9D9] bg-white px-4 py-4">
          <div className="flex items-center gap-2 border-b border-[#E7E7E7] pb-3">
            <Image
              src="/options/enhancements.svg"
              alt=""
              width={16}
              height={16}
            />
            <h3 className="text-[15px] font-medium text-[#222]">
              {isArabic ? "التحسينات" : "Enhancements"}
            </h3>
          </div>

          <div className="pt-4 text-[14px] leading-7 text-[#333]">
            {isArabic ? options.enhancements.ar : options.enhancements.en}
          </div>
          <div className="pt-4 text-[14px]  text-[#333]">
            {isArabic
              ? "اقرأ المزيد عن التحسينات المتاحة"
              : "Read more about the available enhancements"}
            <span>
              {" "}
              <Link
                href="/enhancement"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                {isArabic ? "هنا" : "Here"}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
