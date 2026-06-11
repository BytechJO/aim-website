"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function StorySection() {
  const t = useTranslations("StorySection");
  const floatingStyles = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-60px);
    }
  }

  .float {
    animation: float 20s ease-in-out infinite;
  }
`;
  return (
    <>
      <section className="py-20">
        <div className="max-w-362.5 mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Left Card */}
            <div className="bg-[#3A3A3A] rounded-xl p-4 lg:p-20 text-white flex flex-col justify-center order-2 lg:order-1">
              <h2 className="text-3xl lg:text-5xl leading-tight font-light max-w-md">
                {t("title")}
              </h2>

              <p className="mt-8 text-sm lg:text-base text-white/80 max-w-md leading-relaxed ">
                {t("description")}
              </p>

              <p className="mt-8 text-sm text-white/70">{t("Library Team")}</p>
              <Link
                href="/contact"
                className="mt-10 w-fit bg-white text-black rounded-full px-12 py-4 font-medium hover:scale-[1.02] transition inline-block"
              >
                {t("Contact Us")}
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative min-h-100 lg:min-h-175 rounded-xl order-1 lg:order-2">
              <Image
                src="/homeImg/story-image.svg"
                alt="Printing worker"
                fill
                className="object-cover rounded-xl"
              />

              {/* Decorations */}
              {/* Orange circle */}
              <div className="absolute top-[8%] right-[18%] w-4 h-4 rounded-full bg-[#F4A16D] float" />

              <div className="absolute top-[38%] right-[12%] w-5 h-5 bg-[#A66BFF] float" />

              <div className="absolute top-[35%] left-[15%] w-0 h-0 border-l-14 border-l-[#2F68FF] border-t-10 border-t-transparent border-b-10 border-b-transparent float  " />

              <div className="absolute bottom-[35%] left-[20%] w-4 h-4 bg-[#BDEFF1] float" />

              <div className="absolute bottom-[12%] left-[-1%] w-6 h-6 rounded-full bg-[#A66BFF] float" />

              <div className="absolute bottom-[18%] right-[4%] w-0 h-0 border-l-14 border-l-[#F4A16D] border-t-10 border-t-transparent border-b-10 border-b-transparent float" />
            </div>
          </div>
        </div>
      </section>
      <style jsx>{floatingStyles}</style>
    </>
  );
}
