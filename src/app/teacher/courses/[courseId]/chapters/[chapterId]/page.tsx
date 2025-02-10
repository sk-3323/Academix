"use client";

import DescriptionForm from "@/components/Chapter/description-form";
import TitleForm from "@/components/Chapter/title-form";
import TopicsForm from "@/components/Chapter/topics-form";
import { IconBadge } from "@/components/icon-badge";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { clearChapterState, GetSingleChapterApi } from "@/store/chapter/slice";
import { AppDispatch } from "@/store/store";
import { clearTopicState } from "@/store/topic/slice";
import { LayoutDashboard, ListChecks } from "lucide-react";
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

  const [topicActions, setTopicActions] = useState({
    clearState: clearTopicState,
    callbackFunction: () => {},
  });

  useDynamicToast("TopicStore", topicActions);

  const requiredFields = [
    singleData?.title,
    singleData?.description,
    singleData?.topics?.some((topic: any) => topic?.status === "PUBLISHED"),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Chapter setup</h1>
          <span className="text-sm">Complete all fields {completionText} </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
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
            initialData={{ description: singleData?.description }}
            chapterId={params?.chapterId}
            setActions={setChapterActions}
          />
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
        </div>
      </div>
    </div>
  );
};

export default page;
