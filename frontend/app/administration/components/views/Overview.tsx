"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AdminView } from "../Dashboard";

type DashboardStats = {
  products: number;
  activeProducts: number;

  reviews: number;
  activeReviews: number;

  instagram: number;
  activeInstagram: number;

  contacts: number;
  newContacts: number;

  newsletter: number;
  activeNewsletter: number;

  admins: number;
  pendingAdmins: number;

  recentContacts: {
    id: number;
    name: string;
    email: string;
    inquiry_type: string;
    message: string;
    created_at: string;
  }[];
};

type Props = {
  stats: DashboardStats;
  onNavigate: (view: AdminView) => void;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
};

export default function Overview({ stats, onNavigate }: Props) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const icon = hour < 12 ? "☀️" : hour < 17 ? "🌤️" : "🌙";

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (!stats) {
    return (
      <div className="flex h-80 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E6E6E6] border-t-black" />
      </div>
    );
  }

  return (
    <div>
      <div
        className="
    sticky
    top-0
    z-30
    mb-4
    border
    border-[#D7D9DF]
    bg-white
  "
      >
        <div className="flex items-center justify-between px-8 py-5">
          <h1 className="font-adamina text-[24px] text-[#111]">Dashboard</h1>
        </div>
      </div>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative mb-6 flex items-center justify-between overflow-hidden rounded-2xl bg-linear-to-r from-[#F8E586] to-[#EE8461] px-9 py-8"
        >
          <div className="relative z-10">
            <h2 className="font-adamina text-[26px] text-[#0F0F0F]">
              {greeting}, Admin.
            </h2>

            <p className="mt-1 text-[13px] text-black/60">
              {date} — Here&apos;s your dashboard overview.
            </p>
          </div>

          <div className="animate-[floatY_3s_ease-in-out_infinite] text-5xl">
            {icon}
          </div>

          <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full bg-white/15" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-6"
        >
          <motion.div variants={itemVariants}>
            <Card
              icon="📦"
              title="Products"
              value={stats.products}
              sub={`${stats.activeProducts} active`}
              onClick={() => onNavigate("binding")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon="⭐"
              title="Reviews"
              value={stats.reviews}
              sub={`${stats.activeReviews} active`}
              onClick={() => onNavigate("reviews")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon="📸"
              title="Instagram"
              value={stats.instagram}
              sub={`${stats.activeInstagram} active`}
              onClick={() => onNavigate("instagram")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon="✉️"
              title="Inquiries"
              value={stats.contacts}
              sub={`${stats.newContacts} new`}
              onClick={() => onNavigate("contact")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon="◉"
              title="Subscribers"
              value={stats.newsletter}
              sub={`${stats.activeNewsletter} active`}
              onClick={() => onNavigate("newsletter")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card
              icon="👤"
              title="Staff"
              value={stats.admins}
              sub={`${stats.pendingAdmins} pending`}
              onClick={() => onNavigate("admins")}
            />
          </motion.div>
        </motion.div>

        {stats.newContacts > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="mt-8 overflow-hidden rounded-2xl border border-[#D7D9DF] bg-white"
          >
            <div className="flex items-center justify-between border-b border-[#D7D9DF] px-5 py-4">
              <h3 className="font-adamina text-xl">New Inquiries</h3>

              <button
                onClick={() => onNavigate("contact")}
                className="rounded-full border border-[#D7D9DF] px-4 py-2 text-xs font-semibold transition hover:bg-[#F6F6F6]"
              >
                View all →
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-[#F6F6F6]">
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider">
                    From
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider">
                    Message
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider">
                    Received
                  </th>
                </tr>
              </thead>

              <tbody>
                {stats.recentContacts.map((item) => (
                  <tr key={item.id} className="border-t border-[#D7D9DF]">
                    <td className="px-4 py-4">
                      <div className="font-semibold">{item.name}</div>

                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase text-blue-600">
                        {item.inquiry_type}
                      </span>
                    </td>

                    <td className="max-w-75 truncate px-4 py-4">
                      {item.message}
                    </td>

                    <td className="px-4 py-4 text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;

    const duration = 1400;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{count}</>;
}

function Card({
  icon,
  title,
  value,
  sub,
  onClick,
}: {
  icon: string;
  title: string;
  value: number;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer rounded-2xl border border-[#D7D9DF] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-3 text-xl">{icon}</div>

      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
        {title}
      </div>

      <div className="font-adamina text-4xl">
        <CountUp value={value} />
      </div>

      <div className="mt-2 text-xs text-[#707070]">{sub}</div>
    </button>
  );
}
