import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreInitializer from "@/components/common/StoreInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Learning Platform",
  description: "Nền tảng học trực tuyến",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreInitializer />
        {children}
      </body>
    </html>
  );
}
