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
import { Loader2, PlusCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Option } from "@prisma/client";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { GetSingleQuestionApi } from "@/store/question/slice";
import OptionList from "./option-list";
import {
  AddOptionApi,
  ChangeOptionOrderApi,
  ChangeOptionStatusApi,
  DeleteOptionApi,
  EditOptionApi,
} from "@/store/options/slice";
import { FormDialogSchema } from "../Modals/confirm-modal";

type OptionFormValues = { options: Option[] };

interface OptionFormProps {
  initialData: OptionFormValues;
  questionId: string;
  setActions: any;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  questionId: z.string().min(1, {
    message: "Question id is required",
  }),
});

const OptionForm = ({
  initialData,
  questionId,
  setActions,
}: OptionFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      title: "",
      questionId: questionId || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        questionId: questionId || "",
      });
    }
  }, [questionId]);

  const { isSubmitting, isValid } = form.formState;

  const toggleCreate = () => {
    form.reset({
      title: "",
      questionId: questionId || "",
    });
    setIsCreating((current) => !current);
  };

  const [open, setOpen] = useState<boolean>(false);

  const handleSuccess = () => {
    dispatch(GetSingleQuestionApi({ id: questionId }));
    setOpen(false);
    form.reset({
      title: "",
      questionId: questionId || "",
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        AddOptionApi({
          values: values,
          requiredFields: ["title", "questionId"],
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
        ChangeOptionOrderApi({
          id: questionId,
          values: { options: updatedData },
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

  const onEdit = async (id: string, values: FormDialogSchema) => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        EditOptionApi({
          id: id,
          values: values,
          requiredFields: ["title"],
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        DeleteOptionApi({
          id: id,
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const onStatusChange = async (id: string, status: string) => {
    try {
      setActions((current: any) => {
        return { ...current, callbackFunction: handleSuccess };
      });

      await dispatch(
        ChangeOptionStatusApi({
          id: id,
          values: {
            status: status,
          },
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="relative mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-[#27E0B3]" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Question Options
        {initialData?.options?.length >= 5 && (
          <p
            className={"text-xs text-muted-foreground text-red-700 text-right"}
          >
            You can add upto 5 options
          </p>
        )}
        <Button
          variant={"ghost"}
          onClick={toggleCreate}
          className="hover:bg-[#a1a1aa]"
          disabled={initialData?.options?.length >= 5}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an option
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
                        placeholder="e.g. 'A. None of the above'"
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
            !initialData?.options?.length && "text-slate-500 italic"
          )}
        >
          {!initialData?.options?.length && "No Options"}
          <OptionList
            items={initialData?.options || []}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onReorder={onReorder}
            open={open}
            setOpen={setOpen}
          />
        </div>
      )}
      {!isCreating && (
        <p className={"text-xs mt-4 text-muted-foreground"}>
          Drag and drop to reorder options
        </p>
      )}
    </div>
  );
};

export default memo(OptionForm);
