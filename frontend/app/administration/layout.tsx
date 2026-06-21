import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIM Administration",
  description: "AIM Administration Dashboard",
  icons: { icon: "/logo.svg" },
};

export default function AdministrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
