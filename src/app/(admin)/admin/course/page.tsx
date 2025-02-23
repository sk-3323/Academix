"use client";
import React, { useState } from "react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Book,
  Users,
  FileText,
  Layers,
  Plus,
  Edit,
  Trash,
  GraduationCap,
} from "lucide-react";
import { createCourseSchema } from "@/schema/course/schema";
import { z } from "zod";

const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  instructor: z.string().min(1, "Instructor is required"),
  duration: z.string().min(1, "Duration is required"),
  level: z.string().min(1, "Level is required"),
});

interface courseType {
  id: number;
  title: string;
  enrolled: number;
  chapters: number;
  status: "active" | "draft";
}
export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Fundamentals",
      enrolled: 45,
      chapters: 12,
      status: "active",
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      enrolled: 32,
      chapters: 8,
      status: "draft",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      instructor: "",
      duration: "",
      level: "",
    },
  });

  const CourseCard: React.FC<{ course: courseType }> = ({ course }) => (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{course.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4" /> {course.enrolled} enrolled
            <Layers className="h-4 w-4 ml-2" /> {course.chapters} chapters
          </CardDescription>
        </div>
        <Badge
          variant={course.status === "active" ? "destructive" : "secondary"}
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

  const ChapterManagement = ({ courseId }) => (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="chapter-1">
        <AccordionTrigger>Chapter 1: Introduction</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>Topic 1: Getting Started</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Topic 2: Basic Concepts</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Add Topic
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React Fundamentals</SelectItem>
                <SelectItem value="javascript">Advanced JavaScript</SelectItem>
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
              <Form {...form}>
                <form className="space-y-4">
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
                      name="duration"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 8 weeks" {...field} />
                          </FormControl>
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
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Course
                  </Button>
                </form>
              </Form>
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
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
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
              <Select>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React Fundamentals</SelectItem>
                  <SelectItem value="javascript">
                    Advanced JavaScript
                  </SelectItem>
                </SelectContent>
              </Select>
              <ChapterManagement courseId={1} />
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
