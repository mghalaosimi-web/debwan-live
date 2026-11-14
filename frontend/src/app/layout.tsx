import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import PWAInstallGate from "@/components/PWAInstallGate";
import "./globals.css";

const siteName = "دبوان لايف";
const siteDescription = "دبوان لايف (DEBWAN LIVE) منصة عربية لمتابعة كرة القدم؛ استكشف المباريات والنتائج والبطولات وترتيب الفرق وإحصائيات اللاعبين من مركز كرة القدم، مع توضيح الأقسام التي ما زالت قيد التطوير.";
const brandIcon = "https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669237125.jpg";
const brandHero = "https://raw.githubusercontent.com/mghalaosimi-web/debwan-live/main/public/branding/1794669075512.jpg";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://debwan-live-football-web.onrender.com/#website",
      "url": "https://debwan-live-football-web.onrender.com/",
      "name": "دبوان لايف",
      "alternateName": ["DEBWAN LIVE", "Debwan Live"],
      "inLanguage": ["ar", "en"],
      "publisher": { "@id": "https://debwan-live-football-web.onrender.com/#organization" }
    },
    {
      "@type": "Organization",
      "@id": "https://debwan-live-football-web.onrender.com/#organization",
      "name": "دبوان لايف",
      "alternateName": "DEBWAN LIVE",
      "url": "https://debwan-live-football-web.onrender.com/",
      "logo": brandIcon,
      "sameAs": [
        "https://github.com/mghalaosimi-web",
        "https://mghalaosimi-web.vercel.app/"
      ]
    },
    {
      "@type": "Person",
      "@id": "https://mghalaosimi-web.vercel.app/#person",
      "name": "محمد غالب العصيمي",
      "alternateName": ["Mohammed Ghaleb Alaosimi", "M.GH.AL"],
      "url": "https://mghalaosimi-web.vercel.app/",
      "jobTitle": "Full-Stack Developer",
      "sameAs": [
        "https://github.com/mghalaosimi-web",
        "https://www.linkedin.com/in/mohammed-alaosimi-038155443/",
        "https://www.credly.com/users/mohammed-ghaleb-al-aosimi",
        "https://www.tiktok.com/@m.gh.al.2006"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://debwan-live-football-web.onrender.com/#app",
      "name": "دبوان لايف | DEBWAN LIVE",
      "url": "https://debwan-live-football-web.onrender.com/",
      "applicationCategory": "SportsApplication",
      "operatingSystem": "Web",
      "inLanguage": "ar",
      "description": siteDescription,
      "creator": { "@id": "https://mghalaosimi-web.vercel.app/#person" }
    }
  ]
};

export const metadata: Metadata = {
  title: {
    default: "دبوان لايف | DEBWAN LIVE",
    template: "%s | دبوان لايف",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: ["دبوان لايف", "DEBWAN LIVE", "Debwan Live", "دبوان", "مركز كرة القدم", "مباريات اليوم", "نتائج المباريات", "جدول المباريات", "ترتيب الدوريات", "البطولات", "إحصائيات اللاعبين", "محمد غالب العصيمي", "M.GH.AL"],
  authors: [{ name: "محمد غالب العصيمي", url: "https://mghalaosimi-web.vercel.app/" }],
  creator: "محمد غالب العصيمي | M.GH.AL",
  publisher: "DEBWAN LIVE",
  category: "Sports",
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
    url: "https://debwan-live-football-web.onrender.com/",
    type: "website",
    siteName,
    locale: "ar_YE",
    images: [{ url: brandHero, width: 1200, height: 630, alt: "DEBWAN LIVE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "دبوان لايف | DEBWAN LIVE",
    description: siteDescription,
    images: [{ url: brandHero, alt: "دبوان لايف - DEBWAN LIVE" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#07111f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <AuthProvider>
          <ToastProvider>{children}<PWAInstallGate /></ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
