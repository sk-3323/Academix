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
            <Users className="h-4 w-4" /> {course.enrolled || 0} enrolled
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
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Chapter
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-1" /> Manage Enrollment
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EnrollmentManagement = () => (
    <Card>
      <CardHeader>
        <CardTitle>Course Enrollments</CardTitle>
        <CardDescription>
          Manage student enrollments for all courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Select onValueChange={(value) => setSelectedCourse(value)}>
              <SelectTrigger className="w-[200px]">
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
            <Input placeholder="Search students..." className="flex-1" />
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add Student
            </Button>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>John Doe</span>
              </div>
              <div className="flex gap-2">
                <Badge>In Progress</Badge>
                <Button variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const handleSubmit = async (values: z.infer<typeof courseFormSchema>) => {
    console.log("Form Values:", values);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        headerTitle="Course Management"
        renderRight={() => (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <FormProvider {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter course title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryData.map((category: any) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BEGINNER">Beginner</SelectItem>
                              <SelectItem value="INTERMEDIATE">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="ADVANCED">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormLabel className="text-sm font-medium">
                          Is Free
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create Course
                  </Button>
                </form>
              </FormProvider>
            </DialogContent>
          </Dialog>
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
