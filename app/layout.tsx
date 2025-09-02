import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

// If you were using a Google font earlier (Geist/Inter), you can add it back.
// Example:
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "Majaz Parking Dashboard",
  description: "Parking insights demo (Majaz 3 / UAE - Parking AI System)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Add your font class to body if you imported one, e.g. className={inter.className} */}
      <body>
        <SiteHeader />
        {/* Page container */}
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <SiteFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
