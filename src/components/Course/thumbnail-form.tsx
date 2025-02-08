"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import {
  AddCourseApi,
  clearCourseState,
  EditCourseApi,
  GetCourseApi,
  GetSingleCourseApi,
} from "@/store/course/slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "../file-upload";

type CourseFormValues = Pick<Course, "thumbnail">;

interface ThumbnailFormProps {
  initialData: CourseFormValues;
  courseId: string;
  setActions: any;
}

const formSchema = z.object({
  thumbnail: z.string().min(1, {
    message: "Thumbnail is required",
  }),
});

const ThumbnailForm = ({
  initialData,
  courseId,
  setActions,
}: ThumbnailFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnail: initialData?.thumbnail || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        thumbnail: initialData?.thumbnail || "",
      });
    }
  }, [initialData?.thumbnail]);

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    form.setValue("thumbnail", initialData?.thumbnail || "");
    setIsEditing((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleCourseApi({ id: courseId }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formdata = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        formdata.append(key, val);
      });

      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        EditCourseApi({
          id: courseId,
          formdata: formdata,
          requiredFields: ["thumbnail"],
        })
      );

      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="font-medium flex items-center justify-between mb-2">
        Course Thumbnail
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
          className="hover:bg-[#a1a1aa]"
        >
          {isEditing && <>Cancel</>}{" "}
          {!isEditing && initialData?.thumbnail && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Thumbnail
            </>
          )}
          {!isEditing && !initialData?.thumbnail && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Thumbnail
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.thumbnail ? (
          <div className="flex items-center justify-center h-60 bg-slate-300 dark:bg-gray-500 rounded-md">
            <ImageIcon className="h-10 w-10" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData?.thumbnail}
            />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseThumbnail"
            onChange={(url) => {
              if (url) {
                onSubmit({ thumbnail: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 italic">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ThumbnailForm);
