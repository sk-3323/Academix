"use client";

import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import {
  Chapter,
  Course,
  Option,
  Question,
  Quiz,
  QuizProgress,
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
        completedBy: QuizProgress[] | null;
        questions: (Question & {
          answer: Option;
          options: Option[];
        })[];
      })[];
    })[];
  };
}

const CourseSidebar = ({ course }: CourseSidebarProps) => {
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
        collapsible={"none"}
        className={cn(
          "transition-all duration-300 ease-in w-100 min-w-[20rem] fixed top-0 left-0"
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
              let activeTopic = chapter.topics.some((topic) =>
                pathname?.includes(topic.id)
              );
              let activeQuiz = chapter.quiz.some((qz) =>
                pathname?.includes(qz.id)
              );

              let activeChapter = activeTopic || activeQuiz ? chapter?.id : "";

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
