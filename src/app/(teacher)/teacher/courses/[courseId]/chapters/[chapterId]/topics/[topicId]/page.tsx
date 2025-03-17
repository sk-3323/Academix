"use client";

import DescriptionForm from "@/components/Topic/description-form";
import TitleForm from "@/components/Topic/title-form";
import TopicAccessForm from "@/components/Topic/topic-access-form";
import { TopicActions } from "@/components/Topic/topic-actions";
import VideoForm from "@/components/Topic/video-form";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { AppDispatch } from "@/store/store";
import { clearTopicState, GetSingleTopicApi } from "@/store/topic/slice";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  ListChecks,
  Video,
} from "lucide-react";
import Link from "next/link";
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

  const requiredFields = [
    singleData?.title,
    singleData?.description,
    singleData?.video,
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
          label=" This topic is unpublished. It will not be visible in the chapter. "
        />
      )}
      <div className="w-full p-6">
        <Link
          href={`/teacher/courses/${params?.courseId}/chapters/${params?.chapterId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to chapter setup
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Topic setup</h1>
            <span className="text-sm">
              Complete all fields {completionText}{" "}
            </span>
          </div>

          <TopicActions
            disabled={!isComplete}
            courseId={params?.courseId}
            chapterId={params?.chapterId}
            topicId={params?.topicId}
            status={singleData?.status}
            setActions={setTopicActions}
          />
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
                initialData={{
                  video: singleData?.video,
                  publicKey: singleData?.publicKey,
                  muxData: singleData?.muxData,
                }}
                topicId={params?.topicId}
                setActions={setTopicActions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
