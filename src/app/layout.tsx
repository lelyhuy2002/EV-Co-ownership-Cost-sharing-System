import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EV Data Marketplace - Nâng tầm phân tích dữ liệu cho ngành xe điện",
  description: "EV Data Marketplace — hạ tầng giao dịch dữ liệu cho ngành xe điện. Phân tích nhanh, chính xác, tương thích với mọi hệ thống.",
  keywords: ["EV", "xe điện", "dữ liệu", "phân tích", "marketplace", "API"],
  authors: [{ name: "EV Data Marketplace Team" }],
  openGraph: {
    title: "EV Data Marketplace",
    description: "Nâng tầm phân tích dữ liệu cho ngành xe điện",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
