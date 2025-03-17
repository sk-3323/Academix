"use client";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Course } from "../../../../types/allType";
import PageHeader from "@/components/LayoutContent/PageHeader";

const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: userData } = useSelector((state: any) => state.UserStore);
  console.log(userData);
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
  console.log(courseData);

  return (
    <div className="w-full p-10 min-h-screen my-10">
      <h1 className="font-bold text-2xl">
        Your <span className="text-[#27E0B3]">Courses</span>
      </h1>
      <div className="courses flex justify-center items-center">
        <HoverEffect items={courseData} />
      </div>
    </div>
  );
};

export default page;
