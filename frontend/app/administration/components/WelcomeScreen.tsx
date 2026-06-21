"use client";

import { useEffect, useState } from "react";
import "../admin.css";

interface WelcomeOverlayProps {
  name?: string;
  loading: boolean;
  onFinish?: () => void;
}

export default function WelcomeScreen({
  name = "Admin",
  loading,
  onFinish,
}: WelcomeOverlayProps) {
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (loading) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExit(true);

    const timer = setTimeout(() => {
      onFinish?.();
    }, 600);

    return () => clearTimeout(timer);
  }, [loading, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0A0A0A] transition-all duration-500 ${
        exit ? "scale-95 opacity-0" : "opacity-100"
      }`}
    >
      <div className="mb-10 animate-[floatY_2.8s_ease-in-out_infinite]">
        <svg
          width="120"
          height="72"
          viewBox="0 0 80 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.1349 16.0698L7.63736 39.6634H0L11.7794 7.63721H18.4992L30.2785 39.6634H22.6412L15.1349 16.0698Z"
            fill="#fff"
          />
          <path
            d="M40.9131 7.63721H33.4592V39.6634H40.9131V7.63721Z"
            fill="#fff"
          />
          <path
            d="M72.546 39.6634V20.4914L65.5466 34.4291H61.5531L54.5449 20.4914V39.6634H47.0911V7.63721H55.1828L63.5455 24.3712L71.9605 7.63721H79.9999V39.6634H72.546Z"
            fill="#fff"
          />
          <path
            d="M18.8837 39.8994H11.6309V47.0999H18.8837V39.8994Z"
            fill="#F8E586"
          />
        </svg>
      </div>

      <h2 className="font-adamina text-[34px] tracking-[-0.5px] text-white">
        Welcome back, {name}
      </h2>

      <p className="mt-2.5 text-[11px] uppercase tracking-[0.22em] text-white/40">
        AIM Digital Press · Admin Dashboard
      </p>

      <div className="mt-12 h-0.5 w-40 overflow-hidden rounded bg-white/10">
        <div className="h-full w-full animate-[fillBar_1.3s_cubic-bezier(.4,0,.2,1)_infinite] bg-linear-to-r from-[#F8E586] to-[#EE8461]" />
      </div>
    </div>
  );
}
