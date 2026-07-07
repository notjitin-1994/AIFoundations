import type { Metadata } from "next";
import { Quicksand, Lato } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

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
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
