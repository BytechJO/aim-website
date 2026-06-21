"use client";

import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/app/api/endpoints";

import Sidebar from "./Sidebar";
import Overview from "./views/Overview";
import WelcomeScreen from "./WelcomeScreen";
import Products from "./views/binding/binding";
import Enhancements from "./views/enhancements/Enhancements";
import CoverExtras from "./views/CoverExtra/CoverExtras";
import News from "./views/News/News";
import Instagram from "./views/instagram/Instagram";
import Reviews from "./views/Reviews/Reviews";
import Users from "./views/Users/Users";
type Props = {
  onLogout: () => void;
};

export type AdminView =
  | "overview"
  | "binding"
  | "news"
  | "enhancements"
  | "cover-extras"
  | "instagram"
  | "reviews"
  | "admins"
  | "contact"
  | "newsletter";

export type DashboardStats = {
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

export default function Dashboard({ onLogout }: Props) {
  const [view, setView] = useState<AdminView>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;

    const isRefresh = nav?.type === "reload";

    if (!isRefresh) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        const response = await fetch(ENDPOINTS.DASHBOARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <>
      {showWelcome && (
        <WelcomeScreen
          name="Admin"
          loading={loadingDashboard}
          onFinish={() => setShowWelcome(false)}
        />
      )}

      <div className="flex h-screen bg-[#F6F6F6]">
        <Sidebar current={view} onChange={setView} onLogout={onLogout} />

        <main className="flex-1 overflow-y-auto">
          <div>
            {view === "overview" &&
              (loadingDashboard ? (
                <div className="flex h-125 items-center justify-center ">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E6E6E6] border-t-[#0F0F0F]" />
                    <p className="text-sm text-[#707070]">
                      Loading dashboard...
                    </p>
                  </div>
                </div>
              ) : (
                stats && <Overview stats={stats} onNavigate={setView} />
              ))}

            {view === "binding" && <Products />}
            {view === "news" && <News />}
            {view === "enhancements" && <Enhancements />}
            {view === "cover-extras" && <CoverExtras />}
            {view === "instagram" && <Instagram />}
            {view === "reviews" && <Reviews />}
            {view === "admins" && <Users />}
            {view === "contact" && <div className="text-2xl">Inquiries</div>}
            {view === "newsletter" && (
              <div className="text-2xl">Subscribers</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
