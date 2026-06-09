"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { motion } from "framer-motion";

export default function ContactPage() {
  const t = useTranslations("ContactSection");
  const locale = useLocale();
  const isArabic = locale === "ar";
  return (
    <section>
      <div className="max-w-[85%] mx-auto px-4 lg:px-8">
        {" "}
        <div className="grid lg:grid-cols-2 gap-1 md:gap-12 items-center">
          {/* الصورة */}
          <div className="relative h-75 md:h-150">
            <Image
              src="/homeImg/contact.png"
              alt="Contact card"
              fill
              className="object-contain"
            />
          </div>

          {/* النص */}
          {/* Form */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-xl mx-auto"
            >
              <h2
                className={`${
                  locale === "en" ? "font-adamina" : "font-cairo"
                } text-4xl lg:text-[30px] font-light text-[#202543] mb-8`}
              >
                {isArabic ? "تواصل معنا" : "Contact Us"}
              </h2>

              <form className="space-y-2">
                <input
                  type="text"
                  placeholder={isArabic ? "الاسم الكامل" : "Full Name"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-4 outline-none focus:border-black"
                />

                <input
                  type="email"
                  placeholder={isArabic ? "البريد الإلكتروني" : "Email Address"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-4 outline-none focus:border-black"
                />

                <input
                  type="tel"
                  placeholder={isArabic ? "رقم الهاتف" : "Phone Number"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-4 outline-none focus:border-black"
                />

                <textarea
                  rows={2}
                  placeholder={
                    isArabic
                      ? "اكتب رسالتك هنا..."
                      : "Write your message here..."
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-4 outline-none focus:border-black resize-none"
                />

                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 rounded-full bg-black text-white hover:bg-[#514D4D] transition-colors cursor-pointer"
                >
                  {isArabic ? "إرسال الرسالة" : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
