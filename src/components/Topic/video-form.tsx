"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { muxData, Topic } from "@prisma/client";
import { FileUpload } from "../file-upload";
import { EditTopicApi, GetSingleTopicApi } from "@/store/topic/slice";

type TopicFormValues = Pick<Topic, "video">;

interface VideoFormProps {
  initialData: TopicFormValues & { muxData?: muxData };
  // initialData: TopicFormValues & { muxData: muxData };
  topicId: string;
  setActions: any;
}

const formSchema = z.object({
  video: z.string().min(1, {
    message: "Video is required",
  }),
});

const VideoForm = ({ initialData, topicId, setActions }: VideoFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      video: initialData?.video || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        video: initialData?.video || "",
      });
    }
  }, [initialData?.video]);

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    form.setValue("video", initialData?.video || "");
    setIsEditing((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleTopicApi({ id: topicId }));
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
        EditTopicApi({
          id: topicId,
          formdata: formdata,
          requiredFields: ["video"],
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
        Course Video
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
          className="hover:bg-[#a1a1aa]"
        >
          {isEditing && <>Cancel</>}{" "}
          {!isEditing && initialData?.video && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
          {!isEditing && !initialData?.video && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.video ? (
          <div className="flex items-center justify-center h-60 bg-slate-300 dark:bg-gray-500 rounded-md">
            <VideoIcon className="h-10 w-10" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">Video Uploaded!</div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="topicVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ video: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 italic">
            Upload this topic&apos;s video
          </div>
        </div>
      )}
      {initialData?.video && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take few minutes to process.Refresh the page if video does
          not appear
        </div>
      )}
    </div>
  );
};

export default memo(VideoForm);
