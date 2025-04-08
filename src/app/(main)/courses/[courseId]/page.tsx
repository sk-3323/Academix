"use client";
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const courseIdPage = ({ params }: { params: { courseId: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);

  useEffect(() => {
    dispatch(
      GetSingleCourseWithProgressApi({
        id: params?.courseId,
      })
    );
  }, [params?.courseId]);

  if (params?.courseId && singleData?.chapters?.[0]?.topics?.[0]?.id) {
    return redirect(
      `/courses/${params?.courseId}/topics/${singleData?.chapters?.[0]?.topics?.[0]?.id}`
    );
  }
};

export default courseIdPage;
