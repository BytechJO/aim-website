"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
export default function EnhancementHero() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section>
      <section className="relative">
        <div
          className="absolute inset-0 h-90 lg:h-105 bg-cover"
          style={{
            backgroundImage: "url('/enhancement/Enhancement.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: isArabic ? "scaleX(-1)" : "scaleX(1)",
          }}
        />

        <div className="relative h-90 lg:h-105 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-8">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`${
                isArabic ? "font-cairo" : "font-adamina"
              } text-5xl lg:text-7xl text-black`}
            >
              {isArabic ? "التحسينات" : "Enhancement"}
            </motion.h1>
          </div>
        </div>
      </section>
      <div className="py-20">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-[18px] leading-8">
            {isArabic
              ? `الكتب التي نطبعها ونربطها مصنوعة بشغف وحب. نحن نهدف 
                لجعلها جميلة قدر الإمكان. نحن نولي اهتماما خاصا 
                للأغلفة وطرق تزيينها، لأننا نعرف ذلك 
                الانطباع الأول – كيف يبدو الغلاف، وكيف تم تصميمه 
                وما هي المشاعر التي تثيرها لدى المشترين المحتملين - تحدد إلى حد كبير 
                نجاحها في السوق. نحن نقدم العديد من الطرق لجعل الغطاء الخاص بك 
                أكثر جاذبية، سواء كانت مصنوعة من الورق أو القماش أو الجلود البيئية، 
                الفلين أو أي مادة أخرى متطورة. نحن نقدم تعزيز ل 
                حواف الكتلة من كتابك.`
              : `The books we print and bind are made with passion and love. We aim
            to make them as beautiful as possible. We give particular attention
            to covers and the ways they can be decorated, because we know that
            the first impression – what the cover looks like, how it is designed
            and what emotions it evokes in potential buyers – largely determines
            its success on the market. We offer many ways to make your cover
            more attractive, whether it is made of paper, cloth, eco-leather,
            cork or any other sophisticated material. We provide enhancement for
            the block edges of your book.`}
          </p>
          <p className="text-[18px] mt-5">
            {isArabic
              ? "اطلع على ما لدينا لك."
              : "Check out what we have got for you."}
          </p>
        </div>
      </div>
    </section>
  );
}
