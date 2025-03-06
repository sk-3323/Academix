"use client";

import { Button } from "@/components/ui/button";
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { GetPublishedTopicWithProgressApi } from "@/store/topic/slice";
import { AddUserProgressApi } from "@/store/user-progress/slice";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface CourseProgressButtonProps {
  topicId: string;
  courseId: string;
  setActions: any;
  nextTopicId?: string;
  isCompleted?: boolean;
  startConfetti: any;
  nextType: string;
}

const CourseProgressButton = ({
  topicId,
  courseId,
  nextTopicId,
  isCompleted,
  setActions,
  startConfetti,
  nextType,
}: CourseProgressButtonProps) => {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async () => {
    try {
      dispatch(
        GetSingleCourseWithProgressApi({
          id: courseId,
        })
      );

      if (!isCompleted && !nextTopicId) {
        startConfetti();
      }

      if (!isCompleted && nextTopicId) {
        if (nextType === "TOPIC") {
          router.push(`/courses/${courseId}/topics/${nextTopicId}`);
        } else if (nextType === "QUIZ") {
          router.push(`/courses/${courseId}/quiz/${nextTopicId}`);
        }
      } else {
        dispatch(
          GetPublishedTopicWithProgressApi({
            courseId: courseId,
            topicId: topicId,
          })
        );
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    }
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);

      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        AddUserProgressApi({
          values: {
            isCompleted: !isCompleted,
            topicId: topicId,
          },
          requiredFields: ["isCompleted", "topicId"],
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isCompleted ? "Not Completed" : "Mark as complete"}
      <Icon className="w-4 h-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
