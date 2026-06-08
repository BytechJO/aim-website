"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export default function PublishingBanner() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="relative z-10 -mb-24">
      <div className="max-w-full md:max-w-7xl mx-auto md:px-6">
        <div className="max-w-full md:max-w-4xl mx-auto rounded-b-sm bg-linear-to-r from-[#EEE27D] to-[#EE8C6C] px-12 py-10 shadow-lg">
          <h2 className="text-4xl font-semibold text-[#1E1E1E] mb-4">
            {isArabic
              ? "للناشرين والنشر الذاتي"
              : "For publishing companies and self-publishers"}
          </h2>

          <p className="text-[#444] mb-8">
            {isArabic
              ? "تعرّف على مزايا العمل معنا."
              : "Learn about the benefits of working with us."}
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/self-publishing"
              className="px-6 py-3 rounded-full bg-[#3357FF] text-white font-medium"
            >
              {isArabic ? "النشر الذاتي" : "Self-publishing"}
            </Link>

            <Link
              href="/about"
              className="px-6 py-3 rounded-full bg-white text-black font-medium"
            >
              {isArabic ? "معاييرنا" : "Our standards"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
