import { Category, Course, User } from "@prisma/client";

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

export type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string; topics: { id: string }[] }[];
  instructor: User | null;
  progress: number | null;
};
