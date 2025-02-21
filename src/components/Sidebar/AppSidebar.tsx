"use client";

import { useSession } from "next-auth/react";
import { AdminSidebar } from "./AdminSidebar";
import { useEffect, useState } from "react";
import { TeacherSidebar } from "./TeacherSidebar";
import { StudentSidebar } from "./StudentSidebar";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./Loading";

export function ResponsiveSidebarWithAutoOpen() {
  const router = useRouter();
  const { data, status } = useSession();
  const [role, setRole] = useState<string | null | undefined>(null); // Store role state
  const currentPath = usePathname();
  useEffect(() => {
    if (status === "authenticated") {
      const userRole = data?.user.role;
      setRole(userRole);

      // Get current path

      // Check if user is already in their role's section
      const isInAdminSection = currentPath.startsWith("/admin/");
      const isInTeacherSection = currentPath.startsWith("/teacher/");
      const isInStudentSection = currentPath.startsWith("/student/");

      // Only redirect if user is on an unauthorized path
      if (currentPath === "/" || currentPath === "/login") {
        if (userRole === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (userRole === "TEACHER") {
          router.push("/teacher/dashboard");
        } else {
          router.push("/student/dashboard");
        }
      } else {
        // Check if user is trying to access unauthorized sections
        if (
          (userRole !== "ADMIN" && isInAdminSection) ||
          (userRole !== "TEACHER" && isInTeacherSection) ||
          (userRole !== "STUDENT" && isInStudentSection)
        ) {
          // Redirect to appropriate dashboard if in wrong section
          if (userRole === "ADMIN") {
            router.push("/admin/dashboard");
          } else if (userRole === "TEACHER") {
            router.push("/teacher/dashboard");
          } else {
            router.push("/student/dashboard");
          }
        }
      }
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [data, status, currentPath]);

  // Render the corresponding sidebar based on the user's role
  if (!role) return null; // Return nothing while the role is not determined yet

  return (
    <>
      {role === "TEACHER" ? (
        <TeacherSidebar />
      ) : role === "ADMIN" ? (
        <AdminSidebar />
      ) : (
        <StudentSidebar />
      )}
    </>
  );
}
