"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdminView } from "./Dashboard";

type Props = {
  current: AdminView;
  onChange: (view: AdminView) => void;
  onLogout: () => void;
};

const sections = [
  {
    title: "Overview",
    items: [{ id: "overview", label: "Dashboard" }],
  },
  {
    title: "Content",
    items: [
      { id: "news", label: "News" },
      { id: "instagram", label: "Instagram" },
      { id: "reviews", label: "Reviews" },
    ],
  },
  {
    title: "Inbox",
    items: [
      { id: "contact", label: "Inquiries" },
      { id: "newsletter", label: "Subscribers" },
    ],
  },
  {
    title: "Admin",
    items: [{ id: "admins", label: "Users" }],
  },
] as const;

export default function Sidebar({ current, onChange, onLogout }: Props) {
  const [productsOpen, setProductsOpen] = useState(
    current === "binding" ||
      current === "enhancements" ||
      current === "cover-extras",
  );
  useEffect(() => {
    if (
      current === "binding" ||
      current === "enhancements" ||
      current === "cover-extras"
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProductsOpen(true);
    }
  }, [current]);
  return (
    <aside className="flex h-screen w-62 shrink-0 flex-col border-r border-[#D7D9DF] bg-white">
      {/* Brand */}
      <div className="border-b border-[#D7D9DF] px-5.5 py-7">
        <Image
          src="/logo.svg"
          alt="AIM"
          width={56}
          height={34}
          className="h-auto"
        />

        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#707070]">
          Admin Dashboard
        </p>
      </div>

      {/* User */}
      <div className="flex items-center gap-3 border-b border-[#D7D9DF] px-5.5 py-4">
        <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-linear-to-r from-[#F8E586] to-[#EE8461] text-[13px] font-bold text-[#0F0F0F]">
          A
        </div>

        <div>
          <p className="text-[13px] font-semibold text-[#0F0F0F]">
            Administrator
          </p>

          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#EE8461]">
            Admin
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="px-5.5 pb-1.5 pt-4.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[#B7B7B7]">
              {section.title}
            </div>

            {section.title === "Content" && (
              <>
                <button
                  onClick={() => setProductsOpen((v) => !v)}
                  className="flex w-full items-center justify-between border-l-2 border-transparent px-5.5 py-2.5 text-left text-[13px] font-medium text-[#2C2C2C] transition hover:bg-[#F6F6F6]"
                >
                  <span>Products</span>

                  <span
                    className={`text-[10px] transition-transform duration-200 ${
                      productsOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {productsOpen && (
                  <div>
                    <button
                      onClick={() => onChange("binding")}
                      className={`flex w-full items-center border-l-2 px-9 py-2 text-left text-[13px] transition-all ${
                        current === "binding"
                          ? "border-[#0F0F0F] bg-[#F6F6F6] font-semibold text-[#0F0F0F]"
                          : "border-transparent font-medium text-[#2C2C2C] hover:bg-[#F6F6F6]"
                      }`}
                    >
                      Binding
                    </button>

                    <button
                      onClick={() => onChange("enhancements")}
                      className={`flex w-full items-center border-l-2 px-9 py-2 text-left text-[13px] transition-all ${
                        current === "enhancements"
                          ? "border-[#0F0F0F] bg-[#F6F6F6] font-semibold text-[#0F0F0F]"
                          : "border-transparent font-medium text-[#2C2C2C] hover:bg-[#F6F6F6]"
                      }`}
                    >
                      Enhancement
                    </button>

                    <button
                      onClick={() => onChange("cover-extras")}
                      className={`flex w-full items-center border-l-2 px-9 py-2 text-left text-[13px] transition-all ${
                        current === "cover-extras"
                          ? "border-[#0F0F0F] bg-[#F6F6F6] font-semibold text-[#0F0F0F]"
                          : "border-transparent font-medium text-[#2C2C2C] hover:bg-[#F6F6F6]"
                      }`}
                    >
                      Cover Extra
                    </button>
                  </div>
                )}

                {section.items.map((item) => {
                  const active = current === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onChange(item.id)}
                      className={`flex w-full items-center border-l-2 px-5.5 py-2.5 text-left text-[13px] transition-all duration-150 ${
                        active
                          ? "border-[#0F0F0F] bg-[#F6F6F6] font-semibold text-[#0F0F0F]"
                          : "border-transparent font-medium text-[#2C2C2C] hover:bg-[#F6F6F6] hover:text-[#0F0F0F]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </>
            )}

            {section.title !== "Content" &&
              section.items.map((item) => {
                const active = current === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className={`flex w-full items-center border-l-2 px-5.5 py-2.5 text-left text-[13px] transition-all duration-150 ${
                      active
                        ? "border-[#0F0F0F] bg-[#F6F6F6] font-semibold text-[#0F0F0F]"
                        : "border-transparent font-medium text-[#2C2C2C] hover:bg-[#F6F6F6] hover:text-[#0F0F0F]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#D7D9DF] p-4">
        <div className="mb-2 flex items-center gap-2 rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-3 py-2 text-[12px] font-semibold text-[#2C2C2C]">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Live Events
        </div>

        <button
          onClick={onLogout}
          className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full border border-[#D7D9DF] text-[11px] font-semibold transition-all hover:border-[#CCCCCC] hover:bg-[#F6F6F6]"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
