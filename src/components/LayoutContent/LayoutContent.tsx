"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { ResponsiveSidebarWithAutoOpen } from "@/components/Sidebar/AppSidebar";
import { HeroHighlight } from "@/components/ui/hero-hightlight";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import Footer from "@/components/Footer/Footer";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

export function LayoutContent({
  children,
  Sidebar,
  Navbar,
  MobileSidebar,
  MobileNavbar,
}: {
  children: React.ReactNode;
  Sidebar?: React.ReactNode;
  Navbar?: React.ReactNode;
  MobileSidebar?: React.ReactNode;
  MobileNavbar?: React.ReactNode;
}) {
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
  }, [data]);

  return (
    <>
      <CustomCursor />
      <div className="grid min-h-screen w-full">
        <div
          className={`grid ${Sidebar ? "grid-cols-[auto_1fr]" : "grid-cols-1"}`}
        >
          {/* Sidebar */}
          {Sidebar && (
            <aside className="h-screen sticky top-0 overflow-y-auto">
              {Sidebar}
            </aside>
          )}

          {/* Main content area */}
          <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <SidebarInset>
              <HeroHighlight>
                {/* Header */}
                <header className="sticky top-0 z-10 border-b">
                  <div
                    className={`flex justify-between items-center p-4 ${Sidebar ? "max-w-screen" : "w-screen"}`}
                  >
                    {Navbar && <>{Navbar}</>}
                    {isMobile && !isSidebar && MobileSidebar && (
                      <>{MobileSidebar}</>
                    )}
                  </div>
                </header>

                {/* Main content */}
                <main
                  className={`flex-1 p-4 overflow-x-hidden ${Sidebar ? "max-w-screen" : "w-screen"}`}
                >
                  {children}
                </main>

                {/* Footer */}
                <footer className="mt-auto border-t">
                  <div
                    className={`flex justify-center items-center p-4 ${Sidebar ? "max-w-screen" : "w-screen"}`}
                  >
                    <Footer />
                  </div>
                </footer>
              </HeroHighlight>
            </SidebarInset>
          </div>
        </div>
      </div>
    </>
  );
}
