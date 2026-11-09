import type { Metadata } from "next";
import { AuthProvider } from "@/context/auth-context";
import { ToastProvider } from "@/context/toast-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Debwan Live",
    template: "%s | Debwan Live",
  },
  description: "Debwan Live — plataforma autoalojada de televisión en directo, películas y series.",
  keywords: ["Debwan Live", "streaming", "televisión en directo", "IPTV", "películas", "series", "VOD"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#4f46e5",
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  openGraph: {
    title: "Debwan Live",
    description: "Televisión en directo, películas y series en una plataforma autoalojada.",
    type: "website",
    siteName: "Debwan Live",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debwan Live",
    description: "Televisión en directo, películas y series en una plataforma autoalojada.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
