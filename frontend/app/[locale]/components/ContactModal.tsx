"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ENDPOINTS } from "@/app/api/endpoints";
import Image from "next/image";
import { useToast } from "@/app/shared/ToastProvider";

type Props = {
  open: boolean;
  type: "message" | "callback";
  onClose: () => void;
};

export default function ContactModal({ open, type, onClose }: Props) {
  const t = useTranslations("ContactModal");
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { showToast } = useToast();

  const [tab, setTab] = useState<"message" | "callback">(type);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTab(type);
      setErrors({});
      setShake(false);
    }
  }, [type, open]);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};

    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim()) newErrors.email = true;
    if (!form.phone.trim()) newErrors.phone = true;
    if (tab === "message" && !form.message.trim()) {
      newErrors.message = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(ENDPOINTS.CONTACT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          inquiry_type: tab === "callback" ? "callback" : "message",
          message: tab === "callback" ? "Callback request" : form.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      showToast(
        tab === "callback" ? t("successCallback") : t("successMessage"),
        "ok",
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setErrors({});
      onClose();
    } catch (err) {
      console.error(err);

      showToast(
        tab === "callback" ? t("failCallback") : t("failMessage"),
        "err",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) => {
    const hasError = errors[field];
    const isFocused = focused === field;

    return `w-full rounded-2xl border bg-white px-5 py-4 text-sm text-[#202543] placeholder:text-black/35 outline-none transition-all duration-200 ${
      hasError
        ? "border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
        : isFocused
          ? "border-[#202543] shadow-[0_0_0_3px_rgba(32,37,67,0.08)]"
          : "border-[#D7D9DF] hover:border-black/20"
    }`;
  };

  const modalOverlayClass =
    "fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={modalOverlayClass}
          onClick={onClose}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={
              shake
                ? {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: [0, -8, 8, -6, 6, -3, 3, 0],
                  }
                : { opacity: 1, scale: 1, y: 0, x: 0 }
            }
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{
              duration: shake ? 0.5 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-130 overflow-hidden rounded-4xl bg-white shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)]"
          >
            <div className="relative px-8 pt-8 pb-0">
              <button
                type="button"
                onClick={onClose}
                className={`absolute top-5 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/50 transition hover:bg-black/10 hover:text-black cursor-pointer ${
                  isArabic ? "left-5" : "right-5"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>

              <div className="flex items-center mb-6">
                <Image
                  src="/logo.svg"
                  alt="Brand Logo"
                  width={160}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </div>

              <div className="flex gap-1 rounded-2xl bg-[#F4F5F7] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab("callback");
                    setErrors({});
                  }}
                  className={`flex-1 rounded-xl py-3 text-[13px] font-medium transition-all duration-250 cursor-pointer ${
                    tab === "callback"
                      ? "bg-white text-[#202543] shadow-sm"
                      : "text-black/45 hover:text-black/60"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {t("callMeBack")}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTab("message");
                    setErrors({});
                  }}
                  className={`flex-1 rounded-xl py-3 text-[13px] font-medium transition-all duration-250 cursor-pointer ${
                    tab === "message"
                      ? "bg-white text-[#202543] shadow-sm"
                      : "text-black/45 hover:text-black/60"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    {t("leaveMessage")}
                  </span>
                </button>
              </div>
            </div>

            <div className="px-8 pb-8 pt-6">
              <h2
                className={`${
                  isArabic ? "font-noto-arabic" : "font-adamina"
                } text-[28px] leading-tight text-[#202543]`}
              >
                {tab === "callback" ? t("requestCall") : t("getInTouch")}
              </h2>

              <p className="mt-2 text-[14px] leading-relaxed text-black/50">
                {tab === "callback" ? t("callbackDesc") : t("messageDesc")}
              </p>

              <div className="mt-6 space-y-3">
                <div className="relative">
                  <input
                    placeholder={t("name")}
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      clearError("name");
                    }}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    className={inputClass("name")}
                  />

                  {errors.name && <ErrorIcon isArabic={isArabic} />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      placeholder={t("email")}
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        clearError("email");
                      }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      className={inputClass("email")}
                    />

                    {errors.email && <ErrorIcon isArabic={isArabic} />}
                  </div>

                  <div className="relative">
                    <input
                      placeholder={t("phone")}
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        clearError("phone");
                      }}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      className={inputClass("phone")}
                    />

                    {errors.phone && <ErrorIcon isArabic={isArabic} />}
                  </div>
                </div>

                <div className="min-h-35">
                  {tab === "message" && (
                    <div className="relative">
                      <motion.textarea
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        rows={5}
                        placeholder={t("message")}
                        value={form.message}
                        onChange={(e) => {
                          setForm({ ...form, message: e.target.value });
                          clearError("message");
                        }}
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        className={`${inputClass("message")} resize-none h-35`}
                      />

                      {errors.message && (
                        <ErrorIconTextarea isArabic={isArabic} />
                      )}
                    </div>
                  )}

                  {tab === "callback" && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="h-35 rounded-2xl border border-[#D7D9DF] bg-[#FAFBFC] p-5 flex flex-col justify-center"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#202543]/5">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#202543"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>

                        <div>
                          <p className="text-[13px] font-medium text-[#202543]">
                            {t("quickCallback")}
                          </p>
                          <p className="text-[12px] text-black/40">
                            {t("usually")}
                          </p>
                        </div>
                      </div>

                      <p className="text-[12px] text-black/40 leading-relaxed">
                        {t("callbackInfo")}
                      </p>
                    </motion.div>
                  )}
                </div>

                {Object.keys(errors).length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[12px] text-red-400 flex items-center gap-1.5"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {t("required")}
                  </motion.p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-black py-4 text-[14px] font-medium text-white transition-all duration-200 hover:bg-[#2d3358] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-75"
                      />
                    </svg>
                    {t("sending")}
                  </span>
                ) : tab === "callback" ? (
                  t("requestCallback")
                ) : (
                  t("sendMessage")
                )}
              </button>

              <p className="mt-4 text-center text-[11px] text-black/30">
                {t("privacy")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const ErrorIcon = ({ isArabic }: { isArabic: boolean }) => (
  <motion.span
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    className={`absolute top-1/2 -translate-y-1/2 text-red-400 pointer-events-none ${
      isArabic ? "left-4" : "right-4"
    }`}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  </motion.span>
);

const ErrorIconTextarea = ({ isArabic }: { isArabic: boolean }) => (
  <motion.span
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    className={`absolute top-4 text-red-400 pointer-events-none ${
      isArabic ? "left-4" : "right-4"
    }`}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  </motion.span>
);
