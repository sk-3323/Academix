"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import TeacherMobileMenu from "@/components/MobileMenu/teacher-mobile-menu";
import TeacherNavbar from "@/components/Navbar/teacher-navbar";
import { TeacherSidebar } from "@/components/Sidebar/teacher-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useRole } from "@/hooks/use-role";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();
  // const pathname = usePathname();
  const { role, status } = useRole();
  const router = useRouter();
  useEffect(() => {
    if (role === undefined) {
      return;
    } else if (role !== "TEACHER") {
      router.back();
      toast.error("You can not access Teacher Route")
    }
  }, [status]);
  return (
    <LayoutContent
      Navbar={<TeacherNavbar isMobile={isMobile} />}
      Sidebar={<TeacherSidebar collapsible="icon" />}
      MobileSidebar={<TeacherMobileMenu />}
    >
      {children}
    </LayoutContent>
  );
};

export default TeacherLayout;
