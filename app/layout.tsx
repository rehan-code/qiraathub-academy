import type { Metadata, Viewport } from "next";
import { Geist } from 'next/font/google'
import "./globals.css";
import Footer from "./components/footer";
import { Navbar } from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/json-ld";

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://academy.qiraathub.com'),
  title: {
    default: "QiraatHub Academy",
    template: "%s | QiraatHub Academy"
  },
  description: "Learn the 10 Qiraat with QiraatHub Academy - Professional Quranic recitation courses with certified teachers",
  keywords: ["Qiraat", "Quran", "Islamic education", "Quran recitation", "Tajweed", "Online Quran classes"],
  authors: [{ name: "QiraatHub Academy" }],
  creator: "QiraatHub Academy",
  publisher: "QiraatHub Academy",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://academy.qiraathub.com',
    title: 'QiraatHub Academy',
    description: 'Learn the 10 Qiraat with QiraatHub Academy - Professional Quranic recitation courses with certified teachers',
    siteName: 'QiraatHub Academy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QiraatHub Academy',
    description: 'Learn the 10 Qiraat with QiraatHub Academy - Professional Quranic recitation courses with certified teachers',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={geist.className}>
        {/* <GoogleTagManager gtmId="G-RTYVR0XKQ0" /> */}
        <head>
          <OrganizationJsonLd 
            name="QiraatHub Academy"
            url="https://academy.qiraathub.com"
            logo="https://academy.qiraathub.com/logo.png"
          />
          <WebsiteJsonLd 
            name="QiraatHub Academy"
            url="https://academy.qiraathub.com"
          />
        </head>
        <body className={`antialiased`}>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
