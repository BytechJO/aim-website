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
import Contacts from "./views/Contact/Contact";
import Newsletter from "./views/Newsletter/Newsletter";

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

export default function Dashboard({ onLogout }: Props) {
  const [view, setView] = useState<AdminView>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
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
    const loadMe = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        if (!token) {
          onLogout();
          return;
        }

        const response = await fetch(ENDPOINTS.ME, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("admin_token");
          onLogout();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load admin user");
        }

        const data = await response.json();

        setAdminUser(data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadMe();
  }, [onLogout]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        if (!token) {
          onLogout();
          return;
        }

        const response = await fetch(ENDPOINTS.DASHBOARD, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("admin_token");
          onLogout();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, [onLogout]);
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("admin_token");

        if (!token) {
          onLogout();
          return;
        }

        const response = await fetch(ENDPOINTS.ME, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_role");
          localStorage.removeItem("admin_approval_status");
          onLogout();
          return;
        }

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.user?.approval_status !== "approved") {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_role");
          localStorage.removeItem("admin_approval_status");

          onLogout();
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAdminStatus();

    const interval = setInterval(() => {
      checkAdminStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, [onLogout]);
  const welcomeName =
    adminUser?.full_name?.trim() || adminUser?.email?.split("@")[0] || "Admin";

  return (
    <>
      {showWelcome && (
        <WelcomeScreen
          name={welcomeName}
          loading={loadingDashboard || loadingUser}
          onFinish={() => setShowWelcome(false)}
        />
      )}

      <div className="flex h-screen bg-[#F6F6F6]">
        <Sidebar
          current={view}
          onChange={setView}
          onLogout={onLogout}
          adminUser={adminUser}
        />

        <main className="flex-1 overflow-y-auto">
          <div>
            {view === "overview" &&
              (loadingDashboard ? (
                <div className="flex h-125 items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E6E6E6] border-t-[#0F0F0F]" />
                    <p className="text-sm text-[#707070]">
                      Loading dashboard...
                    </p>
                  </div>
                </div>
              ) : (
                stats && <Overview stats={stats} onNavigate={setView} adminUser={adminUser} />
              ))}

            {view === "binding" && <Products />}
            {view === "news" && <News />}
            {view === "enhancements" && <Enhancements />}
            {view === "cover-extras" && <CoverExtras />}
            {view === "instagram" && <Instagram />}
            {view === "reviews" && <Reviews />}
            {view === "admins" && <Users />}
            {view === "contact" && <Contacts />}
            {view === "newsletter" && <Newsletter />}
          </div>
        </main>
      </div>
    </>
  );
}
