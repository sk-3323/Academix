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
import { EditCourseApi, GetSingleCourseApi } from "@/store/course/slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { Pencil, Sparkles } from "lucide-react"; // Added Sparkles for AI button
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import Editor from "../editor";
import Preview from "../preview";
import { APIClient } from "@/helpers/apiHelper";

type CourseFormValues = Pick<Course, "description" | "title">;

interface DescriptionFormProps {
  initialData: CourseFormValues;
  courseId: string;
  setActions: any;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

const DescriptionForm = ({
  initialData,
  courseId,
  setActions,
}: DescriptionFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: any) => state.CourseStore);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetchingAI, setIsFetchingAI] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        description: initialData?.description || "",
      });
    }
  }, [initialData?.description, form]);

  const { isSubmitting, isValid } = form.formState;
  const fetchAIDescription = async (
    courseTitle: string
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("courseTitle", courseTitle);
    var result = null;
    if (
      formData.get("courseTitle") !== "" ||
      formData.get("courseTitle") !== null
    ) {
      const api = new APIClient();
      const response: any = await api.create(
        `/course/fetch-description`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      if (!response.success) {
        throw new Error("Failed to fetch AI description");
      }
      console.log(response, "response form ai");

      result = response?.result;
    }

    return result;
  };

  const toggleEdit = () => {
    form.setValue("description", initialData?.description || "");
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
          requiredFields: ["description"],
        })
      );
      setIsEditing(false);
      toast.success("Description updated successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleAIGenerate = async () => {
    setIsFetchingAI(true);
    console.log(initialData.title);

    try {
      const aiDescription: any = await fetchAIDescription(initialData.title);
      form.setValue("description", aiDescription);
      toast.success("AI-generated description loaded!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to fetch AI description");
    } finally {
      setIsFetchingAI(false);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <div className="flex items-center gap-2">
          {isEditing && (
            <Button
              onClick={handleAIGenerate}
              variant="outline"
              className="hover:bg-[#a1a1aa]"
              disabled={isFetchingAI || isSubmitting}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isFetchingAI ? "Generating..." : "AI Generate Description"}
            </Button>
          )}
          <Button
            onClick={toggleEdit}
            variant="ghost"
            className="hover:bg-[#a1a1aa]"
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Description
              </>
            )}
          </Button>
        </div>
      </div>
      {isEditing ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <div className="grid grid-cols-1 gap-6 mb-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor
                        disabled={isSubmitting || isFetchingAI}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                className="py-2 px-4 bg-[#27E0B3] text-white rounded-lg hover:bg-[#27e0b2ac] transition"
                type="submit"
                disabled={!isValid || isSubmitting || isFetchingAI}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.description && "text-slate-500 italic"
          )}
        >
          {!initialData?.description && "No Description"}
          {initialData?.description && (
            <Preview value={initialData?.description} />
          )}
        </p>
      )}
    </div>
  );
};

export default memo(DescriptionForm);
