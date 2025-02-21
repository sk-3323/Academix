"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import AdminMobileMenu from "@/components/MobileMenu/admin-mobile-menu";
import AdminNavbar from "@/components/Navbar/admin-navbar";
import { AdminSidebar } from "@/components/Sidebar/admin-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();
  return (
    <LayoutContent
      Navbar={<AdminNavbar isMobile={isMobile} />}
      Sidebar={<AdminSidebar collapsible="icon" />}
      MobileSidebar={<AdminMobileMenu />}
    >
      {children}
    </LayoutContent>
  );
};

export default AdminLayout;
