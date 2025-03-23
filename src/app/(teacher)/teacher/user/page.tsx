"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Book,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { GetCourseApi } from "@/store/course/slice";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/LayoutContent/PageHeader";

// Types for our data
interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar: string;
  isVerified: boolean;
}

interface Enrollment {
  id: string;
  status: string;
  payment_status: string;
  price: number;
  createdAt: string;
  user: User;
}

interface Topic {
  id: string;
  title: string;
  status: string;
  isFree: boolean;
}

interface Chapter {
  id: string;
  title: string;
  status: string;
  topics: Topic[];
  quiz: any[];
  resources: any[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  status: string;
  level: string;
  instructor: User;
  category: {
    id: string;
    name: string;
  };
  chapters: Chapter[];
  enrollments: Enrollment[];
}

export default function TeacherStudentPage() {
  const [courses, setCourses] = useState<Course[]>([
    // Sample data would be loaded here from API
    // For now using the provided data structure
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // In a real app, you would fetch this data from an API
  // const coursesData: Course[] = [
  //   {
  //     id: "67cad724b9c1cb55b541a809",
  //     title: "Machine Learning",
  //     description:
  //       "<p>Machine Learning is a branch of artificial intelligence that focuses on the development of algorithms and statistical models that enable computers to perform tasks without explicit instructions. It involves training models on large datasets to identify patterns and make predictions or decisions. Applications range from image and speech recognition to recommendation systems and autonomous vehicles, making it a key technology in various industries. Machine Learning techniques include supervised learning, unsupervised learning, and reinforcement learning, each suited to different types of problems.</p>",
  //     thumbnail:
  //       "https://res.cloudinary.com/dlh3tav1v/image/upload/v1742232189/academix-cloudinary-mongodb/thumbnail-1d20b798-239f-4adf-b27e-36f948d14069_sewwhu.jpg",
  //     price: 120,
  //     isFree: false,
  //     status: "PUBLISHED",
  //     level: "BEGINNER",
  //     instructor: {
  //       id: "67a1ec4b200bb812be247609",
  //       email: "gladecoder@gmail.com",
  //       username: "Rishi Gaiwala",
  //       role: "ADMIN",
  //       avatar:
  //         "https://utfs.io/f/cc4169f1-034f-4be3-aa16-eff0ba193dd2-2sc3ex.png",
  //       isVerified: true,
  //     },
  //     category: {
  //       id: "679deb5a7a62432324c386c5",
  //       name: "Engineering",
  //     },
  //     chapters: [
  //       {
  //         id: "67cad8d6b9c1cb55b541a80a",
  //         title: "Introduction to Machine Learning",
  //         status: "DRAFT",
  //         topics: [
  //           {
  //             id: "67dc61ad1052b0af3d241fb1",
  //             title: "Introduction to Machine Learning",
  //             status: "PUBLISHED",
  //             isFree: true,
  //           },
  //           {
  //             id: "67dc62146811dbcb84d11a37",
  //             title: "History and Evolution of ML",
  //             status: "PUBLISHED",
  //             isFree: false,
  //           },
  //         ],
  //         quiz: [],
  //         resources: [],
  //       },
  //     ],
  //     enrollments: [
  //       {
  //         id: "67dda8b11eea07f151e8058d",
  //         status: "ACTIVE",
  //         payment_status: "PAID",
  //         price: 120,
  //         createdAt: "2025-03-21T17:58:09.930Z",
  //         user: {
  //           id: "67cf27d8ac20d184e1f8122b",
  //           email: "vipulkaniya1001@gmail.com",
  //           username: "Shubham Kaniya",
  //           role: "STUDENT",
  //           avatar:
  //             "https://api.dicebear.com/9.x/avataaars/svg?seed=Sagar Dalwala",
  //           isVerified: true,
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     id: "67c426f58048cd8311a1868e",
  //     title: "Introduction to Web Development",
  //     description: "<p>Introduction to Web Development DESCRIPTIONS</p>",
  //     thumbnail:
  //       "https://utfs.io/f/5c6d7422-7707-46b3-ba41-d6864310bc94-zaot3k.jpg",
  //     price: 0,
  //     isFree: true,
  //     status: "PUBLISHED",
  //     level: "BEGINNER",
  //     instructor: {
  //       id: "67a1ec4b200bb812be247609",
  //       email: "gladecoder@gmail.com",
  //       username: "Rishi Gaiwala",
  //       role: "ADMIN",
  //       avatar:
  //         "https://utfs.io/f/cc4169f1-034f-4be3-aa16-eff0ba193dd2-2sc3ex.png",
  //       isVerified: true,
  //     },
  //     category: {
  //       id: "67a3590408f221a7bf140396",
  //       name: "Direct Marketing Designer",
  //     },
  //     chapters: [
  //       {
  //         id: "67c4271f8048cd8311a1868f",
  //         title: "HTML Fundamentals",
  //         status: "PUBLISHED",
  //         topics: [
  //           {
  //             id: "67c42bea8048cd8311a18694",
  //             title: "HTML5 Features",
  //             status: "PUBLISHED",
  //             isFree: false,
  //           },
  //         ],
  //         quiz: [],
  //         resources: [],
  //       },
  //     ],
  //     enrollments: [
  //       {
  //         id: "67ddae2b582fea2decd15ba7",
  //         status: "ACTIVE",
  //         payment_status: "PAID",
  //         price: 0,
  //         createdAt: "2025-03-21T18:21:31.565Z",
  //         user: {
  //           id: "67ddab9517b0cdd9d2ae92d3",
  //           email: "triveditisha18@gmail.com",
  //           username: "Trivedi Tisha",
  //           role: "STUDENT",
  //           avatar:
  //             "https://api.dicebear.com/9.x/avataaars/svg?seed=TrivediTisha",
  //           isVerified: true,
  //         },
  //       },
  //       {
  //         id: "67ddae4d582fea2decd15ba8",
  //         status: "ACTIVE",
  //         payment_status: "PAID",
  //         price: 0,
  //         createdAt: "2025-03-21T18:22:05.005Z",
  //         user: {
  //           id: "67a1ec4b200bb812be247609",
  //           email: "gladecoder@gmail.com",
  //           username: "Rishi Gaiwala",
  //           role: "ADMIN",
  //           avatar:
  //             "https://utfs.io/f/cc4169f1-034f-4be3-aa16-eff0ba193dd2-2sc3ex.png",
  //           isVerified: true,
  //         },
  //       },
  //     ],
  //   },
  // ];
  const { data: coursesData } = useSelector((state: any) => state.CourseStore);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (session?.user.id) {
      dispatch(
        GetCourseApi({
          searchParams: {
            instructorId: session?.user.id,
          },
        })
      );
    }
  }, [dispatch, session?.user.id]);
  // Set courses data on component mount
  useState(() => {
    setCourses(coursesData);
  });

  const toggleCourseExpansion = (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
    } else {
      setExpandedCourse(courseId);
    }
  };

  const filteredCourses = coursesData.filter(
    (course: Course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = coursesData.reduce(
    (total: any, course: Course) => total + course.enrollments.length,
    0
  );

  const totalCourses = coursesData.length;

  const totalPublishedCourses = coursesData.filter(
    (course: Course) => course.status === "PUBLISHED"
  ).length;

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <PageHeader
          headerTitle="Student Management"
          renderRight={() => {
            return (
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            );
          }}
        />
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Student Management
            </h1>
            <p className="text-muted-foreground">
              Manage your students and course enrollments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div> */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {totalPublishedCourses} published
              </p>
            </CardContent>
          </Card>
          {/* <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>Last enrollment: {new Date().toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search courses or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>
          <TabsContent value="courses" className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleCourseExpansion(course.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md">
                        <Image
                          src={
                            course.thumbnail ||
                            "/placeholder.svg?height=64&width=64"
                          }
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {course.title}
                        </CardTitle>
                        <CardDescription>
                          {course.category.name} • {course.level} •
                          {course.isFree ? (
                            <Badge variant="outline" className="ml-2">
                              Free
                            </Badge>
                          ) : (
                            <span className="ml-2">${course.price}</span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          course.status === "PUBLISHED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {course.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrollments.length}</span>
                      </div>
                      {expandedCourse === course.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                {expandedCourse === course.id && (
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">
                          Enrolled Students ({course.enrollments.length})
                        </h3>
                        {course.enrollments.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Enrolled On</TableHead>
                                <TableHead>Payment</TableHead>
                                {/* <TableHead className="text-right">
                                  Actions
                                </TableHead> */}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {course.enrollments.map((enrollment) => (
                                <TableRow key={enrollment.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={enrollment.user.avatar}
                                          alt={enrollment.user.username}
                                        />
                                        <AvatarFallback>
                                          {enrollment.user.username.substring(
                                            0,
                                            2
                                          )}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">
                                          {enrollment.user.username}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {enrollment.user.email}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        enrollment.status === "ACTIVE"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {enrollment.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(
                                      enrollment.createdAt
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={
                                        enrollment.payment_status === "PAID"
                                          ? "default"
                                          : "destructive"
                                      }
                                    >
                                      {enrollment.payment_status}
                                    </Badge>
                                  </TableCell>
                                  {/* <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link
                                        href={`/teacher/user/${enrollment.user.id}`}
                                      >
                                        View Details
                                      </Link>
                                    </Button>
                                  </TableCell> */}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No students enrolled in this course yet.
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Course Content</h3>
                        <div className="space-y-2">
                          {course.chapters.map((chapter) => (
                            <div
                              key={chapter.id}
                              className="border rounded-md p-3"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium">
                                    {chapter.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {chapter.topics.length} topics •{" "}
                                    {chapter.quiz.length} quizzes •{" "}
                                    {chapter.resources.length} resources
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    chapter.status === "PUBLISHED"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {chapter.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button asChild>
                          <Link href={`/teacher/courses/${course.id}`}>
                            Manage Course
                          </Link>
                        </Button>
                        {/* <Button asChild>
                          <Link href={`/teacher/courses/${course.id}/students`}>
                            View All Students
                          </Link>
                        </Button> */}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
            {filteredCourses.length === 0 && (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search term
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Students</CardTitle>
                <CardDescription>
                  View and manage all enrolled students across courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Courses Enrolled</TableHead>
                      <TableHead>Status</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Create a unique list of students from all enrollments */}
                    {Array.from(
                      new Set(
                        coursesData.flatMap((course) =>
                          course.enrollments.map(
                            (enrollment) => enrollment.user.id
                          )
                        )
                      )
                    ).map((userId) => {
                      // Find the first enrollment with this user to get user details
                      const userEnrollment = coursesData
                        .flatMap((course) => course.enrollments)
                        .find((enrollment) => enrollment.user.id === userId);

                      if (!userEnrollment) return null;

                      // Count courses this user is enrolled in
                      const enrolledCourseCount = coursesData.filter((course) =>
                        course.enrollments.some(
                          (enrollment) => enrollment.user.id === userId
                        )
                      ).length;

                      return (
                        <TableRow key={userId}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={userEnrollment.user.avatar}
                                  alt={userEnrollment.user.username}
                                />
                                <AvatarFallback>
                                  {userEnrollment.user.username.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {userEnrollment.user.username}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {userEnrollment.user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{enrolledCourseCount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                userEnrollment.user.isVerified
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {userEnrollment.user.isVerified
                                ? "Verified"
                                : "Unverified"}
                            </Badge>
                          </TableCell>
                          {/* <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/teacher/user/${userId}`}>
                                View Details
                              </Link>
                            </Button>
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
