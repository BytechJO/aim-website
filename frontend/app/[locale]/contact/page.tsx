"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { ENDPOINTS } from "@/app/api/endpoints";
import { useToast } from "@/app/shared/ToastProvider";

export default function ContactPage() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [focused, setFocused] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errors: Record<string, boolean> = {};

    if (!form.name.trim()) errors.name = true;
    if (!form.email.trim()) errors.email = true;
    if (!form.phone.trim()) errors.phone = true;
    if (!form.message.trim()) errors.message = true;

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      showToast(
        isArabic
          ? "يرجى تعبئة جميع الحقول"
          : "Please fill in all required fields",
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
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          inquiry_type: "message",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      showToast(
        isArabic ? "تم إرسال الرسالة بنجاح" : "Message sent successfully",
        "ok",
      );

      setFieldErrors({});

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
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

  const inputClass = (field: string) => {
    const hasError = fieldErrors[field];
    const isFocused = focused === field;

    return `w-full rounded-2xl border bg-white px-5 py-4 text-sm text-[#202543] placeholder:text-black/35 outline-none transition-all duration-200 ${
      hasError
        ? "border-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
        : isFocused
          ? "border-[#202543] shadow-[0_0_0_3px_rgba(32,37,67,0.08)]"
          : "border-[#D7D9DF] hover:border-black/20"
    }`;
  };

  return (
    <section>
      <div className="max-w-[85%] mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-1 md:gap-12 items-center">
          <div className="relative h-75 md:h-150">
            <Image
              src="/homeImg/contact.png"
              alt="Contact card"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
              className="w-full max-w-xl mx-auto"
            >
              <h2
                className={`${
                  locale === "en" ? "font-adamina" : "font-cairo"
                } text-4xl lg:text-[30px] font-light text-[#202543] mb-8`}
              >
                {isArabic ? "تواصل معنا" : "Contact Us"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder={isArabic ? "الاسم الكامل" : "Full Name"}
                    className={inputClass("name")}
                  />
                  {fieldErrors.name && <ErrorIcon />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder={
                        isArabic ? "البريد الإلكتروني" : "Email Address"
                      }
                      className={inputClass("email")}
                    />
                    {fieldErrors.email && <ErrorIcon />}
                  </div>

                  <div className="relative">
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      placeholder={isArabic ? "رقم الهاتف" : "Phone Number"}
                      className={inputClass("phone")}
                    />
                    {fieldErrors.phone && <ErrorIcon />}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    placeholder={
                      isArabic
                        ? "اكتب رسالتك هنا..."
                        : "Write your message here..."
                    }
                    className={`${inputClass("message")} resize-none`}
                  />
                  {fieldErrors.message && <ErrorIconTextarea />}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-4 rounded-2xl bg-black text-white text-sm font-medium hover:bg-[#2d3358] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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

                      {isArabic ? "جاري الإرسال..." : "Sending..."}
                    </span>
                  ) : isArabic ? (
                    "إرسال الرسالة"
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ErrorIcon = () => (
  <motion.span
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none"
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

const ErrorIconTextarea = () => (
  <motion.span
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute right-4 top-4 text-red-400 pointer-events-none"
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
