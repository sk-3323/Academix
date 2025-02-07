"use client";

import DescriptionForm from "@/components/Course/description-form";
import TitleForm from "@/components/Course/title-form";
import { IconBadge } from "@/components/icon-badge";
import { GetSingleCourseApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);

  useEffect(() => {
    dispatch(GetSingleCourseApi({ id: params?.courseId }));
  }, []);

  const requiredFields = [
    singleData?.title,
    singleData?.description,
    singleData?.thumbnail,
    singleData?.price,
    singleData?.categoryId?.length !== 0,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm">Complete all fields {completionText}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm
            initialData={{ title: singleData?.title }}
            courseId={params?.courseId}
          />
          <DescriptionForm
            initialData={{ description: singleData?.description }}
            courseId={params?.courseId}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseIdPage;
