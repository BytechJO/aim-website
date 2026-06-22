"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

type Step = "topic" | "email" | "message";

export default function AskQuestionModal({ open, onClose }: Props) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("topic");
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep("topic");
      setSelectedTopic("");
      setEmail("");
      setName("");
      setMessage("");
      setShake(false);
    }
  }, [open]);

  const topics = isArabic
    ? [
        "أعمل مع دار نشر ونبحث عن مطبعة للتعاون",
        "أنا ناشر ذاتي وأحتاج عرض سعر",
        "أحتاج بعض النصائح",
        "أخرى",
      ]
    : [
        "I work for a publisher and we are looking for a printer to cooperation",
        "I am a self-publisher and I need a quotation",
        "I need some advice",
        "Other",
      ];

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleNextFromTopic = (topic: string) => {
    setSelectedTopic(topic);
    setStep("email");
  };

  const handleEmailNext = () => {
    if (!email.trim() || !name.trim()) {
      triggerShake();
      showToast(
        isArabic
          ? "يرجى إدخال الاسم والبريد الإلكتروني"
          : "Please enter your name and email",
        "err",
      );
      return;
    }

    setStep("message");
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      triggerShake();
      showToast(
        isArabic ? "يرجى كتابة الرسالة" : "Please type your message",
        "err",
      );
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
          name,
          email,
          phone: "",
          inquiry_type: "question",
          message: `Topic: ${selectedTopic}\n\nMessage: ${message}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send");
      }

      showToast(
        isArabic ? "تم إرسال الرسالة بنجاح" : "Message sent successfully",
        "ok",
      );

      onClose();
    } catch {
      showToast(
        isArabic
          ? "حدث خطأ أثناء إرسال الرسالة"
          : "Something went wrong while sending the message",
        "err",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "message") {
      setStep("email");
      return;
    }

    if (step === "email") {
      setStep("topic");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-9999 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            dir={isArabic ? "rtl" : "ltr"}
            initial={{ x: isArabic ? "100%" : "-100%" }}
            animate={
              shake
                ? {
                    x: 0,
                    translateX: [0, -8, 8, -6, 6, -3, 3, 0],
                  }
                : { x: 0 }
            }
            exit={{ x: isArabic ? "100%" : "-100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`fixed top-0 h-full w-full max-w-135 bg-white px-6 sm:px-16 py-12 shadow-2xl ${
              isArabic ? "right-0" : "left-0"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`absolute top-8 flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-black hover:bg-black/10 cursor-pointer ${
                isArabic ? "left-10" : "right-10"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>

            <div className="flex h-full flex-col">
              <div className="pt-10">
                {step === "topic" && (
                  <>
                    <h2 className="max-w-95 text-[34px] sm:text-[36px] leading-tight font-semibold text-black">
                      {isArabic
                        ? "عن ماذا تريد أن تتحدث؟"
                        : "What would you like to talk about?"}
                    </h2>

                    <div className="mt-8 space-y-4">
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleNextFromTopic(topic)}
                          className="w-full rounded-xl border border-gray-200 bg-[#F8F8F8] px-4 py-4 text-start text-[15px] font-medium text-black transition hover:border-black/30 hover:bg-white cursor-pointer"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === "email" && (
                  <>
                    <h2 className="max-w-90 text-[34px] sm:text-[36px] leading-tight font-semibold text-black">
                      {isArabic
                        ? "أدخل اسمك وبريدك الإلكتروني"
                        : "Enter your name and e-mail address"}
                    </h2>

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isArabic ? "اسمك" : "Your name"}
                      className="mt-8 w-full max-w-85 rounded-xl bg-[#F5F5F5] px-4 py-4 text-[15px] outline-none placeholder:text-black/45 focus:ring-2 focus:ring-black/10"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEmailNext();
                      }}
                      placeholder={
                        isArabic ? "بريدك الإلكتروني" : "Your e-mail"
                      }
                      className="mt-3 w-full max-w-85 rounded-xl bg-[#F5F5F5] px-4 py-4 text-[15px] outline-none placeholder:text-black/45 focus:ring-2 focus:ring-black/10"
                    />

                    <button
                      type="button"
                      onClick={handleEmailNext}
                      className="mt-6 block w-full max-w-45 rounded-full bg-[#2F5FEA] py-4 text-white font-medium transition hover:bg-[#244fd0] cursor-pointer"
                    >
                      {isArabic ? "التالي" : "Next"}
                    </button>
                  </>
                )}

                {step === "message" && (
                  <>
                    <h2 className="max-w-90 text-[34px] sm:text-[36px] leading-tight font-semibold text-black">
                      {isArabic ? "اكتب رسالتك" : "Type your message"}
                    </h2>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={isArabic ? "الرسالة" : "Message"}
                      className="mt-8 h-46.25 w-full max-w-85 resize-none rounded-xl bg-[#F5F5F5] px-4 py-4 text-[15px] outline-none placeholder:text-black/45 focus:ring-2 focus:ring-black/10"
                    />

                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="mt-5 block w-full max-w-45 rounded-full bg-[#2F5FEA] py-4 text-white font-medium transition hover:bg-[#244fd0] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading
                        ? isArabic
                          ? "جاري الإرسال..."
                          : "Sending..."
                        : isArabic
                          ? "إرسال"
                          : "Send"}
                    </button>

                    <p className="mt-5 max-w-90 text-[12px] text-black">
                      {isArabic
                        ? "بإرسال الرسالة أنت توافق على سياسة الخصوصية."
                        : "By sending the message you accept our "}
                      {!isArabic && (
                        <a href="#" className="underline">
                          Privacy policy.
                        </a>
                      )}
                    </p>
                  </>
                )}
              </div>

              {(step === "email" || step === "message") && (
                <div className="mt-auto pb-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-black transition hover:bg-black/10 cursor-pointer"
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
                      className={isArabic ? "rotate-180" : ""}
                    >
                      <path d="M19 12H5" />
                      <path d="M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
