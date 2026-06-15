"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
export default function BindingHero() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section>
      <section className="relative">
        <div
          className="absolute inset-0 h-50 lg:h-105 bg-cover"
          style={{
            backgroundImage: "url('/services/background.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: isArabic ? "scaleX(-1)" : "scaleX(1)",
          }}
        />

        <div className="relative h-50 lg:h-105 flex items-center">
          <div className="max-w-5xl mx-auto w-full px-8 lg:px-20">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`${
                isArabic ? "font-cairo" : "font-adamina"
              } text-4xl lg:text-7xl text-black`}
            >
              {isArabic ? " التجليد" : "Binding "}
            </motion.h1>
          </div>
        </div>
      </section>
      <div className="py-10">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-[18px] leading-8">
            {isArabic
              ? `نطبع الكتب رقميًا بكميات صغيرة ومتوسطة. نوفر جميع أنواع التجليد مع أي تحسينات ترغبون بها. إذا أردتم معاينة شكل الكتاب النهائي، اطلبوا نسخة تجريبية. نطبع الكتب التقليدية، بالإضافة إلى الكتالوجات، والبروشورات، والمجلدات، والتقارير السنوية، وكتيبات التعليمات، والمجلات، وجميع أنواع المخططات والتقاويم.`
              : `We print books digitally in short and medium runs. We offer every kind of binding with any enhancement you like. If you want to see what the book will look like in its final shape, order a sample copy. We print conventional books, but also catalogues, brochures, folders, annual reports, instruction manuals, magazines and all sorts of planners and calendars.`}
          </p>
          <p className="text-[18px] mt-5">
            {isArabic
              ? "اطلع على أنواع التجليد لدينا."
              : "See our binding types."}
          </p>
        </div>
      </div>
    </section>
  );
}
