"use client";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Course } from "../../../../types/allType";
import PageHeader from "@/components/LayoutContent/PageHeader";
import UserDashboard from "./dashboard";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: userData } = useSelector((state: any) => state.UserStore);
  const [courseData, setCourseData] = useState<Course[]>([]);

  useEffect(() => {
    if (userData) {
      getCourses();
    }
  }, [userData]);
  const getCourses = async () => {
    setCourseData(
      userData?.enrollments?.map((enroll: any) => {
        return enroll.course;
      })
    );
  };

  return (
    <div className="w-full min-h-screen my-10">
      <UserDashboard />
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <h1 className="text-3xl  font-bold tracking-tight">
          My <span className="text-[#27e0b3]">Enrolled Course</span>
        </h1>
        <div className="courses flex justify-center items-center">
          <HoverEffect items={courseData} />
        </div>
      </div>
    </div>
  );
};

export default page;
