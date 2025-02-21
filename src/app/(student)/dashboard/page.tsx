"use client";
import React, { useEffect } from "react";
import { UserCard } from "./_components/user-card";
import { CheckCircle, Clock, Star } from "lucide-react";
import { InfoCard } from "./_components/info-card";
import CourseList from "../search/_components/course-list";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { GetCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";

const StudentDashboardpage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: courseData } = useSelector(
    (state: any) => state["CourseStore"]
  );

  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user?.id) {
      dispatch(
        GetCourseWithProgressApi({
          userId: `${session?.user?.id}`,
          requiredFields: ["userId"],
        })
      );
    }
  }, [session?.user?.id]);

  return (
    <div className="p-6 space-y-4 container">
      <div className="flex flex-col mb-6 md:gap-1 items-center sm:items-start">
        <h1 className="text-lg font-semibold sm:text-xl md:text-2xl sm:font-bold">
          Welcome back Rishi Gaiwala
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Take a look your learning progress for Today{" "}
          {new Date(Date.now()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="bg-slate-100 dark:bg-gray-800 shadow-md border rounded-3xl overflow-hidden">
        <UserCard />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
          <InfoCard
            icon={Clock}
            label="In Progress"
            numberOfItems={1}
            nameOfItems={"Courses"}
          />
          <InfoCard
            icon={CheckCircle}
            label="Completed"
            numberOfItems={1}
            nameOfItems={"Courses"}
          />
          <InfoCard
            icon={Star}
            label="Points"
            numberOfItems={2}
            nameOfItems={"XP"}
          />
        </div>
      </div>
      <div className="bg-slate-100 dark:bg-gray-800 border rounded-3xl overflow-hidden p-5">
        <CourseList items={courseData} />
      </div>
    </div>
  );
};

export default StudentDashboardpage;
