import { Course } from "@prisma/client";

type CourseFormValues = Pick<Course, "categoryId">;

export interface Option {
  label: string;
  value: string;
}

export interface CategoryFormProps {
  initialData: CourseFormValues;
  courseId: string;
  setActions: any;
  options: Option[];
}
