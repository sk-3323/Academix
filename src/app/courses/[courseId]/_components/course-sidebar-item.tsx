"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Enrollment, Topic, UserProgress } from "@prisma/client";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSideBarItemProps {
  id: string;
  label: string;
  courseId: string;
  progressCount: number;
  enrollment: Enrollment[];
  topics: (Topic & {
    userProgress: UserProgress[] | null;
  })[];
}

const CourseSideBarItem = ({
  id,
  label,
  courseId,
  progressCount,
  enrollment,
  topics,
}: CourseSideBarItemProps) => {
  let pathname = usePathname();
  let router = useRouter();

  let isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <AccordionItem value={id}>
      <AccordionTrigger>{label}</AccordionTrigger>
      {topics?.map((topic) => {
        let Icon =
          !topic?.isFree && !enrollment
            ? Lock
            : !!topic?.userProgress?.[0]?.isCompleted
              ? CheckCircle
              : PlayCircle;
        return (
          <>
            <AccordionContent className="p-0 pb-1">
              <button
                onClick={onClick}
                type="button"
                className={cn(
                  "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-2 transition-all hover:text-slate-600 hover:bg-slate-300/20 w-full",
                  isActive &&
                    "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
                  !!topic?.userProgress?.[0]?.isCompleted &&
                    "text-emerald-700 hover:text-emerald-700",
                  isActive &&
                    !!topic?.userProgress?.[0]?.isCompleted &&
                    "bg-emerald-200/20"
                )}
              >
                <div className="flex items-center gap-x-2 py-2">
                  <Icon
                    size={22}
                    className={cn(
                      "text-slate-500",
                      isActive && "text-slate-700",
                      !!topic?.userProgress?.[0]?.isCompleted &&
                        "text-emerald-700"
                    )}
                  />
                  {topic?.title}
                </div>
                <div
                  className={cn(
                    "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
                    isActive && "opacity-100",
                    !!topic?.userProgress?.[0]?.isCompleted &&
                      "border-emerald-700"
                  )}
                ></div>
              </button>
            </AccordionContent>
          </>
        );
      })}
    </AccordionItem>
  );
};

export default CourseSideBarItem;
