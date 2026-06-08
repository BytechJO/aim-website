import { useLocale } from "next-intl";

import Image from "next/image";
import Link from "next/link";

export default function HeroSelfPublishing() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  return (
    <section className="py-10">
      <div className="max-w-[90%] mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div>
            <h1
              className={`${
                locale === "en" ? "font-adamina" : "font-cairo"
              } text-5xl lg:text-7xl text-black`}
            >
              {isArabic ? "النشر الذاتي" : "Self-publishing"}
            </h1>

            <p className="mt-8 max-w-2xl text-[18px] leading-9 text-black/80">
              {isArabic
                ? "شهدنا خلال السنوات القليلة الماضية اهتمامًا متزايدًا بهذا النوع من النشر. يتزايد عدد الأشخاص الذين يقومون بتطوير وطباعة كتبهم بأنفسهم بشكل مستقل، دون الاعتماد على دور النشر الاحترافية، ثم يبيعونها عبر وسائل التواصل الاجتماعي أو مواقعهم الإلكترونية الخاصة، غالبًا خارج قنوات البيع التقليدية."
                : `Over the last few years we have seen a growing interest in this
              type of publishing. More and more people develop and print their
              books independently, without relying on professional publishing
              companies, and then they sell them using social media or own
              websites, often outside traditional sales channels.`}
            </p>

            <Link
              href="/services"
              className="mt-12 px-10 py-4 rounded-full bg-[#285FE7] text-white text-lg w-70 h-14 hover:bg-[#5585FD] cursor-pointer inline-flex items-center justify-center"
            >
              {isArabic ? "اطلع على منتجاتنا" : "View our products"}
            </Link>
          </div>

          {/* Right Images */}
          <div className="grid grid-cols-2 gap-3 max-w-[76%] mx-auto">
            {/* Left Column */}
            <div className="flex flex-col gap-3">
              <div>
                <Image
                  src="/self-publishing/top-left.png"
                  alt=""
                  width={500}
                  height={500}
                />
              </div>

              <Image
                src="/self-publishing/bottom-left.png"
                alt=""
                width={500}
                height={500}
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3 mt-10">
              <Image
                src="/self-publishing/top-right.png"
                alt=""
                width={500}
                height={500}
              />

              {/* Bottom Right */}
              <Image
                src="/self-publishing/bottom-right.png"
                alt=""
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
