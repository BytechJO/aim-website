"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AdminView } from "./Dashboard";
import { io } from "socket.io-client";
type AdminUser = {
  id: number;
  email: string;
  full_name: string;
  job_number: string;
  position: string | null;
  role: string;
  approval_status: string;
  created_at: string;
};

type Props = {
  current: AdminView;
  onChange: (view: AdminView) => void;
  onLogout: () => void;
  adminUser: AdminUser | null;
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
      { id: "contact", label: "Contact" },
      { id: "newsletter", label: "Subscribers" },
    ],
  },
  {
    title: "Admin",
    items: [{ id: "admins", label: "Users", superOnly: true }],
  },
] as const;

export default function Sidebar({
  current,
  onChange,
  onLogout,
  adminUser,
}: Props) {
  const [productsOpen, setProductsOpen] = useState(
    current === "binding" ||
      current === "enhancements" ||
      current === "cover-extras",
  );
  const [openEvents, setOpenEvents] = useState(false);

  const [events, setEvents] = useState<
    {
      id: number;
      text: string;
      time: string;
    }[]
  >([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    const socket = io("http://localhost:3000", {
      auth: {
        token: token,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    socket.on("new_subscriber", (data) => {
      setNotificationsCount((prev) => prev + 1);

      setEvents((prev) => [
        {
          id: Date.now(),
          text: `New subscriber: ${data.email}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });
    socket.on("new_contact", (data) => {
      setNotificationsCount((prev) => prev + 1);

      setEvents((prev) => [
        {
          id: Date.now(),
          text: `New inquiry received`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
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
  const displayName =
    adminUser?.full_name?.trim() ||
    adminUser?.email?.split("@")[0] ||
    "Administrator";

  const displayRole =
    adminUser?.role === "super_admin"
      ? "Super Admin"
      : adminUser?.role === "admin"
        ? "Admin"
        : "Admin";

  const avatarLetter = displayName.charAt(0).toUpperCase();
  const isSuperAdmin = adminUser?.role === "super_admin";
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
          {avatarLetter}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#0F0F0F]">
            {displayName}
          </p>

          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#EE8461]">
            {displayRole}
          </p>
        </div>
      </div>

      {/* Navigation */}
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sections
          .filter((section) => {
            if (section.title === "Admin" && !isSuperAdmin) {
              return false;
            }

            return true;
          })
          .map((section) => (
            <div key={section.title}>
              <div className="px-5.5 pb-1.5 pt-4.5 text-[9px] font-bold uppercase tracking-[0.13em] text-[#B7B7B7]">
                {section.title}
              </div>

              {section.title === "Content" && (
                <>
                  <button
                    onClick={() => setProductsOpen((v) => !v)}
                    className="flex w-full items-center justify-between border-l-2 border-transparent px-5.5 py-2.5 text-left text-[13px] font-medium text-[#2C2C2C] transition hover:bg-[#F6F6F6] cursor-pointer"
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
                        className={`flex w-full items-center border-l-2 px-9 py-2 text-left text-[13px] transition-all cursor-pointer ${
                          current === "binding"
                            ? "border-[#0F0F0F] bg-[#F6F6F6] font-semibold text-[#0F0F0F]"
                            : "border-transparent font-medium text-[#2C2C2C] hover:bg-[#F6F6F6]"
                        }`}
                      >
                        Binding
                      </button>

                      <button
                        onClick={() => onChange("enhancements")}
                        className={`flex w-full items-center border-l-2 px-9 py-2 text-left text-[13px] transition-all cursor-pointer ${
                          current === "enhancements"
                            ? "border-[#0F0F0F] bg-[#F6F6F6] font-semibold text-[#0F0F0F]"
                            : "border-transparent font-medium text-[#2C2C2C] hover:bg-[#F6F6F6]"
                        }`}
                      >
                        Enhancement
                      </button>

                      <button
                        onClick={() => onChange("cover-extras")}
                        className={`flex w-full items-center border-l-2 px-9 py-2 text-left text-[13px] transition-all cursor-pointer ${
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
                        className={`flex w-full items-center border-l-2 px-5.5 py-2.5 text-left text-[13px] transition-all duration-150 cursor-pointer ${
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
                      className={`flex w-full items-center border-l-2 px-5.5 py-2.5 text-left text-[13px] transition-all duration-150 cursor-pointer ${
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
        <button
          onClick={() => setOpenEvents((v) => !v)}
          className="relative mb-2 flex w-full items-center gap-2 rounded-[10px] border border-[#D7D9DF] bg-[#F6F6F6] px-3 py-2 text-[12px] font-semibold text-[#2C2C2C] cursor-pointer"
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Live Events
          {notificationsCount > 0 && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {notificationsCount}
            </span>
          )}
        </button>
        {openEvents && (
          <div className="absolute bottom-24 left-4 z-50 w-80 overflow-hidden rounded-2xl border border-[#D7D9DF] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#D7D9DF] px-4 py-3">
              <h3 className="text-sm font-semibold">Live Events</h3>

              <button
                onClick={() => {
                  setEvents([]);
                  setNotificationsCount(0);
                }}
                className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {events.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#707070]">
                  No events yet
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="border-b border-[#F2F2F2] px-4 py-3"
                  >
                    <p className="text-sm font-medium text-[#111]">
                      {event.text}
                    </p>

                    <p className="mt-1 text-xs text-[#707070]">{event.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
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
