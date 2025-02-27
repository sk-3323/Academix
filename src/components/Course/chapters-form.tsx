"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GetSingleCourseApi } from "@/store/course/slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { AddChapterApi, ChangeChapterOrderApi } from "@/store/chapter/slice";
import { Input } from "../ui/input";
import ChapterList from "./chapter-list";
import { useRouter } from "next/navigation";

type ChapterFormValues = { chapters: Chapter[] };

interface ChaptersFormProps {
  initialData: ChapterFormValues;
  courseId: string;
  setActions: any;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Chapters is required",
  }),
  courseId: z.string().min(1, {
    message: "Chapters is required",
  }),
});

const ChaptersForm = ({
  initialData,
  courseId,
  setActions,
}: ChaptersFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      title: "",
      courseId: courseId || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        courseId: courseId || "",
      });
    }
  }, [courseId]);

  const { isSubmitting, isValid } = form.formState;

  const toggleCreate = () => {
    form.reset({
      title: "",
      courseId: courseId || "",
    });
    setIsCreating((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleCourseApi({ id: courseId }));
    form.reset({
      title: "",
      courseId: courseId || "",
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        AddChapterApi({
          values: values,
          requiredFields: ["title", "courseId"],
        })
      );
      setIsCreating(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const onReorder = async (updatedData: { id: string; order: number }[]) => {
    try {
      setIsUpdating(true);

      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        ChangeChapterOrderApi({
          id: courseId,
          values: { chapters: updatedData },
          requiredFields: [],
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#27E0B3]" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <Button
          variant={"ghost"}
          onClick={toggleCreate}
          className="hover:bg-[#a1a1aa]"
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <div className="grid grid-cols-1 gap-6 mb-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction of the course'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              className="py-2 px-4 bg-[#27E0B3] text-white rounded-lg hover:bg-[#27e0b2ac] transition"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData?.chapters?.length && "text-slate-500 italic"
          )}
        >
          {!initialData?.chapters?.length && "No Chapters"}
          <ChapterList
            items={initialData?.chapters || []}
            onEdit={onEdit}
            onReorder={onReorder}
          />
        </div>
      )}
      {!isCreating && (
        <p className={"text-xs mt-4 text-muted-foreground"}>
          Drag and drop to reorder chapters
        </p>
      )}
    </div>
  );
};

export default memo(ChaptersForm);
