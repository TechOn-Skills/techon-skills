import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/services/i18react-next";
import Providers from "@/lib/providers";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechOn Skills",
  description: "TechOn Skills is a platform for learning advanced skills in web development, mobile app development, software engineering, and e-commerce. We offer a wide range of courses to help you learn new skills and advance your career. Land your dream job in months!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TechOn Skills",
    description: "TechOn Skills is a platform for learning advanced skills in web development, mobile app development, software engineering, and e-commerce. We offer a wide range of courses to help you learn new skills and advance your career. Land your dream job in months!",
    images: [
      { url: "/favicon.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD, 0 0 5px #2299DD"
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
