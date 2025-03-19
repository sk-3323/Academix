"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import StudentMobileMenu from "@/components/MobileMenu/student-mobile-menu";
import StudentNavbar from "@/components/Navbar/student-navbar";
import { StudentSidebar } from "@/components/Sidebar/student-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useRole } from "@/hooks/use-role";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();

  const { role, status } = useRole();
  const router = useRouter();
  useEffect(() => {
    if (role === undefined) {
      return;
    } else if (!["STUDENT", "ADMIN"].includes(role)) {
      router.push("/");
      toast.error("Only Student can access this route");
    }
  }, [status]);

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
