"use client";
import {
  GetSingleCourseApi,
  GetSingleCourseWithProgressApi,
} from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseSidebar from "./_components/course-sidebar";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import CourseNavbar from "./_components/course-navbar";
import { HeroHighlight } from "@/components/ui/hero-hightlight";
import { CustomCursor } from "@/components/CustomCursor/CustomCursor";

const courseIdLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);
  console.log(singleData);

  useEffect(() => {
    dispatch(
      GetSingleCourseWithProgressApi({
        id: params?.courseId,
      })
    );
  }, [params?.courseId]);

  const { isMobile } = useSidebar();
  return (
    <>
      <CustomCursor />
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {!isMobile && (
          <aside className="h-screen sticky top-0 overflow-y-auto min-w-[20rem]">
            <CourseSidebar course={singleData} />
          </aside>
        )}
        <div className="flex flex-col flex-1">
          <SidebarInset>
            <HeroHighlight>
              <header className="flex justify-between items-center p-4 border-b w-full">
                <CourseNavbar course={singleData} isMobile={isMobile} />
              </header>
              <main className="flex-1 p-4 overflow-x-hidden w-full">
                {children}
              </main>
            </HeroHighlight>
          </SidebarInset>
        </div>
      </div>
    </>
  );
};

export default courseIdLayout;
