"use client"
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChapterIdPage = ({
  params,
}: {
  params: { courseId: string; topicId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);

  useEffect(() => {
    dispatch(
      GetSingleCourseWithProgressApi({
        id: params?.courseId,
      })
    );
  }, [params?.courseId]);

  return <div>ChapterIdPage</div>;
};

export default ChapterIdPage;
