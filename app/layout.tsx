"use client";
import * as React from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/shadcn/toaster";
import { MainLayout } from "@/components/layout/main-layout";
import { Providers } from "@/components/providers/providers";

// Persian font
const vazir = localFont({
  src: "./fonts/YekanBakhFaNum-Light.ttf",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={vazir.className} dir="rtl">
      <body>
        <Toaster />
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
