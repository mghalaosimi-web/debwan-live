import type { Metadata } from "next";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import "./globals.css";

const brandIcon = "https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669075512.jpg";
const brandHero = "https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669237125.jpg";

export const metadata: Metadata = {
  title: { default: "Debwan Live", template: "%s | Debwan Live" },
  description: "دبوان لايف — وجهتك لمتابعة كرة القدم واستكشاف القنوات والمحتوى الترفيهي.",
  keywords: ["Debwan Live", "دبوان لايف", "football", "streaming", "live sports"],
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : undefined,
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: brandIcon, type: "image/jpeg" }],
    shortcut: [{ url: brandIcon, type: "image/jpeg" }],
    apple: [{ url: brandIcon, type: "image/jpeg" }],
  },
  themeColor: "#07111f",
  robots: {
    index: true, follow: true, noarchive: false,
    googleBot: { index: true, follow: true, noimageindex: false },
  },
  openGraph: {
    title: "دبوان لايف | DEBWAN LIVE",
    description: "كرة القدم، القنوات، والمحتوى الترفيهي — بهوية واحدة.",
    type: "website", siteName: "DEBWAN LIVE", locale: "ar_YE",
    images: [{ url: brandHero, width: 1200, height: 630, alt: "DEBWAN LIVE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دبوان لايف | DEBWAN LIVE",
    description: "كرة القدم، القنوات، والمحتوى الترفيهي — بهوية واحدة.",
    images: [brandHero],
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <AuthProvider><ToastProvider>{children}</ToastProvider></AuthProvider>
      </body>
    </html>
  );
}
