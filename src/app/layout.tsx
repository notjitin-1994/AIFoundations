import type { Metadata } from "next";
import { Quicksand, Lato } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-heading",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Foundations: Concept to Application",
  description: "A comprehensive AI literacy course for non-technical professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${quicksand.variable} antialiased flex h-screen overflow-hidden bg-background text-foreground`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
