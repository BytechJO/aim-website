"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
] as const;

const quickLinks = [
  { label: "About Us",  href: "/about" },
  { label: "Service",   href: "/services" },
  { label: "Profile",   href: "/profile" },
];

const forYouLinks = [
  { label: "Cover generator",  href: "/cover-generator" },
  { label: "Logos download",   href: "/logos-download" },
  { label: "Book+",            href: "/book-plus" },
  { label: "GREEN BOOK",       href: "/green-book" },
];

const helpLinks = [
  { label: "Frequently asked questions", href: "/faq" },
  { label: "Frequently asked questions", href: "/faq" },
  { label: "Basic quality standards",    href: "/quality" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE, delay } },
});

const staggerList = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const listItem = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

const dropdownAnim = {
  hidden:  { opacity: 0, y: 8,  scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.2, ease: EASE } },
  exit:    { opacity: 0, y: 6,  scale: 0.96, transition: { duration: 0.14 } },
};

function NavColumn({
  title, links, fontClass, delay, inView,
}: {
  title: string;
  links: { label: string; href: string }[];
  fontClass: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp(delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <h3 className="font-inter font-semibold text-[18px] leading-[24px] underline text-black mb-5">
        {title}
      </h3>
      <motion.ul
        className="flex flex-col gap-4"
        variants={staggerList}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {links.map((item, i) => (
          <motion.li key={i} variants={listItem}>
            <Link href={item.href}>
              <motion.span
                className={`inline-block ${fontClass} font-medium text-[14px] leading-[24px] text-[#2C2C2C]`}
                whileHover={{ x: 5, color: "#000" }}
                transition={{ duration: 0.18 }}
              >
                {item.label}
              </motion.span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

export default function Footer() {
  const [email,    setEmail]    = useState("");
  const [langOpen, setLangOpen] = useState(false);

  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();

  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const switchLocale = (next: string) => {
    const segs = pathname.split("/");
    segs[1] = next;
    router.push(segs.join("/"));
    setLangOpen(false);
  };

  const currentLang = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  return (
    <footer ref={ref} className="bg-[#F6F6F6] w-full mt-auto overflow-hidden">

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-[1920px] mx-auto px-8 sm:px-16 xl:px-[120px] pt-[100px] lg:pt-[143px] pb-16">

        {/* Row 1: logo + contact | nav columns */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">

          {/* Left: logo · contact · certs */}
          <motion.div
            className="flex flex-col min-w-[280px]"
            variants={fadeUp(0)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Image src="/logo.svg" alt="AIM Digital Press" width={170} height={68} priority />
            </motion.div>

            <div className="flex flex-col mt-8">
              <motion.a
                href="tel:+"
                className="font-inter font-medium text-[22px] leading-[45px] underline text-black"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Leave your number and we'll call back
              </motion.a>
              <motion.a
                href="mailto:kontakt@totem.com.pl"
                className="font-inter font-medium text-[22px] leading-[45px] underline text-black"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                kontakt@totem.com.pl
              </motion.a>
            </div>

            {/* Certificates */}
            <div className="mt-6">
              <p className="font-inter font-medium text-[12px] leading-[24px] text-[#2C2C2C] mb-3">
                Certificates
              </p>
              <div className="flex items-center gap-4">
                {[
                  { w: "w-[91px]", h: "h-[68px]", label: "CERTIFIED" },
                  { w: "w-[114px]", h: "h-[45px]", label: "ISO 9001:2015" },
                ].map((cert) => (
                  <motion.div
                    key={cert.label}
                    className={`${cert.w} ${cert.h} bg-[#e0e0e0] rounded-lg flex items-center justify-center cursor-default`}
                    whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(0,0,0,0.12)" }}
                    transition={{ duration: 0.22 }}
                  >
                    <span className="text-[10px] text-[#555] font-medium text-center leading-tight px-2">
                      {cert.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: nav columns */}
          <div className="flex flex-wrap gap-12 lg:gap-20 xl:gap-28">
            <NavColumn title="Quick Links" links={quickLinks}  fontClass="font-inter"         delay={0.10} inView={inView} />
            <NavColumn title="For you"    links={forYouLinks} fontClass="font-inter"         delay={0.16} inView={inView} />
            <NavColumn title="Help"       links={helpLinks}   fontClass="font-plus-jakarta" delay={0.22} inView={inView} />
          </div>
        </div>

        {/* Row 2: Newsletter ─────────────────────────────────────────────── */}
        <motion.div
          className="mt-[100px] lg:mt-[120px] rounded-2xl px-8 lg:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden"
          style={{ background: "linear-gradient(90deg, #F8E586 47.02%, #EE8461 100%)" }}
          variants={fadeUp(0.28)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)",
            }}
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
          />

          <div className="relative z-10">
            <h3 className="font-inter font-medium text-[22px] leading-[49px] text-black">
              Sign up for our newsletter
            </h3>
            <p className="font-inter font-medium text-[15px] text-black -mt-2">
              Stay up-to-date with our offerings, tips and news!
            </p>
            <p className="font-inter font-normal text-[10px] text-black mt-1">
              By signing up you accept our{" "}
              <Link href="/privacy" className="underline hover:opacity-70 transition-opacity">
                Privacy policy
              </Link>.
            </p>
          </div>

          {/* Email input */}
          <motion.div
            className="flex items-center bg-white rounded-full w-full sm:w-[368px] h-[60px] px-5 gap-2 shrink-0 relative z-10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent outline-none font-inter text-[14px] text-gray-600 placeholder:text-gray-400 min-w-0"
            />
            <motion.button
              aria-label="Subscribe"
              className="w-10 h-10 shrink-0 rounded-full border-[1.5px] border-[#3F6EE8] flex items-center justify-center text-[#3F6EE8] bg-transparent"
              whileHover={{ backgroundColor: "#3F6EE8", color: "#fff", scale: 1.1, borderColor: "#3F6EE8" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Row 3: Social icons ────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-10 sm:gap-12 mt-14"
          variants={staggerList}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {[
            {
              label: "Facebook",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              ),
            },
            {
              label: "Instagram",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
              ),
            },
            {
              label: "YouTube",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              ),
            },
            {
              label: "LinkedIn",
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              ),
            },
          ].map((social) => (
            <motion.a
              key={social.label}
              href="#"
              aria-label={social.label}
              className="text-black"
              variants={listItem}
              whileHover={{ scale: 1.25, y: -5 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <motion.div
        className="border-t border-[#B7B7B7]"
        variants={fadeUp(0.35)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className="max-w-[1920px] mx-auto px-8 sm:px-16 xl:px-[207px] py-5 flex items-center justify-between gap-4 flex-wrap">

          <motion.a
            href="/privacy"
            className="font-montserrat font-semibold text-[18px] leading-[24px] underline text-[#707070]"
            whileHover={{ color: "#333" }}
            transition={{ duration: 0.18 }}
          >
            Privacy policy
          </motion.a>

          {/* Language switcher */}
          <div
            className="relative"
            onMouseLeave={() => setLangOpen(false)}
          >
            <motion.button
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setLangOpen(v => !v)}
              onMouseEnter={() => setLangOpen(true)}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.18 }}
              aria-label="Switch language"
            >
              {/* Globe icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#919191" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>

              <span className="font-montserrat font-semibold text-[15px] leading-[24px] text-[#707070] group-hover:text-[#444] transition-colors">
                {currentLang.label}
              </span>

              <motion.svg
                width="10" height="6" viewBox="0 0 10 6" fill="none"
                animate={{ rotate: langOpen ? 180 : 0 }}
                transition={{ duration: 0.22 }}
              >
                <path d="M1 1L5 5L9 1" stroke="#919191" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.button>

            {/* Locale dropdown */}
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  key="lang-footer"
                  variants={dropdownAnim}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 min-w-[150px]"
                >
                  {LOCALES.map((l, i) => (
                    <motion.button
                      key={l.code}
                      onClick={() => switchLocale(l.code)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${
                        locale === l.code ? "font-semibold text-black bg-gray-50" : "text-gray-600"
                      }`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ x: 3 }}
                    >
                      <span className="text-[18px]">{l.flag}</span>
                      <span>{l.label}</span>
                      {locale === l.code && (
                        <motion.span
                          className="ml-auto text-black"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="font-montserrat font-semibold text-[18px] leading-[24px] underline text-[#707070]">
            AIM © 2026. All rights reserved.
          </span>
        </div>
      </motion.div>
    </footer>
  );
}
