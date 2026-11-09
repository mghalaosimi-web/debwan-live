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
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : undefined,
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  themeColor: "#172B4D",
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
