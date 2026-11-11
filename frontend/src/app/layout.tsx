import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import "./globals.css";

const siteName = "دبوان لايف";
const siteDescription = "منصة عربية لمتابعة مباريات كرة القدم والنتائج والبطولات، واستكشاف القنوات ومصادر المشاهدة الرسمية والمحتوى الترفيهي.";

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
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
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
  },
  twitter: {
    card: "summary_large_image",
    title: "دبوان لايف | DEBWAN LIVE",
    description: siteDescription,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {\n  themeColor: "#07111f",\n  colorScheme: "dark",\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {
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
