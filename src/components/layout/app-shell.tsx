"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

const AUTH_ROUTES = ["/login", "/signup", "/auth"];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChrome = !isAuthRoute(pathname);

  if (!showChrome) {
    // Auth pages: bare layout, no sidebar/header
    return <>{children}</>;
  }

  const isCertificateRoute = pathname.includes("/certificate");
  const isMarketingRoute = pathname === "/" || pathname === "/courses/aifoundations-concept2application";
  const isDashboardRoute = pathname.includes("/dashboard");
  const hideSidebar = isCertificateRoute || isMarketingRoute || isDashboardRoute;

  // Lesson/module pages: full layout with sidebar + header
  return (
    <>
      {!hideSidebar && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isMarketingRoute && !isCertificateRoute && !isDashboardRoute && <Header />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
