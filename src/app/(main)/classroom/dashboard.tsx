// "use client";
// import React, { useEffect } from "react";
// import { UserCard } from "./_components/user-card";
// import { CheckCircle, Clock, Star } from "lucide-react";
// import { InfoCard } from "./_components/info-card";
// // import CourseList from "../search/_components/course-list";
// import { useSession } from "next-auth/react";
// import { useDispatch, useSelector } from "react-redux";
// import { GetCourseWithProgressApi } from "@/store/course/slice";
// import { AppDispatch } from "@/store/store";

// const StudentDashboardpage = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { data: courseData } = useSelector(
//     (state: any) => state["CourseStore"]
//   );

//   const { data: session } = useSession();
//   useEffect(() => {
//     if (session?.user?.id) {
//       dispatch(
//         GetCourseWithProgressApi({
//           userId: `${session?.user?.id}`,
//           requiredFields: ["userId"],
//         })
//       );
//     }
//   }, [session?.user?.id]);

//   return (
//     <div className="p-6 space-y-4 container">
//       <div className="flex flex-col mb-6 md:gap-1 items-center sm:items-start">
//         <h1 className="text-lg font-semibold sm:text-xl md:text-2xl sm:font-bold">
//           Welcome back Rishi Gaiwala
//         </h1>
//         <p className="text-muted-foreground text-sm sm:text-base">
//           Take a look your learning progress for Today{" "}
//           {new Date(Date.now()).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//             year: "numeric",
//           })}
//         </p>
//       </div>
//       <div className="bg-slate-100 dark:bg-gray-800 shadow-md border rounded-3xl overflow-hidden">
//         <UserCard />
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
//           <InfoCard
//             icon={Clock}
//             label="In Progress"
//             numberOfItems={1}
//             nameOfItems={"Courses"}
//           />
//           <InfoCard
//             icon={CheckCircle}
//             label="Completed"
//             numberOfItems={1}
//             nameOfItems={"Courses"}
//           />
//           <InfoCard
//             icon={Star}
//             label="Points"
//             numberOfItems={2}
//             nameOfItems={"XP"}
//           />
//         </div>
//       </div>
//       <div className="bg-slate-100 dark:bg-gray-800 border rounded-3xl overflow-hidden p-5">
//         {/* <CourseList items={courseData} /> */}
//       </div>
//     </div>
//   );
// };

// export default StudentDashboardpage;

"use client";

import { useMemo } from "react";
import {
  BookOpen,
  Clock,
  GraduationCap,
  MoreHorizontal,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Progress } from "@/components/ui/progress";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const { singleData } = useSelector((state: any) => state.UserStore);

  const enrollments = singleData?.enrollments || [];

  // Calculate total statistics
  const totalEnrollments = enrollments.length;
  const completedCourses = useMemo(() => {
    return enrollments.filter((enrollment) => enrollment.status === "COMPLETED")
      .length;
  }, [enrollments]);

  const totalProgress = useMemo(() => {
    const progress = enrollments.reduce((sum, enrollment) => {
      const courseProgress =
        enrollment.UserProgress?.reduce(
          (total, progress) => total + progress.progress,
          0
        ) || 0;
      return sum + courseProgress;
    }, 0);
    return enrollments.length > 0 ? progress / enrollments.length : 0;
  }, [enrollments]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          My <span className="text-[#27e0b3]">Learning Dashboard</span>
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {singleData?.username}! Here's an overview of your
          learning progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Courses
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalProgress)}%
            </div>
            <Progress value={totalProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
          <CardDescription>
            Your enrolled courses and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">
                    {enrollment.course?.title}
                  </TableCell>
                  <TableCell>
                    {enrollment.course?.instructor?.username || "Unknown"}
                  </TableCell>
                  <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress
                        value={
                          enrollment.UserProgress?.reduce(
                            (total, progress) => total + progress.progress,
                            0
                          ) || 0
                        }
                        className="w-full mr-2"
                      />
                      <span>
                        {Math.round(
                          enrollment.UserProgress?.reduce(
                            (total, progress) => total + progress.progress,
                            0
                          ) || 0
                        )}
                        %
                      </span>
                    </div>
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
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          Continue Learning
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Course Details</DropdownMenuItem>
                        <DropdownMenuItem>View Certificate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
