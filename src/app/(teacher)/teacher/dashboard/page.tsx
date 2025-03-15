"use client";

import { useState, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BookOpen, DollarSign, Download, FileText, Users } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { AppDispatch } from "@/store/store";
import { useSession } from "next-auth/react";
import { GetCategoryApi } from "@/store/category/slice";
import { GetCourseApi } from "@/store/course/slice";

const COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b"];

export default function TeacherDashboard() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNote, setPayoutNote] = useState("");
  const { singleData } = useSelector((state: any) => state.UserStore);
  const { data: session } = useSession();
  console.log(singleData);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const id = session?.user?.id;
    if (id) {
      dispatch(
        GetEnrollmentApi({
          searchParams: {
            // courseId: id,
          },
        })
      );
    }
  }, [dispatch]);
  const authoredCourses = singleData?.authoredCourses || [];
  const { data: enrollments } = useSelector(
    (state: any) => state.EnrollmentStore
  );
  console.log(enrollments);

  // Calculate total statistics
  const totalStudents = useMemo(() => {
    let totalUser: string[] = [];
    if (authoredCourses.length > 0) {
      authoredCourses.forEach((course: any) => {
        if (course.enrollments?.length > 0) {
          course.enrollments.forEach((enroll: any) => {
            totalUser.push(enroll.user?.username);
          });
        }
      });
    }
    return totalUser;
  }, []);
  console.log(totalStudents);

  const totalCourses = authoredCourses.length;

  const totalRevenue = useMemo(() => {
    let total = 0;
    if (authoredCourses.length > 0) {
      authoredCourses.forEach((course: any) => {
        if (course.enrollments?.length > 0) {
          course.enrollments.forEach((enroll: any) => {
            total += enroll.price;
          });
        }
      });
    }
    return total;
  }, [authoredCourses]);

  const totalEnrollments = useMemo(() => {
    let total = 0;
    if (authoredCourses.length > 0) {
      authoredCourses.forEach((course: any) => {
        total += course.enrollments?.length;
      });
    }
    return total;
  }, [authoredCourses]);
  console.log(totalRevenue * 0.5);

  // Prepare data for charts
  const courseData = useMemo(() => {
    return authoredCourses.map((course, index) => ({
      name: course.title,
      students: course.enrollments.length,
      value: course.enrollments.length,
      color: COLORS[index % COLORS.length],
    }));
  }, [authoredCourses]);

  const monthlyData = useMemo(() => {
    const monthlyStats = {};
    enrollments.forEach((enrollment:any) => {
      const date = new Date(enrollment.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = { enrollments: 0, revenue: 0 };
      }
      monthlyStats[monthYear].enrollments++;
      monthlyStats[monthYear].revenue += enrollment.price;
    });

    return Object.entries(monthlyStats).map(([name, stats]) => ({
      name,
      ...stats,
    }));
  }, [enrollments]);

  const handlePayoutRequest = () => {
    console.log(
      `Requesting payout of ₹${payoutAmount} with note: ${payoutNote}`
    );
    setIsRequestDialogOpen(false);
    setPayoutAmount("");
    setPayoutNote("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        );
      case "Processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {singleData?.username}! Here's an overview of your
            courses and earnings.
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
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.length}</div>
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
            <FileText className="h-4 w-4 text-muted-foreground" />
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
              ₹{totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Enrollment & Revenue Trends</CardTitle>
            <CardDescription>
              Monthly enrollment and revenue data
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Enrollments"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Revenue (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
            <CardDescription>Students enrolled in each course</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {courseData.map((entry:any, index:any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} students`, "Enrollment"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>
            Overview of all your authored courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Enrollments</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authoredCourses.map((course:any) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>₹{course.price.toFixed(2)}</TableCell>
                  <TableCell>{course.enrollments.length}</TableCell>
                  <TableCell>
                    ₹{(course.price * course.enrollments.length).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Request Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Enter the amount you want to withdraw and any additional notes for
              the admin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Minimum payout amount: ₹500.00
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add any additional information for the admin"
                value={payoutNote}
                onChange={(e) => setPayoutNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRequestDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayoutRequest}
              disabled={!payoutAmount || Number(payoutAmount) < 500}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
