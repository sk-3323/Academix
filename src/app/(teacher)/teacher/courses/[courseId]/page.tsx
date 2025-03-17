"use client";

import { Banner } from "@/components/banner";
import CategoryForm from "@/components/Course/category-form";
import ChaptersForm from "@/components/Course/chapters-form";
import CourseAccessForm from "@/components/Course/course-access-form";
import { CourseActions } from "@/components/Course/course-actions";
import DescriptionForm from "@/components/Course/description-form";
import PriceForm from "@/components/Course/price-form";
import ThumbnailForm from "@/components/Course/thumbnail-form";
import TitleForm from "@/components/Course/title-form";
import { IconBadge } from "@/components/icon-badge";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { GetCategoryApi } from "@/store/category/slice";
import { clearChapterState } from "@/store/chapter/slice";
import { clearCourseState, GetSingleCourseApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import {
  ArrowLeft,
  ChartBarStacked,
  CircleDollarSign,
  Eye,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CourseIdPage = ({ params }: { params: { courseId: string } }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);
  const { data } = useSelector((state: any) => state["CategoryStore"]);

  useEffect(() => {
    dispatch(GetSingleCourseApi({ id: params?.courseId }));
    dispatch(GetCategoryApi());
  }, []);

  const [courseActions, setCourseActions] = useState({
    clearState: clearCourseState,
    callbackFunction: () => {},
  });

  useDynamicToast("CourseStore", courseActions);

  const [chapterActions, setChapterActions] = useState({
    clearState: clearChapterState,
    callbackFunction: () => {},
  });

  useDynamicToast("ChapterStore", chapterActions);

  const requiredFields = [
    singleData?.title,
    singleData?.description,
    singleData?.thumbnail,
    singleData?.categoryId,
    singleData?.chapters?.some(
      (chapter: any) => chapter?.status === "PUBLISHED"
    ),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {singleData?.status && singleData?.status === "DRAFT" && (
        <Banner
          variant="warning"
          label=" This course is unpublished. It will not be visible to the students. "
        />
      )}
      <div className="w-full p-6">
        <Link
          href={`/teacher/courses`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to courses
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm">
              Complete all fields {completionText}{" "}
            </span>
          </div>
          <CourseActions
            disabled={!isComplete}
            courseId={params?.courseId}
            status={singleData?.status}
            setActions={setCourseActions}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course </h2>
            </div>
            <TitleForm
              initialData={{ title: singleData?.title }}
              courseId={params?.courseId}
              setActions={setCourseActions}
            />
            <DescriptionForm
              initialData={{
                description: singleData?.description,
                title: singleData?.title,
              }}
              courseId={params?.courseId}
              setActions={setCourseActions}
            />
            <ThumbnailForm
              initialData={{
                thumbnail: singleData?.thumbnail,
                publicKey: singleData?.publicKey,
              }}
              courseId={params?.courseId}
              setActions={setCourseActions}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChaptersForm
                initialData={{ chapters: singleData?.chapters }}
                courseId={params?.courseId}
                setActions={setChapterActions}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ChartBarStacked} />
                <h2 className="text-xl">Category</h2>
              </div>
              <CategoryForm
                initialData={{ categoryId: singleData?.categoryId }}
                courseId={params?.courseId}
                setActions={setCourseActions}
                options={data}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2 mt-6 ">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>

              <CourseAccessForm
                initialData={{ isFree: singleData?.isFree }}
                courseId={params?.courseId}
                setActions={setCourseActions}
              />
            </div>
            {!singleData?.isFree && (
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={CircleDollarSign} />
                  <h2 className="text-xl">Sell your course</h2>
                </div>
                <PriceForm
                  initialData={{ price: singleData?.price }}
                  courseId={params?.courseId}
                  setActions={setCourseActions}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
