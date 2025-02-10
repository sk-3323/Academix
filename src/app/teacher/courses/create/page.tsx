"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import type { AppDispatch } from "@/store/store"; // Adjust this import based on your store location
import {
  AddCourseApi,
  clearCourseState,
  GetCourseApi,
} from "@/store/course/slice";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreateCoursePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const handleSuccess = () => {
    dispatch(GetCourseApi());
  };

  useDynamicToast(
    "CourseStore",
    {
      clearState: clearCourseState,
      callbackFunction: handleSuccess,
    },
    `/teacher/courses/${singleData?.id}`
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formdata = new FormData();
      Object.entries(values).forEach(([key, val]) => {
        formdata.append(key, val);
      });

      await dispatch(
        AddCourseApi({ formdata: formdata, requiredFields: ["title"] })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div>
        <div className="min-h-screen flex justify-center items-center">
          <section className="py-16 px-6 lg:px-32">
            <h1 className="text-4xl font-bold text-center mb-8">
              Name your course
            </h1>
            <p className="text-center max-w-2xl mx-auto mb-12">
              What would you like to name your course? Don&apos;t worry, you can
              change this later.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-3xl mx-auto">
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
                          <FormLabel
                            className="block text-sm font-medium mb-2"
                            htmlFor="title"
                          >
                            Course title
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                              disabled={isSubmitting}
                              placeholder="e.g. 'Advanced web development"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="max-w-2xl mx-auto mb-12">
                            What will you teach in this course?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Link href="/teacher/courses">
                      <Button
                        type="button"
                        variant="ghost"
                        className="hover:bg-[#a1a1aa]"
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      className="py-2 px-4 bg-[#27E0B3] text-white rounded-lg hover:bg-[#27e0b2ac] transition"
                      type="submit"
                      disabled={!isValid || isSubmitting}
                    >
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CreateCoursePage;
