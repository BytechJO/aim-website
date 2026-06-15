"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
export default function CoverExtrasHero() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section>
      <section className="relative">
        <div
          className="absolute inset-0 h-50 lg:h-105 bg-cover"
          style={{
            backgroundImage: "url('/cover_extra/bakground.png')",
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
              {isArabic ? "إضافات الغلاف" : "Cover extras"}
            </motion.h1>
          </div>
        </div>
      </section>
      <div className="py-10">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-[18px] leading-8">
            {isArabic
              ? `هناك العديد من الطرق لجعل الكتاب العادي أكثر جاذبية، ولضمان أن تُشكّل مكوناته المختلفة وحدة متماسكة وفعّالة، وذلك من خلال حلول تصميمية وأسلوبية مدروسة بعناية. كما تُتيح العديد من الحلول المُتاحة في مرحلة التجليد إمكانية جعل الكتاب أكثر عملية، بحسب طبيعته وهدفه. تشمل عروضنا مجموعة من الخيارات لجعل كتابك يلفت انتباه القارئ من خلال مظهره وميزاته الوظيفية.`
              : `There are lots of ways to make an ordinary book more attractive and to ensure that its individual components make a coherent and effective whole resulting from well-thought out stylistic and design solutions. Many of the solutions available at the binding stage also allow the publication to be more functional, depending on its nature and purpose. Our offerings include a range of options to make your publication catch the customer’s eye through its appearance and functional features.`}
          </p>
          <p className="text-[18px] mt-5">
            {isArabic
              ? "اطلع على ما لدينا لك."
              : "See what we have in store for you."}
          </p>
        </div>
      </div>
    </section>
  );
}
