"use client";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import { DownloadIcon, Loader2, Lock } from "lucide-react";
import React, { useState } from "react";

interface VideoPlayerProps {
  topicId: string;
  nextTopicId: string;
  playbackId: string;
  courseId: string;
  title: string;
  isLocked: boolean;
  isCompleteOnEnd: boolean;
}

const VideoPlayer = ({
  topicId,
  nextTopicId,
  playbackId,
  courseId,
  title,
  isLocked,
  isCompleteOnEnd,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

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
            onEnded={() => {}}
            autoPlay
            playbackId={playbackId}
          />
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
