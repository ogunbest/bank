import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";

import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Covenant Banking",
    template: "%s | Covenant Banking",
  },
  description: "Modern digital banking made simple.",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ibmPlexSerif.variable} min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] antialiased dark:bg-[#0B1120] dark:text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}