"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import AdminMobileMenu from "@/components/MobileMenu/admin-mobile-menu";
import AdminNavbar from "@/components/Navbar/admin-navbar";
import { AdminSidebar } from "@/components/Sidebar/admin-sidebar";
import Loading from "@/components/Sidebar/Loading";
import { useSidebar } from "@/components/ui/sidebar";
import { useRole } from "@/hooks/use-role";
import { AppDispatch } from "@/store/store";
import { GetUserApi } from "@/store/user/slice";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();
  // const pathname = usePathname();
  const { role, status } = useRole();
  const router = useRouter();
  useEffect(() => {
    if (role === undefined) {
      return;
    } else if (role !== "ADMIN") {
      router.push("/");
      toast.error("You can not access Admin Route");
    }
  }, [status]);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(
      GetUserApi({
        searchParams: {},
      })
    );
  }, []);

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
