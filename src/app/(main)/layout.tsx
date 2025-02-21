"use client";

import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import Navbar from "@/components/Navbar/Navbar";
import { useSidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();

  const pathname = usePathname();

  if (pathname?.startsWith("/courses")) {
    return <>{children}</>;
  }

  return (
    <LayoutContent Navbar={<Navbar isMobile={isMobile} />}>
      {children}
    </LayoutContent>
  );
};

export default RootLayout;
