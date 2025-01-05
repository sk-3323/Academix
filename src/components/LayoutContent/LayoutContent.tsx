"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { ResponsiveSidebarWithAutoOpen } from "@/components/Sidebar/AppSidebar";
import { HeroHighlight } from "@/components/ui/hero-hightlight";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  // Define routes where Navbar and Footer should be hidden
  const noNavFooterRoutes = ["/account/login", "/account/signup"];
  const hideNavFooter = noNavFooterRoutes.includes(pathname);

  return (
    <>
      {!hideNavFooter && <CustomCursor />}
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {!hideNavFooter && !isMobile && <ResponsiveSidebarWithAutoOpen />}
        <div className="flex flex-col flex-1">
          <SidebarInset>
            <HeroHighlight>
              {!hideNavFooter && (
                <header className="flex justify-between items-center p-4 border-b w-full">
                  <Navbar isMobile={isMobile} />
                  {isMobile && <MobileMenu />}
                </header>
              )}
              <main className="flex-1 p-4 overflow-x-hidden w-full">
                {children}
              </main>
              {!hideNavFooter && <Footer />}
            </HeroHighlight>
          </SidebarInset>
        </div>
      </div>
    </>
  );
}
