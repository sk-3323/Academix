"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import TeacherMobileMenu from "@/components/MobileMenu/teacher-mobile-menu";
import TeacherNavbar from "@/components/Navbar/teacher-navbar";
import { TeacherSidebar } from "@/components/Sidebar/teacher-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();
  return (
    <LayoutContent
      Navbar={<TeacherNavbar isMobile={isMobile} />}
      Sidebar={<TeacherSidebar collapsible="icon"/>}
      MobileSidebar={<TeacherMobileMenu />}
    >
      {children}
    </LayoutContent>
  );
};

export default TeacherLayout;
