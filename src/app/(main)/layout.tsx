"use client";

import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import Navbar from "@/components/Navbar/Navbar";
import { useSidebar } from "@/components/ui/sidebar";
import { GetHomeApi } from "@/store/home/slice";
import { AppDispatch } from "@/store/store";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();

  const pathname = usePathname();

  if (pathname?.startsWith("/courses")) {
    return <>{children}</>;
  }

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(GetHomeApi());
  }, []);

  return (
    <LayoutContent Navbar={<Navbar isMobile={isMobile} />}>
      {children}
    </LayoutContent>
  );
};

export default RootLayout;
