"use client";

import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import {
  Chapter,
  Course,
  Option,
  Question,
  Quiz,
  Topic,
  UserProgress,
} from "@prisma/client";
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
import { CourseProgress } from "@/components/Course/course-progress";

interface CourseSidebarProps {
  course: Course & { progressCount: number } & {
    chapters: (Chapter & {
      topics: (Topic & {
        userProgress: UserProgress[] | null;
      })[];
      quiz: (Quiz & {
        quizProgress: UserProgress[] | null;
        questions: (Question & {
          answer: Option;
          options: Option[];
        })[];
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
            payment_status: "PAID",
            not_status: "DROPPED",
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
          "transition-all duration-300 ease-in w-100 min-w-[20rem]",
          collapsible && "h-100"
        )}
      >
        <SidebarHeader className="p-5 w-full">
          <h1 className="font-semibold">{course?.title}</h1>
          {data?.length !== 0 && !isNaN(course?.progressCount) && (
            <div className="mt-1">
              <CourseProgress
                variant={course?.progressCount === 100 ? "success" : "default"}
                value={course?.progressCount}
              />
            </div>
          )}
        </SidebarHeader>
        <SidebarContent className="w-full">
          <h1 className="font-semibold">Course content</h1>
          <SidebarMenu>
            {course?.chapters?.map((chapter, index) => {
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
                      index={index + 1}
                      key={chapter?.id}
                      id={chapter?.id}
                      activeChapter={activeChapter}
                      label={chapter?.title}
                      topics={chapter?.topics}
                      quiz={chapter?.quiz}
                      courseId={course?.id}
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
