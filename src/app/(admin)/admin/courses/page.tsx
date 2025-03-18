"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/LayoutContent/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Book,
  Users,
  Layers,
  Plus,
  Edit,
  GraduationCap,
  FileText,
} from "lucide-react";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { GetCategoryApi } from "@/store/category/slice";
import { GetCourseApi } from "@/store/course/slice";
import { useSession } from "next-auth/react";
import ChapterManagement from "./_components/chapter-management";
import { useRouter } from "next/navigation";
import { EnrollmentManagement } from "./_components/EnrollManagement";
import { GetUserApi } from "@/store/user/slice";

const courseFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  isFree: z.boolean().optional(),
  level: z.string().optional(),
});

interface CourseType {
  id: string;
  title: string;
  enrolled: number; // Note: Your data doesn’t provide this, so we’ll assume 0 or fetch it separately
  chapters: any[]; // Updated to reflect the chapters array
  status: "ACTIVE" | "DRAFT";
}

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState("courses");
  const { data: categoryData } = useSelector(
    (state: any) => state["CategoryStore"]
  );
  const { data: courseData } = useSelector(
    (state: any) => state["CourseStore"]
  );

  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const router = useRouter();
  useEffect(() => {
    if (session?.user?.id) {
      dispatch(
        GetCourseApi({
          searchParams: {},
        })
      );
    }
  }, [session?.user?.id, dispatch]);

  useEffect(() => {
    dispatch(GetCategoryApi());
  }, [dispatch]);

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      isFree: false,
      level: "",
    },
  });

  const CourseCard: React.FC<{ course: any }> = ({ course }) => (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" /> {course?.enrollments?.length} enrolled
            <Layers className="h-4 w-4 ml-2" /> {course.chapters.length}{" "}
            chapters
          </CardDescription>
        </div>
        <Badge
          variant={course.status === "ACTIVE" ? "secondary" : "destructive"}
        >
          {course.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/courses/${course.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleSubmit = async (values: z.infer<typeof courseFormSchema>) => {
    form.reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        headerTitle="Course Management"
        renderRight={() => (
          <Button onClick={() => router.push("/admin/courses/create")}>
            <Plus className="h-4 w-4 mr-1" /> Add Course
          </Button>
        )}
      />

      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="courses" className="flex items-center">
            <Book className="h-4 w-4 mr-1" /> Courses
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex items-center">
            <FileText className="h-4 w-4 mr-1" /> Chapters
          </TabsTrigger>
          <TabsTrigger value="enrollments" className="flex items-center">
            <Users className="h-4 w-4 mr-1" /> Enrollments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          {courseData.length > 0 ? (
            courseData
              .filter((course: any) =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course: any) => (
                <CourseCard key={course.id} course={course} />
              ))
          ) : (
            <p>No courses available.</p>
          )}
        </TabsContent>

        <TabsContent value="chapters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Management</CardTitle>
              <CardDescription>
                Manage chapters and topics for each course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => setSelectedCourse(value)}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courseData.map((course: any) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCourse && (
                <ChapterManagement courseId={selectedCourse} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments" className="mt-6">
          <EnrollmentManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
