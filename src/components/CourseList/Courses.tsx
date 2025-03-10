import { useDispatch, useSelector } from "react-redux";
import { HoverEffect } from "../ui/card-hover-effect";
import { GetCourseApi } from "@/store/course/slice";
import { useEffect, useState } from "react";
import { AppDispatch } from "@/store/store";

const Courses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: courseData } = useSelector((state: any) => state.CourseStore);
  useEffect(() => {
    dispatch(GetCourseApi({ searchParams: {} }));
  }, []);

  return (
    <div className="w-full p-10 min-h-screen my-10">
      <h1 className="font-bold text-2xl">
        Offered <span className="text-[#27E0B3]">Courses</span>
      </h1>
      <div className="courses flex justify-center items-center">
        <HoverEffect items={courseData.slice(0, 6)} />
      </div>
    </div>
  );
};

export default Courses;
