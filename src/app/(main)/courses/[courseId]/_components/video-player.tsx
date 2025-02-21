"use client";
import { cn } from "@/lib/utils";
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { AddUserProgressApi } from "@/store/user-progress/slice";
import MuxPlayer from "@mux/mux-player-react";
import { DownloadIcon, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface VideoPlayerProps {
  topicId: string;
  nextTopicId: string;
  playbackId: string;
  courseId: string;
  title: string;
  isLocked: boolean;
  isCompleteOnEnd: boolean;
  setActions: any;
  startConfetti: any;
}

const VideoPlayer = ({
  topicId,
  nextTopicId,
  playbackId,
  courseId,
  title,
  isLocked,
  isCompleteOnEnd,
  setActions,
  startConfetti,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSuccess = async () => {
    try {
      dispatch(
        GetSingleCourseWithProgressApi({
          id: courseId,
        })
      );

      if (!nextTopicId) {
        startConfetti();
      }

      if (nextTopicId) {
        router.push(`/courses/${courseId}/topics/${nextTopicId}`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    }
  };

  const onEnd = async () => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });
      if (isCompleteOnEnd) {
        await dispatch(
          AddUserProgressApi({
            values: {
              isCompleted: true,
              topicId: topicId,
            },
            requiredFields: ["isCompleted", "topicId"],
          })
        );
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center flex-col gap-y-2 bg-slate-200 dark:bg-slate-700">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This Topic is Locked</p>
        </div>
      )}
      {!isLocked && (
        <>
          <MuxPlayer
            title={title}
            className={cn(!isReady && "hidden")}
            onCanPlay={() => setIsReady(true)}
            onEnded={onEnd}
            autoPlay
            playbackId={playbackId}
          />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
