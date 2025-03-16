"use client";

import { useSession } from "next-auth/react";
import { AdminSidebar } from "./admin-sidebar";
import { useEffect, useState } from "react";
import { TeacherSidebar } from "./teacher-sidebar";
import { StudentSidebar } from "./student-sidebar";
import { useRouter } from "next/navigation";

export function ResponsiveSidebarWithAutoOpen() {
  const router = useRouter();
  const data = useSession();
  const [role, setRole] = useState("");
  useEffect(() => {
    if (data.data?.user) {
      setRole(data?.data?.user.role);
    } else {
      setRole("");
    }
  }, [data]);

  useEffect(() => {
    if (data.status === "authenticated") {
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "TEACHER") {
        router.push("/teacher/dashboard");
      }
      //  else {
      //   router.push("/student/dashboard");
      // }
    } else if (data.status === "unauthenticated") {
      router.push("/");
    }
  }, [role]);

  return (
    <>
      {role === "TEACHER" ? (
        <TeacherSidebar />
      ) : role === "ADMIN" ? (
        <AdminSidebar />
      ) : (
        ""
      )}

      {/* : (
         <StudentSidebar />
       )} */}
    </>
  );
}
