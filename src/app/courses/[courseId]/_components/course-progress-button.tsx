"use client";

import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/store/store";
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
}

const CourseProgressButton = ({
  topicId,
  courseId,
  nextTopicId,
  isCompleted,
  setActions,
}: CourseProgressButtonProps) => {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async () => {
    if (!isCompleted && !nextTopicId) {
      //confetti
    }

    if (!isCompleted && nextTopicId) {
      router.push(`/courses/${courseId}/topics/${nextTopicId}`);
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
            courseId: courseId,
          },
          requiredFields: ["isCompleted", "courseId", "topicId"],
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      setIsLoading(true);
      throw error;
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
