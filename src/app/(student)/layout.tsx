"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import StudentMobileMenu from "@/components/MobileMenu/student-mobile-menu";
import StudentNavbar from "@/components/Navbar/student-navbar";
import { StudentSidebar } from "@/components/Sidebar/student-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import React from "react";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();
  return (
    <LayoutContent
      Navbar={<StudentNavbar isMobile={isMobile} />}
      Sidebar={<StudentSidebar collapsible="icon" />}
      MobileSidebar={<StudentMobileMenu />}
    >
      {" "}
      {children}{" "}
    </LayoutContent>
  );
};

export default StudentLayout;
