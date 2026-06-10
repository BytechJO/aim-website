"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINTS } from "@/app/api/endpoints";

// ─── Route data ──────────────────────────────────────────────────────────────

const CATEGORY_KEYS = [
  { key: "binding", href: "/services" },
  { key: "enhancement", href: "/enhancement" },
  { key: "coverExtras", href: "/cover-extras" },
  { key: "reprints", href: "/reprints-and-facsimiles" },
  { key: "greenBook", href: "/green-book" },
] as const;

const LOCALES = ["en", "ar"] as const;

// ─── Animations ──────────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const megaMenuAnim = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

const dropdownAnim = {
  hidden: { opacity: 0, y: -6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.16, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.12, ease: "easeIn" as const },
  },
};

const searchAnim = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE } },
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.16, ease: "easeIn" as const },
  },
};

const mobileAnim = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.26, ease: EASE },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.18, ease: "easeIn" as const },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.04 } },
};
const rowItem = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.18 } },
};

// ─── Micro-components ────────────────────────────────────────────────────────

/** Animated chevron — M3 / #1D1B20 */
function Chevron({ open, size = 12 }: { open: boolean; size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 12 7"
      fill="none"
      className="shrink-0"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
    >
      <path
        d="M1 1L6 6L11 1"
        stroke="#1D1B20"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/** Sliding-underline top-bar link */
function TopLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      className={`relative flex items-center px-5 h-19.25 text-[15px] font-semibold transition-colors ${
        active ? "text-black" : "text-[#222222] hover:text-black"
      }`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
      <motion.span
        className="absolute bottom-4 left-5 right-5 h-[1.5px] bg-black origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active || hov ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </Link>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function NavBar() {
  const t = useTranslations("nav");

  const [searchOpen, setSearchOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(ENDPOINTS.PRODUCTS);
      const data = await res.json();

      setProducts(data);
    };

    fetchProducts();
  }, []);
  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServices = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 80);
  };

  const categories = CATEGORY_KEYS.map((c) => ({
    label: t(`categories.${c.key}`),
    href: c.href,
  }));
  const menuProducts = products.map((p) => ({
    hl: locale === "ar" ? p.title_ar : p.title_en,
    basic: locale === "ar" ? p.subtitle_ar : p.subtitle_en,
    href: `/services/${p.slug}`,
    image: p.image_url,
  }));
  const lp = (path: string) => `/${locale}${path}`;
  const switchLocale = (next: string) => {
    const segs = pathname.split("/");
    segs[1] = next;
    router.push(segs.join("/"));
    setLangOpen(false);
  };

  useEffect(() => {
    setServicesOpen(false);
    setLangOpen(false);
    setMenuOpen(false);
  }, [pathname]);
  const isServicesActive =
    CATEGORY_KEYS.some((item) => pathname === lp(item.href)) ||
    pathname.startsWith(`/${locale}/services/`);
  const activeCategory = CATEGORY_KEYS.find(
    (item) => pathname === lp(item.href),
  )?.key;
  return (
    <header className="fixed w-full bg-white z-50 border-b border-gray-100">
      <div className="w-full mx-auto lg:max-w-[95%]">
        {/* ── Search overlay ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="search"
              variants={searchAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-x-0 top-0 z-50 bg-white shadow-xl border-b border-gray-100 py-5 px-6"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-inter font-semibold text-[15px]">
                    {t("searchEngine")}
                  </span>
                  <motion.button
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close"
                    className="text-gray-500 hover:text-black"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path
                        d="M2 2L16 16M16 2L2 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.button>
                </div>
                <form
                  role="search"
                  className="flex border border-gray-300 rounded overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="flex-1 px-4 py-3 text-[15px] font-inter outline-none"
                    autoFocus
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    className="px-4 bg-gray-50 hover:bg-gray-100 border-l border-gray-300 transition-colors"
                  >
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <circle
                        cx="7"
                        cy="7"
                        r="4.5"
                        stroke="#1E1E1E"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M11 11L15 15"
                        stroke="#1E1E1E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main bar — h-[77px] ────────────────────────────────────────── */}
        <div className="flex items-center h-19.25 w-full pr-0">
          {/* Hamburger */}

          {/* Logo */}
          <div className="shrink-0 px-4 lg:px-8">
            <Link href={lp("")} title="AIM Digital Press">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="/logo.svg"
                  alt="AIM Digital Press"
                  width={80}
                  height={47}
                  priority
                />
              </motion.div>
            </Link>
          </div>

          {/* ── Desktop nav ───────────────────────────────────────────────── */}
          <nav className="hidden lg:flex flex-1 items-center h-full">
            <ul className="flex items-center h-full">
              {/* Our Services — megamenu trigger */}
              <li
                className="h-full flex items-center"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
              >
                <motion.button
                  className={`relative flex items-center gap-1.5 px-5 h-full text-[15px] font-semibold transition-colors ${
                    isServicesActive
                      ? "text-black"
                      : "text-[#222222] hover:text-black"
                  }`}
                  onClick={() => setServicesOpen((v) => !v)}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("ourServices")}
                  <Chevron open={servicesOpen} />

                  <motion.span
                    className="absolute bottom-4 left-5 right-5 h-[1.5px] bg-black origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isServicesActive ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              </li>

              <li className="h-full">
                <TopLink
                  href={lp("/self-publishing")}
                  active={pathname === lp("/self-publishing")}
                >
                  {t("selfPublishing")}
                </TopLink>
              </li>
              <li className="h-full">
                <TopLink href={lp("/about")} active={pathname === lp("/about")}>
                  {t("aboutUs")}
                </TopLink>
              </li>
              <li className="h-full">
                <TopLink
                  href={lp("/contact")}
                  active={pathname === lp("/contact")}
                >
                  {t("contactUs")}
                </TopLink>
              </li>
            </ul>
          </nav>

          {/* ── Mobile menu ───────────────────────────────────────────────── */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="mobile"
                variants={mobileAnim}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="lg:hidden absolute left-0 right-0 top-19.25 bg-white border-t border-gray-100 shadow-lg z-40 overflow-hidden"
              >
                <ul className="flex flex-col divide-y divide-gray-50">
                  <li className="px-6 py-4">
                    <p className="mb-2 font-semibold text-[#222222]">
                      {t("Language")}
                    </p>

                    <div className="flex gap-3">
                      {LOCALES.map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            switchLocale(l);
                            setMenuOpen(false);
                          }}
                          className={`px-3 py-1 rounded ${
                            locale === l
                              ? "bg-black text-white"
                              : "bg-gray-100 text-black"
                          }`}
                        >
                          {l.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </li>
                  {[
                    { label: t("ourServices"), href: "/services" },
                    { label: t("selfPublishing"), href: "/self-publishing" },
                    { label: t("aboutUs"), href: "/about" },
                    { label: t("contactUs"), href: "/contact" },
                  ].map((it, i) => (
                    <motion.li
                      key={it.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={lp(it.href)}
                        className="block px-6 py-4 text-[15px] font-semibold text-[#222222] hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        {it.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Tools ─────────────────────────────────────────────────────── */}
          <div className="ms-auto flex items-center gap-4 pr-4">
            {/* Let's talk — w-[136px] h-[44px] Montserrat 600 21px */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden lg:block"
            >
              <Link
                href={lp("/contact")}
                className="inline-flex items-center justify-center w-34 h-11 bg-[#0F0F0F] text-white rounded-full font-montserrat font-semibold text-[16px] leading-6 hover:bg-[#2a2a2a] transition-colors whitespace-nowrap"
              >
                {t("letsTalk")}
              </Link>
            </motion.div>

            {/* Search — 17×17px, 2.5px stroke #1E1E1E */}
            <motion.button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="flex items-center justify-center w-8 h-8"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image src="/search.svg" alt="Search" width={17} height={17} />
            </motion.button>

            {/* Language — EN + chevron, Inter 600 15px #222222 */}
            <div
              className="relative hidden lg:block"
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                className="flex items-center gap-1 font-inter font-semibold text-[15px] text-[#222222] hover:text-black transition-colors"
                onClick={() => setLangOpen((v) => !v)}
              >
                {locale.toUpperCase()}
                <Chevron open={langOpen} size={12} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    key="lang"
                    variants={dropdownAnim}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 top-full mt-1 bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden z-50 min-w-18"
                  >
                    {LOCALES.map((l, i) => (
                      <motion.button
                        key={l}
                        onClick={() => switchLocale(l)}
                        className={`block w-full px-4 py-2.5 text-left font-inter text-[14px] transition-colors hover:bg-gray-50 ${locale === l ? "font-semibold text-black" : "text-gray-700"}`}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ x: 2 }}
                      >
                        {l.toUpperCase()}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cover generator tab — w-[81px] h-[77px] #F2F2F2 rounded-br-[20px] */}
            <Link
              href={lp("/cover-generator")}
              className="hidden lg:flex flex-col items-center justify-center w-20.25 
            h-19.25 bg-[#F2F2F2] rounded-br-[20px] gap-1 hover:bg-[#e8e8e8] transition-colors self-stretch shrink-0"
            >
              {/* Vector icon: 21.67×21.67 border 0.75px #000 */}
              <Image
                src="/coverGenerator.svg"
                alt="coverGenerator Press"
                width={24}
                height={24}
                priority
              />
              {/* Text: 55px wide, Inter 300 12px/16px #0A0A0A */}
              <span className="w-13.75 font-inter font-light text-[12px] leading-4 text-center text-[#0A0A0A]">
                {t("coverGenerator")}
              </span>
            </Link>
            <Link
              href={lp("/cover-generator")}
              className="lg:hidden flex items-center justify-center w-8 h-8"
            >
              <Image
                src="/coverGenerator.svg"
                alt="Cover Generator"
                width={20}
                height={20}
              />
            </Link>
            <div className="lg:hidden px-4">
              <motion.button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen ? (
                    <motion.svg
                      key="x"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        d="M2 2L20 20M20 2L2 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="m"
                      width="22"
                      height="18"
                      viewBox="0 0 22 18"
                      fill="none"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        d="M1 1H21M1 9H21M1 17H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ══ Mega-menu (Frame 886) ════════════════════════════════════════ */}
        <AnimatePresence>
          {servicesOpen && (
            <motion.div
              key="megamenu"
              variants={megaMenuAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute left-0 right-0 top-full z-50 bg-white "
              onMouseEnter={openServices}
              onMouseLeave={closeServices}
            >
              {/* ── Main content area ─────────────────────────────────────── */}
              <div
                className="flex w-full mx-auto md:max-w-[95%]"
                style={{ minHeight: 440 }}
              >
                {/* Explore sidebar — 277px, bg #F6F6F6, Rectangle 39444 */}
                <div className="w-69.25 shrink-0 bg-[#F6F6F6] px-8 py-8">
                  <motion.p
                    className="font-inter font-medium text-[24px] leading-8 text-black mb-6"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("explore")}
                  </motion.p>
                  <ul className="flex flex-col gap-1">
                    {categories.map((c, i) => (
                      <motion.li
                        key={c.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.18 }}
                      >
                        <Link
                          href={lp(c.href)}
                          className={`block py-1.5 font-inter font-medium text-[13px] leading-8 transition-all ${
                            activeCategory === CATEGORY_KEYS[i].key
                              ? "text-[#D42A26]"
                              : "text-black hover:opacity-60"
                          }`}
                          onClick={() => setServicesOpen(false)}
                        >
                          {c.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Products grid — flexible, thumbnails 40×40px */}
                <div className="flex-1 px-8 py-8">
                  <motion.p
                    className="font-inter font-medium text-[15px] leading-8 text-[#3A3A3A] mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("ourProducts")}
                  </motion.p>
                  <motion.ul
                    className="grid grid-cols-3 gap-x-6 gap-y-1"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                  >
                    {menuProducts.map((p) => (
                      <motion.li key={p.href} variants={rowItem}>
                        <Link
                          href={lp(p.href)}
                          className="flex items-center gap-3 py-1.5 group"
                          onClick={() => setServicesOpen(false)}
                        >
                          {/* 40×40 thumbnail */}
                          <motion.div
                            className="w-10 h-10 shrink-0 rounded-sm overflow-hidden"
                            whileHover={{ scale: 1.08 }}
                          >
                            <Image
                              src={p.image}
                              alt={p.hl}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <span className="min-w-0 leading-none">
                            <span className="block font-inter font-medium text-[15px] leading-8 text-[#3A3A3A] group-hover:underline underline-offset-2 truncate">
                              {p.hl}
                            </span>
                            {p.basic && (
                              <span className="block font-inter font-medium text-[13px] leading-8 text-black -mt-1 truncate">
                                {p.basic}
                              </span>
                            )}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* "Have a questions?" tile — 288px, border-radius 10px */}
                <div className="w-[288px] shrink-0 relative overflow-hidden rounded-[10px] m-4 ">
                  {/* Placeholder for businesspeople-meeting-office-working.jpg */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "url('/businesspeople.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  {/* Light overlay to allow dark text */}
                  <motion.div
                    className="absolute inset-0 "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Charm 400 32px / 42px — color #000 */}
                    <motion.p
                      className="text-[32px] leading-10.5 text-black font-normal"
                      style={{ fontFamily: "var(--font-charm), cursive" }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08, duration: 0.25 }}
                    >
                      {t("haveQuestions")}
                      <br />
                      {t("getAnswers")}
                    </motion.p>

                    {/* Orange pill button — w-[43px] h-[23px] #FF823C border-radius 36px */}
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.16, duration: 0.2 }}
                    >
                      <Link
                        href={lp("/faq")}
                        className="inline-flex items-center justify-center rounded-[36px] bg-[#FF823C] hover:bg-orange-600 transition-colors"
                        style={{ width: 43, height: 23 }}
                        onClick={() => setServicesOpen(false)}
                        aria-label="Go to FAQ"
                      >
                        <svg
                          width="13"
                          height="9"
                          viewBox="0 0 13 9"
                          fill="none"
                          className="rtl:rotate-180"
                        >
                          <path
                            d="M1 4.5H12M12 4.5L8.5 1M12 4.5L8.5 8"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* ── Frame 878 — bottom gradient strip ─────────────────────── */}
              {/* background: linear-gradient(90deg, #202020 0%, #FFFFFF 51.44%, #202020 100%) */}
              <motion.div
                className="h-11 relative"
                style={{
                  background:
                    "linear-gradient(90deg, #202020 0%, #FFFFFF 51.44%, #202020 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.2 }}
              >
                {/* Left: phone icon + "Call me back" — Inter 400 20px #FFFFFF */}
                <div
                  className="absolute inset-y-0 flex items-center gap-3"
                  style={{ left: "17%" }}
                >
                  {/* Phone/chat icon — 29×25px */}
                  <svg
                    width="29"
                    height="25"
                    viewBox="0 0 29 25"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect width="29" height="25" rx="4" fill="#D42A26" />
                    <path
                      d="M8 8h13M8 12.5h8M8 17h5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19.5 16l3 3"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <Link
                    href={lp("/contact")}
                    className="font-inter font-normal text-[20px] leading-6 text-white hover:underline whitespace-nowrap"
                    onClick={() => setServicesOpen(false)}
                  >
                    {t("callMeBack")}
                  </Link>
                </div>

                {/* Right: "Cover generator" — Inter 300 20px underline #FFFFFF */}
                <div
                  className="absolute inset-y-0 flex items-center gap-3"
                  style={{ left: "78%" }}
                >
                  <Link
                    href={lp("/cover-generator")}
                    className="font-inter font-light text-[20px] leading-4 underline text-white hover:opacity-80 whitespace-nowrap"
                    onClick={() => setServicesOpen(false)}
                  >
                    {t("coverGenerator")}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
