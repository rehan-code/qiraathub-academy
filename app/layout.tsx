import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";

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
    <html lang="en" className={GeistSans.className}>
      <body className={` antialiased`}>
        {children}
      </body>
    </html>
  );
}
