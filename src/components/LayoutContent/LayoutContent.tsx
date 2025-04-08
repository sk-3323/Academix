"use client";

import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { HeroHighlight } from "@/components/ui/hero-hightlight";
import Footer from "@/components/Footer/Footer";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";
import { signOut, useSession } from "next-auth/react";
import React, { useCallback, useEffect } from "react";
import Loading from "../Sidebar/Loading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { GetSingleUserApi } from "@/store/user/slice";

export function LayoutContent({
  children,
  Sidebar,
  Navbar,
  MobileSidebar,
}: {
  children: React.ReactNode;
  Sidebar?: React.ReactNode;
  Navbar?: React.ReactNode;
  MobileSidebar?: React.ReactNode;
}) {
  const { isMobile } = useSidebar();
  const [isSidebar, setIsSidebar] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: any) => state["UserStore"]);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(
        GetSingleUserApi({
          id: session?.user?.id,
        })
      );
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user == null || data?.status === false) {
      setIsSidebar(false);
      if (data?.isBlocked) {
        signOut({ callbackUrl: "/" });
      }
    } else {
      setIsSidebar(true);
    }
  }, [session?.user, data?.status, data?.isBlocked]);

  if (loading) {
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
