"use client";

import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import WelcomeScreen from "./components/WelcomeScreen";

export default function AdministrationPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const token = localStorage.getItem("admin_token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    setShowWelcome(true);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_approval_status");

    setIsLoggedIn(false);
    setShowWelcome(false);
  };

  if (!mounted) {
    return null;
  }

  if (!isLoggedIn) {
    return <Login onLogin={login} />;
  }

  if (showWelcome) {
    return (
      <WelcomeScreen
        name={localStorage.getItem("admin_email") || "Admin"}
        loading={false}
        onFinish={() => setShowWelcome(false)}
      />
    );
  }

  return <Dashboard onLogout={logout} />;
}
