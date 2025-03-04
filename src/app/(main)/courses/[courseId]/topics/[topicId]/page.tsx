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
import { IconBadge } from "@/components/icon-badge";
import Script from "next/script";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { clearEnrollmentState } from "@/store/enrollment/slice";
import { usePathname } from "next/navigation";
import CourseProgressButton from "../../_components/course-progress-button";
import { clearUserProgressState } from "@/store/user-progress/slice";
import { useConfetti } from "@/hooks/use-confetti";

const TopicIdPage = ({
  params,
}: {
  params: { courseId: string; topicId: string };
}) => {
  const { startConfetti, ConfettiComponent } = useConfetti();
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
      !topic?.userProgress?.[0]?.isCompleted;

    setIsCompleteOnEnd(flag);
  }, [topic?.userProgress, topic?.chapter?.course?.enrollments]);

  const [enrollmentActions, setEnrollmentActions] = useState({
    clearState: clearEnrollmentState,
    callbackFunction: () => {},
  });
  let pathname = usePathname();

  useDynamicToast("EnrollmentStore", enrollmentActions, pathname);

  const [userProgressActions, setUserProgressActions] = useState({
    clearState: clearUserProgressState,
    callbackFunction: () => {},
  });

  useDynamicToast("UserProgressStore", userProgressActions);

  return (
    <>
      <ConfettiComponent />
      {topic?.userProgress?.[0]?.isCompleted && (
        <Banner variant="success" label="You already completed this topic" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this topic"
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
            setActions={setUserProgressActions}
            startConfetti={startConfetti}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{topic?.title}</h2>
            {topic?.chapter?.course?.enrollments?.length !== 0 && (
              <CourseProgressButton
                topicId={params?.topicId}
                courseId={params?.courseId}
                nextTopicId={topic?.nextTopic?.id}
                isCompleted={!!topic?.userProgress?.[0]?.isCompleted}
                setActions={setUserProgressActions}
                startConfetti={startConfetti}
              />
            )}
            {topic?.chapter?.course?.enrollments?.length === 0 && (
              <CourseEnrollButton
                courseId={params?.courseId}
                isFree={topic?.chapter?.course?.isFree}
                price={topic?.chapter?.course?.price}
                setActions={setEnrollmentActions}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={topic?.description!} />
          </div>
          {!!topic?.chapter?.resources?.length && (
            <>
              <Separator />
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <Separator />
              <div className="p-4">
                <ResourceBar
                  resources={topic?.chapter?.resources}
                  isLocked={isLocked}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
};

export default TopicIdPage;
