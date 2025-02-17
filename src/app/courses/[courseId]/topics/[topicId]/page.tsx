"use client";
import { Banner } from "@/components/banner";
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { GetPublishedTopicWithProgressApi } from "@/store/topic/slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "../../_components/video-player";
import { CourseEnrollButton } from "../../_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { File } from "lucide-react";
import { ResourceBar } from "../../_components/resource-bar";

const TopicIdPage = ({
  params,
}: {
  params: { courseId: string; topicId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: topic } = useSelector(
    (state: any) => state["TopicStore"]
  );

  useEffect(() => {
    dispatch(
      GetPublishedTopicWithProgressApi({
        courseId: params?.courseId,
        topicId: params?.topicId,
      })
    );
  }, [params?.courseId]);

  const [isLocked, setIsLocked] = useState(
    !topic?.isFree && topic?.chapter?.course?.enrollments?.length === 0
  );

  useEffect(() => {
    let flag =
      !topic?.isFree && topic?.chapter?.course?.enrollments?.length === 0;

    setIsLocked(flag);
  }, [topic?.isFree, topic?.chapter?.course?.enrollments]);

  const [isCompleteOnEnd, setIsCompleteOnEnd] = useState(
    topic?.chapter?.course?.enrollments?.length !== 0 &&
      topic?.userProgress?.length === 0
  );

  useEffect(() => {
    let flag =
      topic?.chapter?.course?.enrollments?.length !== 0 &&
      topic?.userProgress?.length === 0;

    setIsCompleteOnEnd(flag);
  }, [topic?.userProgress, topic?.chapter?.course?.enrollments]);

  return (
    <>
      {topic?.userProgress?.[0]?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter"
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-2">
          <VideoPlayer
            topicId={params?.topicId}
            nextTopicId={topic?.nextTopic?.id}
            playbackId={topic?.muxData?.playbackId!}
            isLocked={isLocked}
            isCompleteOnEnd={isCompleteOnEnd}
            courseId={params?.courseId}
            title={topic?.title}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{topic?.title}</h2>
            {topic?.chapter?.course?.enrollments?.length !== 0 ? (
              <></>
            ) : (
              <CourseEnrollButton
                courseId={params?.courseId}
                price={topic?.chapter?.course?.price}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={topic?.description!} />
          </div>
          {topic?.chapter?.resources?.length && (
            <>
              <Separator />
              <div className="p-4">
                <ResourceBar resources={topic?.chapter?.resources} isLocked={isLocked} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TopicIdPage;
