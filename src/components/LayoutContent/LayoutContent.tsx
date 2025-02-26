"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { ResponsiveSidebarWithAutoOpen } from "@/components/Sidebar/AppSidebar";
import { HeroHighlight } from "@/components/ui/hero-hightlight";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import Footer from "@/components/Footer/Footer";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";
import { signOut, useSession } from "next-auth/react";
import React, { useCallback, useEffect } from "react";
import Loading from "../Sidebar/Loading";
import { APIClient } from "@/helpers/apiHelper";

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
  const { isMobile } = useSidebar();
  const [isSidebar, setIsSidebar] = React.useState(false);
  const data = useSession();
  // const router = useRouter();

  const getUser = useCallback(async () => {
    const id = data.data?.user.id;
    try {
      const api = new APIClient();
      const res = await api.get(`/users/${id}`);
      const data = res.result;
      if (data.isBlocked) {
        await signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (data.data?.user == null || data.status == "unauthenticated") {
      setIsSidebar(false);
    } else {
      setIsSidebar(true);
    }
    getUser();
  }, [data]);
  console.log(data);

  if (data.status === "loading") {
    return <Loading />;
  }

  return (
    <>
      <CustomCursor />
      <div className="grid min-h-screen w-full">
        <div
          className={`grid ${isSidebar ? "grid-cols-[auto_1fr]" : "grid-cols-1"}`}
        >
          {/* Sidebar */}
          {isSidebar && (
            <aside className="h-screen sticky top-0 overflow-y-auto">
              {Sidebar}
            </aside>
          )}

          {/* Main content area */}
          <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
            <SidebarInset>
              <HeroHighlight>
                {/* Header */}
                {Navbar && (
                  <header className="sticky top-0 border-b bg-zinc-100/95 dark:bg-zinc-900/95 z-30">
                    <div
                      className={`flex justify-between items-center p-4 ${isSidebar ? "max-w-full" : "w-full"}`}
                    >
                      {isMobile && MobileSidebar && <>{MobileSidebar}</>}
                      {Navbar}
                    </div>
                  </header>
                )}

                {/* Main content */}
                <main
                  className={`flex-1 p-4 overflow-x-hidden ${isSidebar ? "max-w-full" : "w-full"}`}
                >
                  {children}
                </main>

                {/* Footer */}
                {Navbar && <Footer Sidebar={Sidebar} />}
              </HeroHighlight>
            </SidebarInset>
          </div>
        </div>
      </div>
    </>
  );
}
