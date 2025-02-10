"use client";

import DescriptionForm from "@/components/Topic/description-form";
import TitleForm from "@/components/Topic/title-form";
import TopicAccessForm from "@/components/Topic/topic-access-form";
import VideoForm from "@/components/Topic/video-form";
import { IconBadge } from "@/components/icon-badge";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { AppDispatch } from "@/store/store";
import { clearTopicState, GetSingleTopicApi } from "@/store/topic/slice";
import { Eye, LayoutDashboard, ListChecks, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = ({
  params,
}: {
  params: { courseId: string; chapterId: string; topicId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["TopicStore"]);

  useEffect(() => {
    dispatch(GetSingleTopicApi({ id: params?.topicId }));
  }, []);

  const [topicActions, setTopicActions] = useState({
    clearState: clearTopicState,
    callbackFunction: () => {},
  });

  useDynamicToast("TopicStore", topicActions);

  const requiredFields = [singleData?.title, singleData?.description];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Topic setup</h1>
          <span className="text-sm">Complete all fields {completionText} </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your topic </h2>
          </div>
          <TitleForm
            initialData={{ title: singleData?.title }}
            topicId={params?.topicId}
            setActions={setTopicActions}
          />
          <DescriptionForm
            initialData={{ description: singleData?.description }}
            topicId={params?.topicId}
            setActions={setTopicActions}
          />

          <div className="flex items-center gap-x-2 mt-6 ">
            <IconBadge icon={Eye} />
            <h2 className="text-xl">Access Settings</h2>
          </div>

          <TopicAccessForm
            initialData={{ isFree: singleData?.isFree }}
            topicId={params?.topicId}
            chapterId={params?.chapterId}
            setActions={setTopicActions}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add a video</h2>
            </div>

            <VideoForm
              initialData={{ video: singleData?.video }}
              topicId={params?.topicId}
              setActions={setTopicActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
