import type { Metadata } from "next";
import { Geist } from 'next/font/google'
import "./globals.css";
import Footer from "./components/footer";
import { Navbar } from "@/components/navbar";

const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Qiraathub Academy",
  description: "Learn the 10 Qiraat with Qiraathub Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body className={`antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
