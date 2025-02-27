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
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Topic } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";
import { GetSingleCourseApi, EditCourseApi } from "@/store/course/slice";

type CourseFormValues = Pick<Topic, "isFree">;

interface CourseAccessFormProps {
  initialData: CourseFormValues;
  courseId: string;
  setActions: any;
}

const formSchema = z.object({
  isFree: z.boolean(),
});

const CourseAccessForm = ({
  initialData,
  courseId,
  setActions,
}: CourseAccessFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      isFree: !!initialData?.isFree,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        isFree: !!initialData?.isFree,
      });
    }
  }, [initialData?.isFree]);

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    form.setValue("isFree", !!initialData?.isFree);
    setIsEditing((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleCourseApi({ id: courseId }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formdata = new FormData();
      const price = values?.isFree ? 0 : null;
      Object.entries(values).forEach(([key, val]) => {
        formdata.append(key, val.toString());
      });

      if (price === 0) {
        formdata.append("price", price.toString());
      }

      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        EditCourseApi({
          id: courseId,
          formdata: formdata,
          requiredFields: price ? ["price", "isFree"] : ["isFree"],
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
      <div className="font-medium flex items-center justify-between">
        Course access settings
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
              Edit access
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
                name="isFree"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field?.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormDescription>
                        Check this box if you want to make this course free for
                        access
                      </FormDescription>
                    </div>
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
            !initialData?.isFree && "text-slate-500 italic"
          )}
        >
          {initialData?.isFree ? "This course is free" : "This course is paid"}
          {/* {initialData?.isFree && <Preview value={initialData?.isFree} />} */}
        </p>
      )}
    </div>
  );
};

export default memo(CourseAccessForm);
