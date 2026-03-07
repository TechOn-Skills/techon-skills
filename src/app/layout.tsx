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

const SITE_NAME = "TechOn Skills"
const DEFAULT_DESCRIPTION = "Modern, outcome-driven training in web development, mobile app development, software engineering, and e-commerce (Shopify + WordPress + Wix). Starting from PKR 2,500/month only. Career support for top performers."

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} - Learn Web Development, Mobile Apps & Software Engineering`, template: `%s | ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  robots: { index: true, follow: true },
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
