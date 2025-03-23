"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  BookOpen,
  DollarSign,
  Download,
  FileText,
  Users,
  BarChart2,
  PieChartIcon,
  LineChartIcon,
  FileBarChart,
  FileSpreadsheet,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import type { AppDispatch } from "@/store/store";
import { useSession } from "next-auth/react";
import { GetCategoryApi } from "@/store/category/slice";
import { GetCourseApi } from "@/store/course/slice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { toast } from "sonner";

const COLORS = [
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#6366f1",
  "#ec4899",
  "#14b8a6",
];

export default function TeacherDashboard() {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNote, setPayoutNote] = useState("");
  const [activeChartTab, setActiveChartTab] = useState("line");
  const [reportType, setReportType] = useState("course");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { singleData } = useSelector((state: any) => state.UserStore);
  const { data: session } = useSession();
  const reportContentRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const id = session?.user?.id;
    if (id) {
      dispatch(
        GetEnrollmentApi({
          searchParams: {
            // courseId: id,
            userId: singleData?.id,
          },
        })
      );

      dispatch(
        GetCourseApi({
          searchParams: {},
        })
      );

      dispatch(GetCategoryApi());
    }
  }, [dispatch, session?.user?.id, singleData?.id]);

  const authoredCourses = singleData?.authoredCourses || [];
  const { data: enrollments } = useSelector(
    (state: any) => state.EnrollmentStore
  );
  const { data: allCourses } = useSelector((state: any) => state.CourseStore);
  const { data: categories } = useSelector((state: any) => state.CategoryStore);

  // Calculate total statistics
  const totalStudents = useMemo(() => {
    const totalUser: string[] = [];
    if (authoredCourses.length > 0) {
      authoredCourses.forEach((course: any) => {
        if (course.enrollments?.length > 0) {
          course.enrollments.forEach((enroll: any) => {
            if (!totalUser.includes(enroll.user?.username)) {
              totalUser.push(enroll.user?.username);
            }
          });
        }
      });
    }
    return totalUser;
  }, [authoredCourses]);

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

  // Prepare data for charts
  const courseData = useMemo(() => {
    return authoredCourses.map((course: any, index: any) => ({
      name: course.title,
      students: course.enrollments.length,
      value: course.enrollments.length,
      color: COLORS[index % COLORS.length],
    }));
  }, [authoredCourses]);

  const monthlyData = useMemo(() => {
    const monthlyStats: any = {};
    enrollments.forEach((enrollment: any) => {
      const date = new Date(enrollment?.createdAt);
      const monthYear: any = `${date.getMonth() + 1}/${date.getFullYear()}`;
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

  // Category distribution data
  const categoryData = useMemo(() => {
    const categoryStats: any = {};

    if (authoredCourses.length > 0) {
      authoredCourses.forEach((course: any) => {
        const categoryName = course.category?.name || "Uncategorized";
        if (!categoryStats[categoryName]) {
          categoryStats[categoryName] = {
            count: 0,
            enrollments: 0,
            revenue: 0,
          };
        }
        categoryStats[categoryName].count++;
        categoryStats[categoryName].enrollments +=
          course.enrollments?.length || 0;

        if (course.enrollments?.length > 0) {
          course.enrollments.forEach((enrollment: any) => {
            categoryStats[categoryName].revenue += enrollment.price || 0;
          });
        }
      });
    }

    return Object.entries(categoryStats).map(
      ([name, stats]: [string, any]) => ({
        name,
        ...stats,
      })
    );
  }, [authoredCourses]);

  // Course completion data
  const courseCompletionData = useMemo(() => {
    return authoredCourses.map((course: any) => {
      const totalChapters = course.chapters?.length || 0;
      const publishedChapters =
        course.chapters?.filter(
          (chapter: any) => chapter.status === "PUBLISHED"
        ).length || 0;

      return {
        name: course.title,
        completion:
          totalChapters > 0 ? (publishedChapters / totalChapters) * 100 : 0,
        published: publishedChapters,
        total: totalChapters,
      };
    });
  }, [authoredCourses]);

  // Course engagement metrics
  const courseEngagementData = useMemo(() => {
    return authoredCourses.map((course: any) => {
      const totalTopics =
        course.chapters?.reduce(
          (acc: number, chapter: any) => acc + (chapter.topics?.length || 0),
          0
        ) || 0;
      const totalQuizzes =
        course.chapters?.reduce(
          (acc: number, chapter: any) => acc + (chapter.quiz?.length || 0),
          0
        ) || 0;
      const totalResources =
        course.chapters?.reduce(
          (acc: number, chapter: any) => acc + (chapter.resources?.length || 0),
          0
        ) || 0;

      return {
        name: course.title,
        topics: totalTopics,
        quizzes: totalQuizzes,
        resources: totalResources,
        enrollments: course.enrollments?.length || 0,
      };
    });
  }, [authoredCourses]);

  const handlePayoutRequest = () => {
    setIsRequestDialogOpen(false);
    setPayoutAmount("");
    setPayoutNote("");
  };

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-500">Published</Badge>;
      case "DRAFT":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Draft
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

  const generateReport = () => {
    setIsGeneratingReport(true);

    // Simulate report generation delay
    setTimeout(() => {
      setIsGeneratingReport(false);
      setShowReportDialog(true);
    }, 1000);
  };

  const downloadReport = () => {
    if (!reportContentRef.current) return;

    try {
      const reportContent = reportContentRef.current.innerText;
      const blob = new Blob([reportContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
      console.error("Download error:", error);
    }
  };

  const printReport = () => {
    if (!reportContentRef.current) return;

    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Pop-up blocked. Please allow pop-ups for this site.");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1, h2 { color: #333; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            ${reportContentRef.current.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      toast.error("Failed to print report");
      console.error("Print error:", error);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between flex-wrap">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Report</DialogTitle>
                <DialogDescription>
                  Select the type of report you want to generate
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Course Report</SelectItem>
                      <SelectItem value="user">User Report</SelectItem>
                      <SelectItem value="summary">Summary Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={generateReport} disabled={isGeneratingReport}>
                  {isGeneratingReport ? "Generating..." : "Generate Report"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
      {/* <Card>
        <CardHeader>
          <CardTitle>Course Analytics</CardTitle>
          <CardDescription>
            Visualize your course data with different chart types
          </CardDescription>
          <Tabs
            value={activeChartTab}
            onValueChange={setActiveChartTab}
            className="mt-2"
          >
            <TabsList className="grid grid-cols-4 md:w-[400px]">
              <TabsTrigger value="line" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" /> Line
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Bar
              </TabsTrigger>
              <TabsTrigger value="pie" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" /> Pie
              </TabsTrigger>
              <TabsTrigger value="radar" className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" /> Radar
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs>
            <TabsContent value="line" className="mt-0">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    enrollments: {
                      label: "Enrollments",
                      color: "hsl(var(--chart-1))",
                    },
                    revenue: {
                      label: "Revenue (₹)",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="enrollments"
                        stroke="var(--color-enrollments)"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Enrollments"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                        name="Revenue (₹)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="bar" className="mt-0">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    topics: {
                      label: "Topics",
                      color: "hsl(var(--chart-1))",
                    },
                    quizzes: {
                      label: "Quizzes",
                      color: "hsl(var(--chart-2))",
                    },
                    resources: {
                      label: "Resources",
                      color: "hsl(var(--chart-3))",
                    },
                    enrollments: {
                      label: "Enrollments",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courseEngagementData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 70,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="topics"
                        fill="var(--color-topics)"
                        name="Topics"
                      />
                      <Bar
                        dataKey="quizzes"
                        fill="var(--color-quizzes)"
                        name="Quizzes"
                      />
                      <Bar
                        dataKey="resources"
                        fill="var(--color-resources)"
                        name="Resources"
                      />
                      <Bar
                        dataKey="enrollments"
                        fill="var(--color-enrollments)"
                        name="Enrollments"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="pie" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {courseData.map((entry: any, index: any) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} students`, "Enrollment"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="radar" className="mt-0">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={courseEngagementData}
                  >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                    <Radar
                      name="Topics"
                      dataKey="topics"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Quizzes"
                      dataKey="quizzes"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Resources"
                      dataKey="resources"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card> */}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="xs:w-full">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Courses and enrollments by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[50vh] sm:h-[300px] w-full">
              <ChartContainer
                config={{
                  count: {
                    label: "Course Count",
                    color: "hsl(var(--chart-1))",
                  },
                  enrollments: {
                    label: "Enrollments",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer
                  className="w-[100%] md:w-[70%] sm:w-[40%]"
                  height="100%"
                >
                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 20,
                      right: 10, // Reduced for mobile
                      left: 0, // Reduced for mobile
                      bottom: 50, // Adjusted for label rotation
                    }}
                    layout="vertical"
                    className="w-[40%]"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80} // Reduced width for mobile
                      tick={{ fontSize: 12 }} // Smaller font for mobile
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="count"
                      fill="var(--color-count)"
                      name="Course Count"
                      // width={40}
                      className="w-[100%] md:w-[60%] sm:w-[40%]"
                    />
                    <Bar
                      dataKey="enrollments"
                      fill="var(--color-enrollments)"
                      name="Enrollments"
                      className="w-[100%] md:w-[60%] sm:w-[40%]"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="xs:w-full">
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
                    {courseData.map((entry: any, index: any) => (
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
              {authoredCourses.map((course: any) => (
                <TableRow key={course?.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell>₹{course?.price?.toFixed(2)}</TableCell>
                  <TableCell>{course.enrollments.length}</TableCell>
                  <TableCell>
                    ₹{(course?.price * course.enrollments.length).toFixed(2)}
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

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reportType === "course"
                ? "Course Report"
                : reportType === "user"
                  ? "User Report"
                  : "Summary Report"}
            </DialogTitle>
            <DialogDescription>
              Generated on {new Date().toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          <div ref={reportContentRef} className="mt-4 space-y-6">
            {reportType === "course" && (
              <>
                <div className="summary p-4 bg-muted rounded-md">
                  <h2 className="text-xl font-bold mb-2">Course Summary</h2>
                  <p>Total Courses: {totalCourses}</p>
                  <p>Total Enrollments: {totalEnrollments}</p>
                  <p>Total Revenue: ₹{totalRevenue.toLocaleString()}</p>
                  <p>
                    Average Revenue per Course: ₹
                    {totalCourses > 0
                      ? (totalRevenue / totalCourses).toFixed(2)
                      : 0}
                  </p>
                  <p>
                    Average Enrollments per Course:{" "}
                    {totalCourses > 0
                      ? (totalEnrollments / totalCourses).toFixed(2)
                      : 0}
                  </p>
                </div>

                <h2 className="text-xl font-bold">Course Details</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Course Title</th>
                      <th className="border p-2 text-left">Status</th>
                      <th className="border p-2 text-left">Price (₹)</th>
                      <th className="border p-2 text-left">Enrollments</th>
                      <th className="border p-2 text-left">Revenue (₹)</th>
                      <th className="border p-2 text-left">Chapters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authoredCourses.map((course: any) => (
                      <tr key={course.id}>
                        <td className="border p-2">{course.title}</td>
                        <td className="border p-2">{course.status}</td>
                        <td className="border p-2">
                          {course.price?.toFixed(2)}
                        </td>
                        <td className="border p-2">
                          {course.enrollments?.length || 0}
                        </td>
                        <td className="border p-2">
                          {(
                            (course.price || 0) *
                            (course.enrollments?.length || 0)
                          ).toFixed(2)}
                        </td>
                        <td className="border p-2">
                          {course.chapters?.length || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h2 className="text-xl font-bold">Category Distribution</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Courses</th>
                      <th className="border p-2 text-left">Enrollments</th>
                      <th className="border p-2 text-left">Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryData.map((category: any) => (
                      <tr key={category.name}>
                        <td className="border p-2">{category.name}</td>
                        <td className="border p-2">{category.count}</td>
                        <td className="border p-2">{category.enrollments}</td>
                        <td className="border p-2">
                          {category.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {reportType === "user" && (
              <>
                <div className="summary p-4 bg-muted rounded-md">
                  <h2 className="text-xl font-bold mb-2">User Summary</h2>
                  <p>Total Students: {totalStudents.length}</p>
                  <p>Total Enrollments: {totalEnrollments}</p>
                  <p>
                    Average Enrollments per Student:{" "}
                    {totalStudents.length > 0
                      ? (totalEnrollments / totalStudents.length).toFixed(2)
                      : 0}
                  </p>
                  <p>
                    Average Revenue per Student: ₹
                    {totalStudents.length > 0
                      ? (totalRevenue / totalStudents.length).toFixed(2)
                      : 0}
                  </p>
                </div>

                <h2 className="text-xl font-bold">Enrollment Details</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Student Name</th>
                      <th className="border p-2 text-left">Course</th>
                      <th className="border p-2 text-left">Enrollment Date</th>
                      <th className="border p-2 text-left">Price Paid (₹)</th>
                      <th className="border p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authoredCourses.flatMap((course: any) =>
                      course.enrollments.map((enrollment: any) => (
                        <tr key={enrollment.id}>
                          <td className="border p-2">
                            {enrollment.user?.username || "Unknown User"}
                          </td>
                          <td className="border p-2">{course.title}</td>
                          <td className="border p-2">
                            {new Date(
                              enrollment.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="border p-2">
                            {enrollment.price?.toFixed(2)}
                          </td>
                          <td className="border p-2">{enrollment.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </>
            )}

            {reportType === "summary" && (
              <>
                <div className="summary p-4 bg-muted rounded-md">
                  <h2 className="text-xl font-bold mb-2">Executive Summary</h2>
                  <p>Reporting Period: Last 30 days</p>
                  <p>Total Courses: {totalCourses}</p>
                  <p>Total Students: {totalStudents.length}</p>
                  <p>Total Enrollments: {totalEnrollments}</p>
                  <p>Total Revenue: ₹{totalRevenue.toLocaleString()}</p>
                </div>

                <h2 className="text-xl font-bold">Performance Metrics</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Metric</th>
                      <th className="border p-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Average Revenue per Course</td>
                      <td className="border p-2">
                        ₹
                        {totalCourses > 0
                          ? (totalRevenue / totalCourses).toFixed(2)
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        Average Enrollments per Course
                      </td>
                      <td className="border p-2">
                        {totalCourses > 0
                          ? (totalEnrollments / totalCourses).toFixed(2)
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        Average Revenue per Student
                      </td>
                      <td className="border p-2">
                        ₹
                        {totalStudents.length > 0
                          ? (totalRevenue / totalStudents.length).toFixed(2)
                          : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Most Popular Course</td>
                      <td className="border p-2">
                        {authoredCourses.length > 0
                          ? authoredCourses.reduce((prev: any, current: any) =>
                              prev.enrollments?.length >
                              current.enrollments?.length
                                ? prev
                                : current
                            ).title
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Most Profitable Course</td>
                      <td className="border p-2">
                        {authoredCourses.length > 0
                          ? authoredCourses.reduce((prev: any, current: any) =>
                              (prev.price || 0) *
                                (prev.enrollments?.length || 0) >
                              (current.price || 0) *
                                (current.enrollments?.length || 0)
                                ? prev
                                : current
                            ).title
                          : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h2 className="text-xl font-bold">Top Performing Courses</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">Course Title</th>
                      <th className="border p-2 text-left">Enrollments</th>
                      <th className="border p-2 text-left">Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authoredCourses
                      ?.sort(
                        (a: any, b: any) =>
                          (b.price || 0) * (b.enrollments?.length || 0) -
                          (a.price || 0) * (a.enrollments?.length || 0)
                      )
                      .slice(0, 5)
                      .map((course: any) => (
                        <tr key={course.id}>
                          <td className="border p-2">{course.title}</td>
                          <td className="border p-2">
                            {course.enrollments?.length || 0}
                          </td>
                          <td className="border p-2">
                            {(
                              (course.price || 0) *
                              (course.enrollments?.length || 0)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={printReport}>
              <FileText className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={downloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
