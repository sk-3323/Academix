"use client";

import { CourseCard } from "@/components/Course/course-card";
import { CourseWithProgressWithCategory } from "../../../../../types/Course";

interface CourseListProps {
  items: CourseWithProgressWithCategory[];
}

const CourseList = ({ items }: CourseListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ">
        {items?.map((item) => (
          <CourseCard
            key={item?.id}
            id={item?.id}
            title={item?.title}
            thumbnail={item?.thumbnail!}
            chaptersLength={item?.chapters?.length}
            price={item?.price!}
            isFree={item?.isFree!}
            progress={item?.progress}
            category={item?.category?.name!}
            instructor={item?.instructor}
          />
        ))}
      </div>
      {items?.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found.
        </div>
      )}
    </div>
  );
};

export default CourseList;
