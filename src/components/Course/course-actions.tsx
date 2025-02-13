"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { ConfirmModal } from "../Modals/confirm-modal";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  ChangeCourseStatusApi,
  DeleteCourseApi,
  GetSingleCourseApi,
} from "@/store/course/slice";
import { useRouter } from "next/navigation";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  status: string;
  setActions: any;
}

export const CourseActions = ({
  disabled,
  courseId,
  status,
  setActions,
}: CourseActionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteSuccess = async () => {
    router.push(`/teacher/courses`);
  };

  const handleStatusChangeSuccess = async () => {
    await dispatch(GetSingleCourseApi({ id: courseId }));
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      setActions((current: any) => {
        return { ...current, callbackFunction: handleDeleteSuccess };
      });

      await dispatch(
        DeleteCourseApi({
          id: courseId,
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
        ChangeCourseStatusApi({
          id: courseId,
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
