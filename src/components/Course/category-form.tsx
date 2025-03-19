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
import { Combobox } from "../ui/combobox";
import { CategoryFormProps, Option } from "../../../types/Course";

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
});

const CategoryForm = ({
  initialData,
  courseId,
  setActions,
  options,
}: CategoryFormProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [_options, set_Options] = useState<Option[]>([]);

  useEffect(() => {
    if (options && options?.length !== 0) {
      const _data = options.map((val: any) => {
        return {
          label: val?.name,
          value: val?.id,
        };
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
      categoryId: initialData?.categoryId || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        categoryId: initialData?.categoryId || "",
      });
    }
  }, [initialData?.categoryId]);

  const { isSubmitting, isValid } = form.formState;

  const toggleEdit = () => {
    form.setValue("categoryId", initialData?.categoryId || "");
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
          requiredFields: ["categoryId"],
        })
      );
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const [selectedOption, setSelectedOption] = useState<Option>({
    label: "",
    value: "",
  });

  useEffect(() => {
    setSelectedOption(() => {
      return (
        _options.find(
          (option: any) => option.value === initialData.categoryId
        ) || {
          label: "",
          value: "",
        }
      );
    });
  }, [_options, initialData?.categoryId]);

  return (
    <div className="mt-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
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
              Edit Category
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
                name="categoryId"
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
                className="py-2 px-4 text-white rounded-lg bg-[#27E0B3] hover:bg-[#27e0b2ac] transition"
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
          {selectedOption?.label || "No Category"}
        </p>
      )}
    </div>
  );
};

export default memo(CategoryForm);
