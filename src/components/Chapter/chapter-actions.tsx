"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { ConfirmModal } from "../Modals/confirm-modal";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  ChangeChapterStatusApi,
  DeleteChapterApi,
  GetSingleChapterApi,
} from "@/store/chapter/slice";
import { useRouter } from "next/navigation";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  status: string;
  setActions: any;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  status,
  setActions,
}: ChapterActionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteSuccess = async () => {
    router.push(`/teacher/courses/${courseId}`);
  };

  const handleStatusChangeSuccess = async () => {
    await dispatch(GetSingleChapterApi({ id: chapterId }));
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      setActions((current: any) => {
        return { ...current, callbackFunction: handleDeleteSuccess };
      });

      await dispatch(
        DeleteChapterApi({
          id: chapterId,
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
        ChangeChapterStatusApi({
          id: chapterId,
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
