"use client";
import { LayoutContent } from "@/components/LayoutContent/LayoutContent";
import TeacherMobileMenu from "@/components/MobileMenu/teacher-mobile-menu";
import TeacherNavbar from "@/components/Navbar/teacher-navbar";
import { TeacherSidebar } from "@/components/Sidebar/teacher-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useRole } from "@/hooks/use-role";
import { GetCourseApi } from "@/store/course/slice";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar();

  const { role, status } = useRole();
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (role === undefined) {
      return;
    } else if (!["TEACHER", "ADMIN"].includes(role)) {
      router.push("/");
      toast.error("Only Teacher can access this route");
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(
        GetCourseApi({
          searchParams: {
            instructorId: session?.user?.id,
          },
        })
      );
    }
  }, [session?.user?.id]);
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
