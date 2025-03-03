"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  Enrollment,
  Option,
  Question,
  Quiz,
  QuizProgress,
  Topic,
  UserProgress,
} from "@prisma/client";
import { BrainCog, CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

interface CourseSideBarItemProps {
  id: string;
  index: number;
  label: string;
  courseId: string;
  activeChapter: string;
  enrollment: Enrollment[];
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
}

const CourseSideBarItem = ({
  id,
  index,
  label,
  courseId,
  activeChapter,
  enrollment,
  topics,
  quiz,
}: CourseSideBarItemProps) => {
  let pathname = usePathname();
  let router = useRouter();

  const onClick = (id: string) => {
    router.push(`/courses/${courseId}/topics/${id}`);
  };

  const onQuizClick = (id: string) => {
    router.push(`/courses/${courseId}/quiz/${id}`);
  };

  return (
    <AccordionItem value={id}>
      <AccordionTrigger
        className={cn("px-2", activeChapter === id && "font-semibold")}
      >
        {`${index}. ${label}`}
      </AccordionTrigger>
      {topics?.map((topic, i) => {
        let isCompleted = !!topic?.userProgress?.[0]?.isCompleted;
        let Icon =
          !topic?.isFree && enrollment?.length === 0
            ? Lock
            : isCompleted
              ? CheckCircle
              : PlayCircle;

        let isActive = pathname?.includes(topic?.id);

        return (
          <>
            <AccordionContent className="p-0 pb-1">
              <button
                onClick={() => onClick(topic?.id)}
                type="button"
                className={cn(
                  "flex items-center gap-x-2 text-sm font-[500] pl-2 transition-all w-full",
                  isActive &&
                    !isCompleted &&
                    " dark:bg-slate-200/20 border-r-4 bg-slate-600/20 dark:hover:bg-slate-200/20 dark:border-slate-300 border-slate-700",
                  isCompleted &&
                    !isActive &&
                    "text-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/40",
                  isActive &&
                    isCompleted &&
                    "text-emerald-500 bg-emerald-400/10 border-r-4 border-emerald-700",
                  !isActive &&
                    !isCompleted &&
                    "hover:bg-slate-600/20 dark:hover:bg-slate-300/20"
                )}
              >
                <div className="flex items-center gap-x-2 py-2 pl-4">
                  {`${index}.${i}`}
                  <Icon
                    size={22}
                    className={cn(
                      "ml-2",
                      !!topic?.userProgress?.[0]?.isCompleted &&
                        "text-emerald-500"
                    )}
                  />
                  {topic?.title}
                </div>
              </button>
            </AccordionContent>
          </>
        );
      })}
      {quiz?.map((qz, i) => {
        let isCompleted = !!qz?.completedBy?.[0]?.isCompleted;
        let Icon =
          enrollment?.length === 0
            ? Lock
            : isCompleted
              ? CheckCircle
              : BrainCog;

        let isActive = pathname?.includes(qz?.id);

        return (
          <>
            <AccordionContent className="p-0 pb-1">
              <button
                onClick={() => onQuizClick(qz?.id)}
                type="button"
                className={cn(
                  "flex items-center gap-x-2 text-sm font-[500] pl-2 transition-all w-full",
                  isActive &&
                    !isCompleted &&
                    " dark:bg-slate-200/20 border-r-4 bg-slate-600/20 dark:hover:bg-slate-200/20 dark:border-slate-300 border-slate-700",
                  isCompleted &&
                    !isActive &&
                    "text-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/40",
                  isActive &&
                    isCompleted &&
                    "text-emerald-500 bg-emerald-400/10 border-r-4 border-emerald-700",
                  !isActive &&
                    !isCompleted &&
                    "hover:bg-slate-600/20 dark:hover:bg-slate-300/20"
                )}
              >
                <div className="flex items-center gap-x-2 py-2 pl-4">
                  {`Q${index}.`}
                  <Icon
                    size={22}
                    className={cn(
                      "ml-2",
                      !!qz?.completedBy?.[0]?.isCompleted && "text-emerald-500"
                    )}
                  />
                  {qz?.title}
                </div>
              </button>
            </AccordionContent>
          </>
        );
      })}
    </AccordionItem>
  );
};

export default CourseSideBarItem;
