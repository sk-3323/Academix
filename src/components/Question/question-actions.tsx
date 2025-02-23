"use client";

import React, { memo, useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { ConfirmModal } from "../Modals/confirm-modal";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import {
  ChangeQuestionStatusApi,
  DeleteQuestionApi,
  GetSingleQuestionApi,
} from "@/store/question/slice";

interface QuestionActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  quizId: string;
  questionId: string;
  status: string;
  setActions: any;
}

const QuestionActions = ({
  disabled,
  courseId,
  chapterId,
  quizId,
  questionId,
  status,
  setActions,
}: QuestionActionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteSuccess = async () => {
    router.push(
      `/teacher/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}`
    );
  };

  const handleStatusChangeSuccess = async () => {
    await dispatch(GetSingleQuestionApi({ id: questionId }));
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      setActions((current: any) => {
        return { ...current, callbackFunction: handleDeleteSuccess };
      });

      await dispatch(
        DeleteQuestionApi({
          id: questionId,
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async (status: string) => {
    try {
      setIsLoading(true);

      setActions((current: any) => {
        return { ...current, callbackFunction: handleStatusChangeSuccess };
      });

      await dispatch(
        ChangeQuestionStatusApi({
          id: questionId,
          values: {
            status: status,
          },
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => onClick(status === "DRAFT" ? "PUBLISHED" : "DRAFT")}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {status === "DRAFT" ? "Publish" : "Unpublish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default memo(QuestionActions);
