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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Combobox } from "../ui/combobox";
import { Option, Question } from "@prisma/client";
import { EditQuestionApi, GetSingleQuestionApi } from "@/store/question/slice";

const formSchema = z.object({
  answerId: z.string().min(1, {
    message: "Answer key is required",
  }),
});

export interface SelectOption {
  label: string;
  value: string;
}

type QuestionFormValues = Pick<Question, "answerId">;

export interface AnswerFormProps {
  initialData: QuestionFormValues;
  questionId: string;
  setActions: any;
  options: Option[];
}

const AnswerForm = ({
  initialData,
  questionId,
  setActions,
  options,
}: AnswerFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [_options, set_Options] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (options && options?.length !== 0) {
      let _data = options.map((val: any) => {
        // if (val?.status === "PUBLISHED") {
        return {
          label: val?.title,
          value: val?.id,
        };
        // }
      });
      set_Options(_data);
    }
  }, [options]);

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      answerId: initialData?.answerId || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        answerId: initialData?.answerId || "",
      });
    }
  }, [initialData?.answerId]);

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    form.setValue("answerId", initialData?.answerId || "");
    setIsEditing((current) => !current);
  };

  const handleSuccess = () => {
    dispatch(GetSingleQuestionApi({ id: questionId }));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        EditQuestionApi({
          id: questionId,
          values: values,
          requiredFields: ["answerId"],
        })
      );
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const [selectedOption, setSelectedOption] = useState<SelectOption>({
    label: "",
    value: "",
  });

  useEffect(() => {
    setSelectedOption(() => {
      return (
        _options.find(
          (option: any) => option.value === initialData.answerId
        ) || {
          label: "",
          value: "",
        }
      );
    });
  }, [_options, initialData?.answerId]);

  return (
    <div className="mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="font-medium flex items-center justify-between">
        Correct Answer
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
              Edit Answer
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
                name="answerId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        options={_options}
                        value={field.value}
                        onChange={field.onChange}
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
            !selectedOption?.label && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No Answer"}
        </p>
      )}
      {isEditing && (
        <p className={"text-xs mt-4 text-muted-foreground"}>
          Only Published Option are given for selection.
        </p>
      )}
    </div>
  );
};

export default memo(AnswerForm);
