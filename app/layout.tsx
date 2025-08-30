import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Platforms Starter Kit",
  description: "Next.js template for building a multi-tenant SaaS.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {/* TOP NAV */}
        <nav
          style={{
            display: "flex",
            gap: "16px",
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: 12,
          }}
        >
          <Link href="/">Home</Link>
          <Link href="/parking">Parking Insights</Link>
        </nav>

        {/* PAGE CONTENT */}
        {children}

        <SpeedInsights />
      </body>
    </html>
  );
}
