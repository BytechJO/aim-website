"use client";

import { ENDPOINTS } from "@/app/api/endpoints";
import Image from "next/image";
import { useState } from "react";

type Props = {
  onLogin: () => void;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.approval_status === "pending") {
        setError(
          "Your account is still pending approval. Please wait for super admin approval.",
        );
        return;
      }

      if (data.approval_status === "rejected") {
        setError(
          data.rejection_reason
            ? `Your account was rejected. Reason: ${data.rejection_reason}`
            : "Your account was rejected. Please contact the super admin.",
        );
        return;
      }

      if (data.approval_status !== "approved") {
        setError("Your account is not approved yet.");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_role", data.role);
      localStorage.setItem("admin_approval_status", data.approval_status);
      sessionStorage.setItem("show_admin_welcome", "true");

      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F6F6]">
      <div className="absolute -left-48 -top-48 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(248,229,134,0.35)_0%,transparent_65%)]" />

      <div className="absolute -bottom-32 -right-20 h-125 w-125 rounded-full bg-[radial-gradient(circle,rgba(238,132,97,0.20)_0%,transparent_60%)]" />

      <div className="relative z-10 w-105 rounded-2xl border border-[#D7D9DF] bg-white px-11 pb-11 pt-12 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        <Image
          src="/logo.svg"
          alt="AIM"
          width={100}
          height={60}
          priority
          className="mb-2"
        />

        <p className="mb-10 text-[11px] font-medium uppercase tracking-[0.12em] text-[#707070]">
          Staff Administration
        </p>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            error
              ? "mb-5 max-h-20 opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-2"
          }`}
        >
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
        <form
          autoComplete="on"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@aim.com"
              autoComplete="username"
              className="h-10.5 w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 text-sm outline-none transition focus:border-[#285FE7]"
            />
          </div>

          <div className="mb-7">
            <label
              htmlFor="password"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-[#707070]"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-10.5 w-full rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-4 text-sm outline-none transition focus:border-[#285FE7]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full cursor-pointer rounded-full bg-[#0F0F0F] text-[15px] font-semibold text-white transition-all duration-200 hover:bg-[#434343] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(0,0,0,0.18)] active:scale-[0.98] disabled:cursor-auto disabled:opacity-60 disabled:hover:translate-y-0  disabled:hover:shadow-none"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
