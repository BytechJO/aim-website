"use client";

import { useLocale } from "next-intl";
import Book3D from "./Book3D";

type LocalizedText = {
  ar: string;
  en: string;
};

type ProductDetailsProps = {
  title: LocalizedText;
  subtitle?: LocalizedText;
  description: LocalizedText;
  bestUse: LocalizedText;
  model3d: string;
};
export default function ProductDetails({
  title,
  subtitle,
  description,
  bestUse,
  model3d,
}: ProductDetailsProps) {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="bg-[#F5F5F5] py-15">
      <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto px-6">
        <div>
          <h1 className="text-6xl font-bold">
            {isArabic ? title.ar : title.en}
          </h1>

          {subtitle && (
            <p className="text-3xl mt-2">
              {isArabic ? subtitle.ar : subtitle.en}
            </p>
          )}

          <p className="mt-10 text-gray-700 leading-6 whitespace-pre-line">
            {isArabic ? description.ar : description.en}
          </p>

          <h2 className="text-2xl mt-10 mb-3">
            {isArabic ? "أفضل استخدام" : "Best use"}
          </h2>

          <p className="text-gray-700">{isArabic ? bestUse.ar : bestUse.en}</p>
        </div>

        <Book3D modelUrl={model3d} />
      </div>
    </section>
  );
}
