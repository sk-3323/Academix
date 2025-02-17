"use client";

import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { Chapter, Course, Topic, UserProgress } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface CourseSidebarProps {
  course: Course & { progressCount: number } & {
    chapters: (Chapter & {
      topics: (Topic & {
        userProgress: UserProgress[] | null;
      })[];
    })[];
  };
  collapsible?: "icon" | "none";
}

const CourseSidebar = ({
  course,
  collapsible = "icon",
}: CourseSidebarProps) => {
  const pathname = usePathname();
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
        collapsible={collapsible}
        className={cn(
          "transition-all duration-300 ease-in",
          collapsible && "h-100"
        )}
      >
        <SidebarHeader className="p-5">
          <h1 className="font-semibold">{course?.title}</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {course?.chapters?.map((chapter) => {
              let activeChapter = chapter.topics.some((topic) =>
                pathname?.includes(topic.id)
              )
                ? chapter?.id
                : "";

              return (
                <SidebarMenuItem key={chapter?.id}>
                  <Accordion
                    type="single"
                    defaultValue={activeChapter}
                    collapsible
                    className="w-full"
                  >
                    <CourseSideBarItem
                      key={chapter?.id}
                      id={chapter?.id}
                      activeChapter={activeChapter}
                      label={chapter?.title}
                      topics={chapter?.topics}
                      courseId={course?.id}
                      progressCount={course?.progressCount}
                      enrollment={data}
                    />
                  </Accordion>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};

export default CourseSidebar;
