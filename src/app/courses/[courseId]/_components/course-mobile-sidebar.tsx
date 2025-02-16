"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Chapter, Course, Topic, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import CourseSidebar from "./course-sidebar";

interface CourseSidebarProps {
  course: Course & { progressCount: number } & {
    chapters: (Chapter & {
      topics: (Topic & {
        userProgress: UserProgress[] | null;
      })[];
    })[];
  };
}

const CourseMobileSidebar = ({ course }: CourseSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
        <SheetContent side="left" className="p-0 w-72 bg-white">
          <CourseSidebar course={course} />
        </SheetContent>
      </SheetTrigger>
    </Sheet>
  );
};

export default CourseMobileSidebar;
