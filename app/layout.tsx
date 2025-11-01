import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalNav from "@/components/ConditionalNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Signal - Lead Operating System",
  description: "Manage and operate your leads efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConditionalNav />
        {children}
      </body>
    </html>
  );
}
