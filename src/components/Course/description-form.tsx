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
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface DescriptionFormProps {
  initialData: {
    description: string;
  };
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();

  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  useDynamicToast(
    "CourseStore",
    {
      clearState: clearCourseState,
      callbackDispatches: [
        { thunk: GetSingleCourseApi, args: { id: courseId } },
      ],
      callbackFunctions: [toggleEdit],
    },
    pathname
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formdata = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        formdata.append(key, val);
      });

      await dispatch(
        EditCourseApi({
          id: courseId,
          formdata: formdata,
          requiredFields: ["description"],
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button
          variant={"ghost"}
          onClick={toggleEdit}
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
                // defaultValue={form.getValues("title")}
                defaultValue={initialData?.description}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting}
                        placeholder="e.g. 'This course is about'"
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
                disabled={!isValid || isSubmitting}
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
          {initialData?.description || "No Description"}
        </p>
      )}
    </div>
  );
};

export default DescriptionForm;
