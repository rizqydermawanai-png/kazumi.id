import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/providers/ToastProvider";
import { PrintProvider } from "./components/providers/PrintProvider";
// FIX: Import React to resolve 'Cannot find namespace' error for React types.
import React from "react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Kazumi - HPP & Sales Dashboard",
  description: "A modern web application to calculate Cost of Goods Sold (HPP), manage sales, inventory, and generate comprehensive reports for a clothing business. Built with Next.js, React and Tailwind CSS for a seamless user experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.variable}>
        <ToastProvider>
          <PrintProvider>
            {children}
          </PrintProvider>
        </ToastProvider>
      </body>
    </html>
  );
}