"use client";

import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { Chapter, Course, Topic, UserProgress } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CourseSideBarItem from "./course-sidebar-item";
import { Accordion } from "@radix-ui/react-accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

interface CourseSidebarProps {
  course: Course & { progressCount: number } & {
    chapters: (Chapter & {
      topics: (Topic & {
        userProgress: UserProgress[] | null;
      })[];
    })[];
  };
}

const CourseSidebar = ({ course }: CourseSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { data } = useSelector((state: any) => state["EnrollmentStore"]);

  useEffect(() => {
    if (course?.id && session?.user?.id) {
      dispatch(
        GetEnrollmentApi({
          searchParams: {
            courseId: course?.id,
            userId: session?.user?.id,
          },
        })
      );
    }
  }, [course?.id, session?.user?.id]);

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        className="transition-all duration-300 ease-in"
      >
        <SidebarHeader className="p-5">
          <h1 className="font-semibold">{course?.title}</h1>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {course?.chapters?.map((chapter) => (
              <SidebarMenuItem key={chapter?.id}>
                <Accordion type="single" collapsible className="w-full">
                  <CourseSideBarItem
                    key={chapter?.id}
                    id={chapter?.id}
                    label={chapter?.title}
                    courseId={chapter?.id}
                    topics={chapter?.topics}
                    progressCount={course?.progressCount}
                    enrollment={data}
                  />
                </Accordion>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {/* <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
          <div className="p-8 flex flex-col border-b">
            <h1 className="font-semibold">{course?.title}</h1>
          </div>
          <div className="w-full flex flex-col">
            {course?.chapters?.map((chapter) => (
              <Accordion type="single" collapsible className="w-full">
                <CourseSideBarItem
                  key={chapter?.id}
                  id={chapter?.id}
                  label={chapter?.title}
                  courseId={chapter?.id}
                  topics={chapter?.topics}
                  progressCount={course?.progressCount}
                  enrollment={data}
                />
              </Accordion>
            ))}
          </div>
        </div> */}
      </Sidebar>
    </TooltipProvider>
  );
};

export default CourseSidebar;
