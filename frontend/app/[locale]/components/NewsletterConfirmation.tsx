"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ENDPOINTS } from "@/app/api/endpoints";

type Props = {
  open: boolean;
  email: string;
  locale: string;
  initialResendTimer: number;
  onClose: () => void;
  onConfirmed: () => void;
};

const RESEND_COOLDOWN = 60;

export default function NewsletterConfirmation({
  open,
  email,
  locale,
  initialResendTimer,
  onClose,
  onConfirmed,
}: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(initialResendTimer);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const isArabic = locale === "ar";

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode("");
      setError("");
      setInfo("");
      setConfirmed(false);
      setResendTimer(initialResendTimer);
    }
  }, [open, initialResendTimer]);

  useEffect(() => {
    if (!open || confirmed) return;
    if (resendTimer <= 0) return;

    const interval = window.setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [open, confirmed, resendTimer]);

  const handleConfirm = async () => {
    if (!code.trim()) {
      setError(
        isArabic ? "أدخل كود التأكيد" : "Please enter the confirmation code",
      );
      return;
    }

    if (code.trim().length < 6) {
      setError(
        isArabic ? "الكود يجب أن يكون 6 أرقام" : "Code must be 6 digits",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setInfo("");

      const res = await fetch(`${ENDPOINTS.NEWSLETTER}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: code.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid confirmation code");
      }

      setConfirmed(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isArabic
            ? "حدث خطأ أثناء التأكيد"
            : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      setResending(true);
      setError("");
      setInfo("");

      const res = await fetch(`${ENDPOINTS.NEWSLETTER}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (
          res.status === 429 &&
          data.error === "confirmation_code_recently_sent"
        ) {
          setResendTimer(data.remainingSeconds ?? RESEND_COOLDOWN);
          setInfo(
            isArabic
              ? "تم إرسال كود سابقًا، يمكنك استخدامه الآن"
              : "A code was already sent. You can use it now.",
          );
          return;
        }

        if (res.status === 409 || data.error === "already_subscribed") {
          setError(
            isArabic
              ? "أنت مشترك بالفعل في النشرة البريدية"
              : "You are already subscribed to our newsletter",
          );
          return;
        }

        throw new Error(data.error || "Failed to resend code");
      }

      setCode("");
      setResendTimer(data.remainingSeconds ?? RESEND_COOLDOWN);

      setInfo(
        isArabic
          ? "تم إرسال كود جديد إلى بريدك الإلكتروني"
          : "A new code has been sent to your email",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isArabic
            ? "حدث خطأ أثناء إعادة الإرسال"
            : "Something went wrong",
      );
    } finally {
      setResending(false);
    }
  };

  const handleDone = () => {
    onConfirmed();
  };

  const resendDisabled = loading || resending || resendTimer > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 backdrop-blur-sm px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={confirmed ? undefined : onClose}
        >
          <motion.div
            dir={isArabic ? "rtl" : "ltr"}
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!confirmed && (
              <button
                type="button"
                onClick={onClose}
                className={`absolute top-5 ${
                  isArabic ? "left-5" : "right-5"
                } w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-700 cursor-pointer`}
                aria-label="Close"
              >
                ×
              </button>
            )}

            {confirmed ? (
              <div className="text-center pt-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex justify-center mb-6"
                >
                  <Image
                    src="/logo.svg"
                    alt="AIM Digital Press"
                    width={160}
                    height={64}
                    priority
                  />
                </motion.div>

                <h3 className="font-inter text-[26px] leading-8 font-semibold text-black">
                  {isArabic ? "تم تأكيد الاشتراك" : "Subscription confirmed"}
                </h3>

                <p className="font-inter text-[14px] leading-6 text-[#707070] mt-4">
                  {isArabic
                    ? "شكرًا لاشتراكك. ستصلك آخر أخبارنا وتحديثاتنا على بريدك الإلكتروني."
                    : "Thank you for subscribing. You will now receive our latest news and updates by email."}
                </p>

                <button
                  type="button"
                  onClick={handleDone}
                  className="mt-7 w-full h-14 rounded-full bg-black text-white font-inter font-semibold text-[14px] cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {isArabic ? "تم" : "Done"}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="mb-5">
                    <Image
                      src="/logo.svg"
                      alt="AIM Digital Press"
                      width={150}
                      height={60}
                      priority
                    />
                  </div>

                  <h3 className="font-inter text-[26px] leading-8 font-semibold text-black">
                    {isArabic ? "تأكيد الاشتراك" : "Confirm subscription"}
                  </h3>

                  <p className="font-inter text-[14px] leading-6 text-[#707070] mt-3">
                    {isArabic
                      ? "أرسلنا كود تأكيد إلى البريد التالي:"
                      : "We sent a confirmation code to:"}
                  </p>

                  <p className="font-inter text-[14px] font-semibold text-black mt-1 break-all">
                    {email}
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setError("");
                      setInfo("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleConfirm();
                      }
                    }}
                    placeholder={isArabic ? "أدخل الكود" : "Enter code"}
                    maxLength={6}
                    className="w-full h-14 rounded-full border border-gray-200 px-6 text-center text-[22px] tracking-[8px] font-semibold outline-none focus:border-black transition-colors"
                  />

                  {error && (
                    <p className="text-red-500 text-[13px] leading-5 text-center">
                      {error}
                    </p>
                  )}

                  {info && (
                    <p className="text-green-600 text-[13px] leading-5 text-center">
                      {info}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading || resending}
                    className="w-full h-14 rounded-full bg-black text-white font-inter font-semibold text-[14px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isArabic ? (
                      "تأكيد"
                    ) : (
                      "Confirm"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendDisabled}
                    className="w-full text-center font-inter text-[13px] text-[#707070] underline hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {resending
                      ? isArabic
                        ? "جاري الإرسال..."
                        : "Resending..."
                      : resendTimer > 0
                        ? isArabic
                          ? `إعادة الإرسال خلال ${resendTimer} ثانية`
                          : `Resend in ${resendTimer}s`
                        : isArabic
                          ? "إعادة إرسال الكود"
                          : "Resend code"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
