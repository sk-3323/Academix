"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { Loader2, Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { MuxData, Topic } from "@prisma/client";
import { FileUpload } from "../file-upload";
import { EditTopicApi, GetSingleTopicApi } from "@/store/topic/slice";
import MuxPlayer from "@mux/mux-player-react";
import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary";

type TopicFormValues = Pick<Topic, "video" | "publicKey">;

interface VideoFormProps {
  initialData: TopicFormValues & { muxData?: MuxData | null };
  // initialData: TopicFormValues & { muxData: muxData };
  topicId: string;
  setActions: any;
}

const formSchema = z.object({
  video: z.string().min(1, {
    message: "Video is required",
  }),
  publicKey: z.string().min(1, {
    message: "public key is required",
  }),
});

const VideoForm = ({ initialData, topicId, setActions }: VideoFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      video: initialData?.video || "",
      publicKey: initialData?.publicKey || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        video: initialData?.video || "",
        publicKey: initialData?.publicKey || "",
      });
    }
    console.info(" initialData :>> ", initialData);
  }, [initialData?.video, initialData?.publicKey]);

  const toggleEdit = () => {
    form.setValue("video", initialData?.video || "");
    form.setValue("publicKey", initialData?.publicKey || "");
    setIsEditing((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleTopicApi({ id: topicId }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUpdating(true);
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
          requiredFields: ["video", "publicKey"],
        })
      );

      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#27E0B3]" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between mb-2">
        Course Video
        <CldUploadWidget
          uploadPreset="academix-cloudinary-mongodb" // Create this preset in your Cloudinary dashboard
          onSuccess={(result: any): void => {
            onSubmit({
              video: result?.info?.secure_url,
              publicKey: result?.info?.public_id,
            });
          }}
          signatureEndpoint={"/api/sign-cloudinary-params"}
          options={{
            sources: ["local", "url", "camera", "google_drive", "dropbox"],
            multiple: false,
            maxFiles: 1,
            folder: "academix-cloudinary-mongodb",
            // autoMinimize: true,
          }}
        >
          {({ open }) => (
            <Button
              variant={"ghost"}
              onClick={() => {
                open();
                toggleEdit();
              }}
              className="hover:bg-[#a1a1aa]"
            >
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
          )}
        </CldUploadWidget>
        {isEditing && (
          <Button
            variant={"ghost"}
            onClick={toggleEdit}
            className="hover:bg-[#a1a1aa]"
          >
            Cancel
          </Button>
        )}
      </div>
      {!isEditing &&
        (initialData?.video && initialData?.publicKey ? (
          <div className="relative aspect-video mt-2">
            <CldVideoPlayer
              id="default"
              width="920"
              height="570"
              src={initialData?.publicKey}
              autoPlay
              controls
              pictureInPictureToggle
              logo={{
                imageUrl: "/assets/logos/fevicon.svg",
                onClickUrl: "/",
              }}
            />
            {/* <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
              metadata={{
                video_title: "Topic Video",
                }}
                streamType="on-demand"
                onLoadStart={() => console.info("loaded")}
                onError={(e) => console.error("Mux Player Error:", e)}
                /> */}
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-slate-300 dark:bg-gray-500 rounded-md">
            <VideoIcon className="h-10 w-10" />
          </div>
        ))}

      {isEditing && (
        <div className="flex items-center justify-center h-60 bg-slate-300 dark:bg-gray-500 rounded-md">
          <VideoIcon className="h-10 w-10" />
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
