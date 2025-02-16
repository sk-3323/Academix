"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { ResponsiveSidebarWithAutoOpen } from "@/components/Sidebar/AppSidebar";
import { HeroHighlight } from "@/components/ui/hero-hightlight";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [isSidebar, setIsSidebar] = React.useState(false);
  const data = useSession();

  useEffect(() => {
    if (data.data?.user == null || data.status == "unauthenticated") {
      setIsSidebar(false);
    } else {
      setIsSidebar(true);
    }
  }, []);

  // Define routes where Navbar and Footer should be hidden
  const noNavFooterRoutes = [
    "/account/login",
    "/account/signup",
    "/account/verify-otp",
    "/courses/",
  ];
  const isAdminRoute = pathname.startsWith("/admin");
  const isTeacherRoute = pathname.startsWith("/teacher");

  const hideNavFooter =
    noNavFooterRoutes.includes(pathname) ||
    isAdminRoute ||
    isTeacherRoute ||
    pathname?.startsWith("/account/") ||
    pathname?.startsWith("/courses/");

  return (
    <>
      {!hideNavFooter && <CustomCursor />}
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {!noNavFooterRoutes && <ResponsiveSidebarWithAutoOpen />}
        <div className="flex flex-col flex-1">
          <SidebarInset>
            <HeroHighlight>
              {!hideNavFooter && (
                <header className="flex justify-between items-center p-4 border-b w-full">
                  <Navbar isMobile={isMobile} />
                  {isMobile && !isSidebar && <MobileMenu />}
                </header>
              )}
              <main className="flex-1 p-4 overflow-x-hidden w-full">
                {children}
              </main>
              {!hideNavFooter && (
                <footer className="flex justify-center items-center p-4 w-full">
                  <Footer />
                </footer>
              )}
            </HeroHighlight>
          </SidebarInset>
        </div>
      </div>
    </>
  );
}
