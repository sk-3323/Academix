"use client";

import { Banner } from "@/components/banner";
import { ChapterActions } from "@/components/Chapter/chapter-actions";
import DescriptionForm from "@/components/Chapter/description-form";
import QuizForm from "@/components/Chapter/quiz-form";
import ResourceForm from "@/components/Chapter/resource-form";
import TitleForm from "@/components/Chapter/title-form";
import TopicsForm from "@/components/Chapter/topics-form";
import { IconBadge } from "@/components/icon-badge";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { clearChapterState, GetSingleChapterApi } from "@/store/chapter/slice";
import { clearQuizState } from "@/store/quiz/slice";
import { clearResourceState } from "@/store/resource/slice";
import { AppDispatch } from "@/store/store";
import { clearTopicState } from "@/store/topic/slice";
import {
  ArrowLeft,
  Brain,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["ChapterStore"]);

  useEffect(() => {
    dispatch(GetSingleChapterApi({ id: params?.chapterId }));
  }, []);

  const [chapterActions, setChapterActions] = useState({
    clearState: clearChapterState,
    callbackFunction: () => {},
  });

  useDynamicToast("ChapterStore", chapterActions);

  const [resourceActions, setResourceActions] = useState({
    clearState: clearResourceState,
    callbackFunction: () => {},
  });

  useDynamicToast("ResourceStore", resourceActions);

  const [topicActions, setTopicActions] = useState({
    clearState: clearTopicState,
    callbackFunction: () => {},
  });

  useDynamicToast("TopicStore", topicActions);

  const [quizActions, setQuizActions] = useState({
    clearState: clearQuizState,
    callbackFunction: () => {},
  });

  useDynamicToast("QuizStore", quizActions);

  const requiredFields = [
    singleData?.title,
    singleData?.description,
    singleData?.topics?.some((topic: any) => topic?.status === "PUBLISHED"),
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
          label=" This chapter is unpublished. It will not be visible in the course."
        />
      )}
      <div className="w-full p-6">
        <Link
          href={`/admin/courses/${params?.courseId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to course setup
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Chapter setup</h1>
            <span className="text-sm">
              Complete all fields {completionText}{" "}
            </span>
          </div>
          <ChapterActions
            disabled={!isComplete}
            courseId={params?.courseId}
            chapterId={params?.chapterId}
            status={singleData?.status}
            setActions={setChapterActions}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your chapter </h2>
            </div>
            <TitleForm
              initialData={{ title: singleData?.title }}
              chapterId={params?.chapterId}
              setActions={setChapterActions}
            />
            <DescriptionForm
              initialData={{
                description: singleData?.description,
                title: singleData?.title,
              }}
              chapterId={params?.chapterId}
              setActions={setChapterActions}
            />
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Brain} />
                <h2 className="text-xl">Quiz & Brainstorming</h2>
              </div>
              <QuizForm
                initialData={{ quiz: singleData?.quiz }}
                courseId={params?.courseId}
                chapterId={params?.chapterId}
                setActions={setQuizActions}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <TopicsForm
                initialData={{ topics: singleData?.topics }}
                courseId={params?.courseId}
                chapterId={params?.chapterId}
                setActions={setTopicActions}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <ResourceForm
                initialData={{ resources: singleData?.resources }}
                chapterId={params?.chapterId}
                setActions={setResourceActions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
