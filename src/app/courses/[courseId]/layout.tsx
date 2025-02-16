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

const courseIdLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);

  useEffect(() => {
    dispatch(
      GetSingleCourseWithProgressApi({
        id: params?.courseId,
      })
    );
  }, [params?.courseId]);

  // const [chapterActions, setChapterActions] = useState({
  //   clearState: clearChapterState,
  //   callbackFunction: () => {},
  // });

  // useDynamicToast("ChapterStore", chapterActions);
  const { isMobile } = useSidebar();
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {!isMobile && <CourseSidebar course={singleData} />}
      <div className="flex flex-col flex-1">
        <SidebarInset>
          <HeroHighlight>
            <div className="flex justify-between items-center p-4 border-b w-full">
              <CourseNavbar course={singleData} isMobile={isMobile} />
            </div>
            <div className="flex-1 p-4 overflow-x-hidden w-full">
              {children}
            </div>
          </HeroHighlight>
        </SidebarInset>
      </div>
    </div>
  );
};

export default courseIdLayout;
