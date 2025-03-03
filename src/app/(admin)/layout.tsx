"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import AdminMobileMenu from "@/components/MobileMenu/admin-mobile-menu";
import AdminNavbar from "@/components/Navbar/admin-navbar";
import { AdminSidebar } from "@/components/Sidebar/admin-sidebar";
import Loading from "@/components/Sidebar/Loading";
import { useSidebar } from "@/components/ui/sidebar";
import { useRole } from "@/hooks/useRole";
import { AppDispatch } from "@/store/store";
import { GetUserApi } from "@/store/user/slice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();
  const { status } = useRole();

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(
      GetUserApi({
        searchParams: {},
      })
    );
  }, []);
  if (status === "loading") {
    return <Loading />;
  }
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
