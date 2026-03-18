import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Justin's Favorite Things | Personal Product Recommendations",
  description:
    "Curated product recommendations from Justin. Every item here is something I personally bought, used, and genuinely love.",
  openGraph: {
    title: "Justin's Favorite Things",
    description:
      "Curated product recommendations — every item is something I personally bought and love.",
    url: "https://justinsfavoritethings.com",
    siteName: "Justin's Favorite Things",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Justin's Favorite Things",
    description:
      "Curated product recommendations — every item is something I personally bought and love.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-white text-black font-sans">
        <div className="max-w-7xl mx-auto px-6 md:px-12">{children}</div>
      </body>
    </html>
  );
}
