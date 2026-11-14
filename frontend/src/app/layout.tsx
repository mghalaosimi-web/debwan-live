import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import "./globals.css";

const siteName = "دبوان لايف";
const siteDescription = "دبوان لايف — وجهتك لمتابعة كرة القدم واستكشاف القنوات والمحتوى الترفيهي.";
const brandIcon = "https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669237125.jpg";
const brandHero = "https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669075512.jpg";

export const metadata: Metadata = {
  title: {
    default: "دبوان لايف | DEBWAN LIVE",
    template: "%s | دبوان لايف",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: ["دبوان لايف", "كرة القدم", "مباريات اليوم", "نتائج المباريات", "القنوات المباشرة", "البث الرسمي", "الأفلام", "المسلسلات"],
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : new URL("https://debwan-live-football-web.onrender.com"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: brandIcon, type: "image/jpeg" }],
    shortcut: [{ url: brandIcon, type: "image/jpeg" }],
    apple: [{ url: brandIcon, type: "image/jpeg" }],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    googleBot: { index: true, follow: true, noimageindex: false },
  },
  openGraph: {
    title: "دبوان لايف | DEBWAN LIVE",
    description: siteDescription,
    type: "website",
    siteName,
    locale: "ar_YE",
    images: [{ url: brandHero, width: 1200, height: 630, alt: "DEBWAN LIVE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دبوان لايف | DEBWAN LIVE",
    description: siteDescription,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#07111f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
