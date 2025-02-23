"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { EditCourseApi, GetSingleCourseApi } from "@/store/course/slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Chapter, Course, Resource } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "../file-upload";
import { GetSingleChapterApi } from "@/store/chapter/slice";
import { AddResourceApi, DeleteResourceApi } from "@/store/resource/slice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface ResourceFormProps {
  initialData: { resources: Resource[] };
  chapterId: string;
  setActions: any;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "title is required",
  }),
  url: z.string(),
  chapterId: z.string().min(1, {
    message: "Chapter is required",
  }),
});

const ResourceForm = ({
  initialData,
  chapterId,
  setActions,
}: ResourceFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      url: "",
      title: "",
      chapterId: chapterId || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        url: "",
        title: "",
        chapterId: chapterId || "",
      });
    }
  }, [initialData?.resources]);

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    form.reset({
      url: "",
      title: "",
      chapterId: chapterId || "",
    });
    setIsEditing((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleChapterApi({ id: chapterId }));
    form.reset({
      url: "",
      title: "",
      chapterId: chapterId || "",
    });
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
        AddResourceApi({
          formdata: formdata,
          requiredFields: ["url", "title", "chapterId"],
        })
      );

      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        DeleteResourceApi({
          id: id,
        })
      );

      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="font-medium flex items-center justify-between mb-2">
        Course Resources
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
          className="hover:bg-[#a1a1aa]"
        >
          {isEditing && <>Cancel</>}{" "}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData?.resources?.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet.
            </p>
          )}
          {initialData?.resources?.length > 0 && (
            <>
              <div className="space-y-2">
                {initialData?.resources?.map((res) => (
                  <div
                    key={res?.id}
                    className="flex item-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  >
                    <a href={res.url!} target="_blank" className="flex item-center w-full">
                      <File className="h-4 w-4 mr-2" />
                      <p className="text-xs line-clamp-1">{res?.title}</p>
                    </a>

                    {deletingId === res?.id && (
                      <>
                        <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                      </>
                    )}

                    {deletingId !== res?.id && (
                      <button
                        className="ml-auto hover:opacity-75 transition"
                        onClick={() => onDelete(res?.id)}
                      >
                        <X className="h-4 w-4 transition" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-8"
            >
              <div className="grid grid-cols-1 gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                          disabled={isSubmitting}
                          placeholder="Title of the resource e.g. 'PDF-Introduction of the chapter'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FileUpload
                disabled={!isValid || isSubmitting}
                endpoint="chapterResources"
                onChange={(url) => {
                  if (url) {
                    onSubmit({
                      url: url,
                      chapterId: chapterId,
                      title: form.getValues("title"),
                    });
                  }
                }}
              />
            </form>
          </Form>

          <div className="text-xs text-muted-foreground mt-4 italic">
            Add anything your students might need to complete
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ResourceForm);
