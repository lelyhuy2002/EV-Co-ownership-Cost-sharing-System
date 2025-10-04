import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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

import UserRedirect from "@/components/UserRedirect/UserRedirect";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AuthProvider>
          <UserRedirect>
            {children}
          </UserRedirect>
        </AuthProvider>
      </body>
    </html>
  );
}
