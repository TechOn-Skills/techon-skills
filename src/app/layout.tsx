import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/services/i18react-next";
import Providers from "@/lib/providers";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechOn Skills - Learn Web Development, Mobile Apps & Software Engineering",
  description: "Modern, outcome-driven training in web development, mobile app development, software engineering, and e-commerce (Shopify + WordPress + Wix). Starting from PKR 2,500/month only. Career support for top performers.",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
  ],
  openGraph: {
    title: "TechOn Skills",
    description: "Modern, outcome-driven training in web development, mobile app development, software engineering, and e-commerce (Shopify + WordPress + Wix). Starting from PKR 2,500/month only. Career support for top performers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
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
          <Toaster position="bottom-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
