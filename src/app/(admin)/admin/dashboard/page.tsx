"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  BookOpen,
  DollarSign,
  Briefcase,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminDashboard() {
  const { data: allUserData, singleData } = useSelector(
    (state: any) => state.UserStore
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null); // Add this new state
  const router = useRouter();
  const [isViewModal, setIsViewModal] = useState(false);
  // Aggregate data from all users
  const allAuthoredCourses = useMemo(
    () => allUserData?.flatMap((user: any) => user.authoredCourses || []) || [],
    [allUserData]
  );

  const allEnrollments = useMemo(
    () => allUserData?.flatMap((user: any) => user.enrollments || []) || [],
    [allUserData]
  );

  // Calculate total statistics
  const totalUsers = allUserData?.length || 0;

  const totalCourses = allAuthoredCourses.length;

  const totalRevenue = useMemo(() => {
    return allEnrollments.reduce(
      (sum: number, enrollment: any) => sum + (enrollment.price || 0),
      0
    );
  }, [allEnrollments]);

  const totalEnrollments = allEnrollments.length;

  // Prepare data for revenue chart
  // const revenueData = useMemo(() => {
  //   const monthlyStats = {};
  //   allEnrollments.forEach((enrollment: any) => {
  //     const date = new Date(enrollment.createdAt);
  //     const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
  //     if (!monthlyStats[monthYear]) {
  //       monthlyStats[monthYear] = { revenue: 0 };
  //     }
  //     monthlyStats[monthYear].revenue += enrollment.price || 0;
  //   });

  //   return Object.entries(monthlyStats).map(([name, stats]) => ({
  //     name,
  //     ...stats,
  //   }));
  // }, [allEnrollments]);
  const revenueStats = useMemo(() => {
    const monthlyStats = {};
    let total = 0;

    allEnrollments.forEach((enrollment: any) => {
      const date = new Date(enrollment.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const price = enrollment.price || 0;

      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = { revenue: 0, count: 0 };
      }
      monthlyStats[monthYear].revenue += price;
      monthlyStats[monthYear].count += 1;
      total += price;
    });

    return {
      totalRevenue: total,
      monthlyData: Object.entries(monthlyStats)
        .map(([name, stats]: [string, any]) => ({
          name,
          revenue: stats.revenue,
          enrollments: stats.count,
        }))
        .sort((a, b) => {
          // Sort by date (assuming MM/YYYY format)
          const [monthA, yearA] = a.name.split("/").map(Number);
          const [monthB, yearB] = b.name.split("/").map(Number);
          return yearB - yearA || monthB - monthA;
        }),
    };
  }, [allEnrollments]);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-500">Published</Badge>;
      case "DRAFT":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const CourseDetailsModal = ({ course }) => {
    if (!course) return null;

    return (
      <Dialog open={isViewModal} onOpenChange={setIsViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{course.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-4 p-4">
              <div>
                <h3 className="font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>{getStatusBadge(course.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p>{course.isFree ? "Free" : `₹${course.price}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p>{course.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p>{course.category?.name || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold">Description</h3>
                <div
                  className="text-sm mt-2"
                  dangerouslySetInnerHTML={{
                    __html: course.description || "No description available",
                  }}
                />
              </div>

              <div>
                <h3 className="font-semibold">Chapters</h3>
                {course.chapters?.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {course.chapters.map((chapter) => (
                      <div key={chapter.id} className="border p-3 rounded-md">
                        <div className="flex justify-between">
                          <p className="font-medium">{chapter.title}</p>
                          {getStatusBadge(chapter.status)}
                        </div>
                        {chapter.description && (
                          <div
                            className="text-sm text-muted-foreground mt-1"
                            dangerouslySetInnerHTML={{
                              __html: chapter.description,
                            }}
                          />
                        )}
                        {chapter.topics?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Topics:</p>
                            <ul className="list-disc pl-5 text-sm">
                              {chapter.topics.map((topic) => (
                                <li key={topic.id}>
                                  {topic.title} ({topic.status})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    No chapters available
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Statistics</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Enrollments</p>
                    <p>{course.enrollments?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p>
                      ₹
                      {(
                        course.price * (course.enrollments?.length || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome Back, {singleData?.username}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollments
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {revenueStats.totalRevenue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <CourseDetailsModal course={selectedCourse} />
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Monthly revenue across all enrollments
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueStats.monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
          <CardDescription>
            Overview of all courses on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAuthoredCourses.length > 0 ? (
                allAuthoredCourses.map((course: any) => {
                  const instructor = allUserData.find(
                    (user: any) => user.id === course.instructorId
                  );
                  return (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>{instructor?.username || "Unknown"}</TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>₹{course?.price?.toFixed(2)}</TableCell>
                      <TableCell>{course.enrollments.length}</TableCell>
                      <TableCell>
                        ₹{(course.price * course.enrollments.length).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCourse(course);
                                setIsViewModal(true);
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/courses/${course.id}`)
                              }
                            >
                              Edit Course
                            </DropdownMenuItem>
                            {/* {course.status === "DRAFT" && (
                              <DropdownMenuItem>
                                Publish Course
                              </DropdownMenuItem>
                            )}
                            {course.status === "PUBLISHED" && (
                              <DropdownMenuItem>
                                Unpublish Course
                              </DropdownMenuItem>
                            )} */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No courses available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
