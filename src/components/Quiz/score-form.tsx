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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Course, Quiz } from "@prisma/client";
import { Input } from "../ui/input";
import { formatPrice } from "@/lib/format";
import { EditQuizApi, GetSingleQuizApi } from "@/store/quiz/slice";

type QuizFormValues = Pick<Quiz, "passingScore">;

interface ScoreFormProps {
  initialData: QuizFormValues;
  quizId: string;
  questions: number;
  setActions: any;
}

const ScoreForm = ({
  initialData,
  quizId,
  questions,
  setActions,
}: ScoreFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const formSchema = z.object({
    passingScore: z.coerce
      .number({
        message: "Passing score is required to be a number",
      })
      .max(
        questions,
        "Passing score cannot be greater than the total number of questions."
      ),
  });

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      passingScore: initialData?.passingScore || 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        passingScore: initialData?.passingScore || 0,
      });
    }
  }, [initialData?.passingScore]);

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    form.setValue("passingScore", initialData?.passingScore || 0);
    setIsEditing((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleQuizApi({ id: quizId }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        EditQuizApi({
          id: quizId,
          values: values,
          requiredFields: ["passingScore"],
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
        Quiz Passing Score
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
              Edit Score
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
                name="passingScore"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting}
                        placeholder="Set a passing score of the quiz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
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
            !initialData?.passingScore && "text-slate-500 italic"
          )}
        >
          {initialData?.passingScore || "No Price"}
        </p>
      )}
    </div>
  );
};

export default memo(ScoreForm);
