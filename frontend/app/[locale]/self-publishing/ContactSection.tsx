import { useLocale } from "next-intl";
import Image from "next/image";

export default function ContactSection() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  return (
    <section className="py-24">
      <div className="w-full md:max-w-[80%] mx-auto px-4 lg:px-8">
        <div className="bg-[#F7F7F7] p-8 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-75 lg:h-105">
              <Image
                src="/self-publishing/contact-section.png"
                alt="Contact"
                fill
                className={`object-contain
                    
                    `}
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-[20px] text-[#202543]">
                {isArabic
                  ? "هل تخطط للنشر الذاتي؟"
                  : "Planning to self-publish?"}
              </p>

              <h2
                className={`${locale === "en" ? "font-adamina" : "font-cairo"} mt-4 text-5xl lg:text-7xl font-light text-[#202543]`}
              >
                {isArabic ? "لنتحدث" : "Let’s talk"}
              </h2>

              <p className="mt-6 text-black/70">
                {isArabic
                  ? "اتصل بنا وسنساعدك في القيام بذلك."
                  : "Contact us and we will help you do it."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10">
                <button className="px-15 py-3 rounded-full bg-black text-white cursor-pointer transition-all duration-300 hover:bg-[#5C5858] hover:scale-105">
                  {isArabic ? "اطرح سؤالاً" : "Ask a question"}
                </button>

                <button className="px-15 py-3 rounded-full bg-white text-black border border-gray-200 cursor-pointer transition-all duration-300 hover:bg-[#E1D8D8]   hover:scale-105">
                  {isArabic ? "النشر الذاتي" : "Self-publishing"}
                </button>
              </div>

              <p className="mt-10 text-sm text-black/70">
                {isArabic
                  ? "يمكنكم أيضاً مراسلتنا عبر البريد الإلكتروني:"
                  : "You can also write to us:"}
                <a href="mailto:info@example.com" className="ml-2 underline">
                  sales@aim.com.pl
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
