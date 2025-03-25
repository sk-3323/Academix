"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import type { AppDispatch } from "@/store/store";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { GetCourseApi } from "@/store/course/slice";
import { GetCategoryApi } from "@/store/category/slice";
import { GetUserApi } from "@/store/user/slice";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import debounce from "lodash/debounce";
import { Progress } from "@/components/ui/progress";
import {
  FileSpreadsheet,
  Users,
  BookOpen,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { DateRange } from "react-day-picker";
// import { DateRangePicker } from "@/components/date-range-picker";

interface PriceRange {
  min: string;
  max: string;
}
interface FilterState {
  searchTerm: string;
  sortBy: string;
  priceRange: PriceRange;
  selectedCategories: string[];
  selectedStatuses: string[];
}
const page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { singleData: userData } = useSelector((state: any) => state.UserStore);
  const { data: enrollments } = useSelector(
    (state: any) => state.EnrollmentStore
  );
  const { data: courses } = useSelector((state: any) => state.CourseStore);
  const { data: categories } = useSelector((state: any) => state.CategoryStore);
  const { data: users } = useSelector((state: any) => state.UserStore);
  console.log(courses);

  const [reportType, setReportType] = useState<
    "course" | "enrollment" | "user"
  >("course");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportName, setReportName] = useState("");
  const [activeTab, setActiveTab] = useState<"generate" | "filters">(
    "generate"
  );
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    sortBy: "newest",
    priceRange: { min: "", max: "" },
    selectedCategories: [],
    selectedStatuses: [],
  });
  const [isDataFetched, setIsDataFetched] = useState(false);
  // Set default report name
  const hasFetchedInitialData = useRef(false);

  // Set default report name
  useEffect(() => {
    setReportName(
      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)}_Report_${format(
        new Date(),
        "yyyy-MM-dd"
      )}`
    );
  }, [reportType]);

  // Fetch initial data only once when userId is available
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || hasFetchedInitialData.current) return; // Skip if no userId or already fetched

    // Check if data is already in the store (optional optimization)
    if (
      enrollments?.length > 0 &&
      courses?.length > 0 &&
      categories?.length > 0 &&
      users?.length > 0
    ) {
      hasFetchedInitialData.current = true;
      return; // Skip fetch if data is already present
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        await Promise.all([
          // dispatch(GetEnrollmentApi({ searchParams: { userId }, signal })),
          dispatch(
            GetCourseApi({
              searchParams: {
                instructorId: userData.id,
              },
              signal,
            })
          ),
          // dispatch(GetUserApi({ searchParams: {}, signal })),
        ]);
        hasFetchedInitialData.current = true; // Mark as fetched
      } catch (error) {
        if (error.name === "AbortError") return; // Ignore abort errors
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data.");
      }
    };

    fetchData();

    // Cleanup: Abort requests if component unmounts
    return () => {
      controller.abort();
    };
  }, [dispatch, session?.user?.id]); // Only depend on userId and dispatch

  const authoredCourses = userData?.authoredCourses || [];

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, searchTerm: value }));
    }, 300),
    []
  );

  // Reset filters and options
  const resetFilters = () => {
    setReportType("course");
    setDateRange({ from: undefined, to: undefined });
    setIncludeDetails(true);
    setIncludeSummary(true);
    setFilters({
      searchTerm: "",
      sortBy: "newest",
      priceRange: { min: "", max: "" },
      selectedCategories: [],
      selectedStatuses: [],
    });
  };

  // Generate Excel report
  const generateReport = async () => {
    if (!includeSummary && !includeDetails) {
      toast.error(
        "Please select at least one report type (Summary or Details)"
      );
      return;
    }

    setIsGenerating(true);
    setProgress(10);

    try {
      const wb = utils.book_new();
      const filteredData = getFilteredData();

      setProgress(30);
      if (includeSummary) {
        const summaryData = generateSummaryData(filteredData);
        const summaryWs = utils.json_to_sheet(summaryData);
        utils.book_append_sheet(wb, summaryWs, "Summary");
        setProgress(60);
      }

      if (includeDetails) {
        const detailsData = generateDetailsData(filteredData);
        const detailsWs = utils.json_to_sheet(detailsData);
        utils.book_append_sheet(wb, detailsWs, "Details");
        setProgress(90);
      }

      writeFile(wb, `${reportName}.xlsx`);
      setProgress(100);
      toast.success("Report generated successfully!");

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report.");
      setIsGenerating(false);
      setProgress(0);
    }
  };

  // Filter data based on report type and filters
  const getFilteredData = () => {
    let filteredItems: any[] = [];

    switch (reportType) {
      case "course":
        filteredItems = [...authoredCourses];
        filteredItems = applyCourseFilters(filteredItems);
        break;
      case "enrollment":
        filteredItems = authoredCourses.flatMap((course) =>
          course.enrollments.map((enrollment) => ({
            ...enrollment,
            courseTitle: course.title,
            courseId: course.id,
            coursePrice: course.price,
            categoryName: course.category?.name || "Uncategorized",
          }))
        );
        filteredItems = applyEnrollmentFilters(filteredItems);
        break;
      case "user":
        filteredItems = getUniqueUsersFromEnrollments();
        filteredItems = applyUserFilters(filteredItems);
        break;
    }

    return filteredItems;
  };

  // Helper functions for filtering
  const applyCourseFilters = (items: any[]) => {
    let result = [...items];

    if (filters.selectedCategories.length > 0) {
      result = result.filter((course) =>
        filters.selectedCategories.includes(
          course.category?.id || "uncategorized"
        )
      );
    }

    if (filters.selectedStatuses.length > 0) {
      result = result.filter((course) =>
        filters.selectedStatuses.includes(course.status)
      );
    }

    if (filters.priceRange.min !== "") {
      result = result.filter(
        (course) => course.price >= Number.parseFloat(filters.priceRange.min)
      );
    }
    if (filters.priceRange.max !== "") {
      result = result.filter(
        (course) => course.price <= Number.parseFloat(filters.priceRange.max)
      );
    }

    if (filters.searchTerm) {
      result = result.filter(
        (course) =>
          course.title
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
      );
    }

    return applySorting(result);
  };

  const applyEnrollmentFilters = (items: any[]) => {
    let result = [...items];

    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((enrollment) => {
        const enrollmentDate = new Date(enrollment.createdAt);
        return enrollmentDate >= fromDate && enrollmentDate <= toDate;
      });
    }

    if (filters.selectedCategories.length > 0) {
      result = result.filter((enrollment) =>
        filters.selectedCategories.includes(
          enrollment.courseCategory || "uncategorized"
        )
      );
    }

    if (filters.selectedStatuses.length > 0) {
      result = result.filter((enrollment) =>
        filters.selectedStatuses.includes(enrollment.status)
      );
    }

    if (filters.searchTerm) {
      result = result.filter(
        (enrollment) =>
          enrollment.courseTitle
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          enrollment.user?.username
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          enrollment.user?.email
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase())
      );
    }

    return applySorting(result);
  };

  const getUniqueUsersFromEnrollments = () => {
    const userMap = new Map();
    authoredCourses.forEach((course) => {
      course.enrollments.forEach((enrollment) => {
        if (enrollment.user && !userMap.has(enrollment.user.id)) {
          const userEnrollments = authoredCourses.flatMap((c) =>
            c.enrollments.filter((e) => e.user?.id === enrollment.user.id)
          );
          const totalSpent = userEnrollments.reduce(
            (sum, e) => sum + (e.price || 0),
            0
          );
          userMap.set(enrollment.user.id, {
            ...enrollment.user,
            totalSpent,
            coursesEnrolled: userEnrollments.length,
            lastEnrollment: userEnrollments.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0]?.createdAt,
            enrollments: userEnrollments,
          });
        }
      });
    });
    return Array.from(userMap.values());
  };

  const applyUserFilters = (items: any[]) => {
    let result = [...items];

    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((user) => {
        if (!user.lastEnrollment) return false;
        const lastEnrollmentDate = new Date(user.lastEnrollment);
        return lastEnrollmentDate >= fromDate && lastEnrollmentDate <= toDate;
      });
    }

    if (filters.searchTerm) {
      result = result.filter(
        (user) =>
          user.username
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          user.email
            ?.toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) ||
          user.name?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    return applySorting(result);
  };

  const applySorting = (items: any[]) => {
    const result = [...items];
    switch (filters.sortBy) {
      case "newest":
        return result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-high":
        return result.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "price-low":
        return result.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "enrollments":
        return result.sort(
          (a, b) =>
            (b.enrollments?.length || b.coursesEnrolled || 0) -
            (a.enrollments?.length || a.coursesEnrolled || 0)
        );
      case "revenue":
        return result.sort((a, b) => {
          const revenueA =
            reportType === "user"
              ? a.totalSpent
              : (a.price || 0) * (a.enrollments?.length || 0);
          const revenueB =
            reportType === "user"
              ? b.totalSpent
              : (b.price || 0) * (b.enrollments?.length || 0);
          return revenueB - revenueA;
        });
      default:
        return result;
    }
  };

  // Generate summary data based on report type
  const generateSummaryData = (filteredData: any[]) => {
    const summaryData = [];

    switch (reportType) {
      case "course":
        // Calculate summary metrics
        const totalCourses = filteredData.length;
        const totalEnrollments = filteredData.reduce(
          (sum, course) => sum + (course.enrollments?.length || 0),
          0
        );
        const totalRevenue = filteredData.reduce(
          (sum, course) =>
            sum + (course.price || 0) * (course.enrollments?.length || 0),
          0
        );
        const avgEnrollmentsPerCourse =
          totalCourses > 0 ? totalEnrollments / totalCourses : 0;
        const avgRevenuePerCourse =
          totalCourses > 0 ? totalRevenue / totalCourses : 0;

        // Category breakdown
        const categoryStats = {};
        filteredData.forEach((course) => {
          const categoryName = course.category?.name || "Uncategorized";
          if (!categoryStats[categoryName]) {
            categoryStats[categoryName] = {
              courses: 0,
              enrollments: 0,
              revenue: 0,
            };
          }
          categoryStats[categoryName].courses++;
          categoryStats[categoryName].enrollments +=
            course.enrollments?.length || 0;
          categoryStats[categoryName].revenue +=
            (course.price || 0) * (course.enrollments?.length || 0);
        });

        // Status breakdown
        const statusStats = {};
        filteredData.forEach((course) => {
          const status = course.status || "Unknown";
          if (!statusStats[status]) {
            statusStats[status] = { courses: 0, enrollments: 0, revenue: 0 };
          }
          statusStats[status].courses++;
          statusStats[status].enrollments += course.enrollments?.length || 0;
          statusStats[status].revenue +=
            (course.price || 0) * (course.enrollments?.length || 0);
        });

        // Top performing courses
        const topCourses = [...filteredData]
          .sort(
            (a, b) =>
              (b.price || 0) * (b.enrollments?.length || 0) -
              (a.price || 0) * (a.enrollments?.length || 0)
          )
          .slice(0, 5)
          .map((course) => ({
            Title: course.title,
            Category: course.category?.name || "Uncategorized",
            Price: course.price || 0,
            Enrollments: course.enrollments?.length || 0,
            Revenue: (course.price || 0) * (course.enrollments?.length || 0),
          }));

        // Add summary header
        summaryData.push(
          { A: "COURSE REPORT SUMMARY", B: "", C: "", D: "", E: "" },
          {
            A: "Generated On:",
            B: format(new Date(), "PPP p"),
            C: "",
            D: "",
            E: "",
          },
          { A: "", B: "", C: "", D: "", E: "" },
          { A: "OVERALL METRICS", B: "", C: "", D: "", E: "" },
          { A: "Total Courses:", B: totalCourses, C: "", D: "", E: "" },
          { A: "Total Enrollments:", B: totalEnrollments, C: "", D: "", E: "" },
          {
            A: "Total Revenue:",
            B: `₹${totalRevenue.toFixed(2)}`,
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Avg. Enrollments per Course:",
            B: avgEnrollmentsPerCourse.toFixed(2),
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Avg. Revenue per Course:",
            B: `₹${avgRevenuePerCourse.toFixed(2)}`,
            C: "",
            D: "",
            E: "",
          },
          { A: "", B: "", C: "", D: "", E: "" },
          {
            A: "CATEGORY BREAKDOWN",
            B: "Courses",
            C: "Enrollments",
            D: "Revenue",
            E: "% of Total Revenue",
          }
        );

        // Add category stats
        Object.entries(categoryStats).forEach(([category, stats]) => {
          summaryData.push({
            A: category,
            B: stats.courses,
            C: stats.enrollments,
            D: `₹${stats.revenue.toFixed(2)}`,
            E: `${((stats.revenue / totalRevenue) * 100).toFixed(2)}%`,
          });
        });

        // Add status breakdown
        summaryData.push(
          { A: "", B: "", C: "", D: "", E: "" },
          {
            A: "STATUS BREAKDOWN",
            B: "Courses",
            C: "Enrollments",
            D: "Revenue",
            E: "% of Total Revenue",
          }
        );

        Object.entries(statusStats).forEach(([status, stats]) => {
          summaryData.push({
            A: status,
            B: stats.courses,
            C: stats.enrollments,
            D: `₹${stats.revenue.toFixed(2)}`,
            E: `${((stats.revenue / totalRevenue) * 100).toFixed(2)}%`,
          });
        });

        // Add top courses
        summaryData.push(
          { A: "", B: "", C: "", D: "", E: "" },
          {
            A: "TOP PERFORMING COURSES",
            B: "Category",
            C: "Price",
            D: "Enrollments",
            E: "Revenue",
          }
        );

        topCourses.forEach((course) => {
          summaryData.push({
            A: course.Title,
            B: course.Category,
            C: `₹${course.Price.toFixed(2)}`,
            D: course.Enrollments,
            E: `₹${course.Revenue.toFixed(2)}`,
          });
        });
        break;

      case "enrollment":
        // Calculate summary metrics
        const totalEnrollmentsCount = filteredData.length;
        const totalEnrollmentRevenue = filteredData.reduce(
          (sum, enrollment) => sum + (enrollment.price || 0),
          0
        );
        const avgEnrollmentPrice =
          totalEnrollmentsCount > 0
            ? totalEnrollmentRevenue / totalEnrollmentsCount
            : 0;

        // Course breakdown
        const courseEnrollmentStats = {};
        filteredData.forEach((enrollment) => {
          const courseId = enrollment.courseId;
          const courseTitle = enrollment.courseTitle || "Unknown Course";

          if (!courseEnrollmentStats[courseId]) {
            courseEnrollmentStats[courseId] = {
              title: courseTitle,
              count: 0,
              revenue: 0,
            };
          }

          courseEnrollmentStats[courseId].count++;
          courseEnrollmentStats[courseId].revenue += enrollment.price || 0;
        });

        // Time period breakdown (monthly)
        const monthlyStats = {};
        filteredData.forEach((enrollment) => {
          const date = new Date(enrollment.createdAt);
          const monthYear = format(date, "MMM yyyy");

          if (!monthlyStats[monthYear]) {
            monthlyStats[monthYear] = { count: 0, revenue: 0 };
          }

          monthlyStats[monthYear].count++;
          monthlyStats[monthYear].revenue += enrollment.price || 0;
        });

        // Add summary header
        summaryData.push(
          { A: "ENROLLMENT REPORT SUMMARY", B: "", C: "", D: "", E: "" },
          {
            A: "Generated On:",
            B: format(new Date(), "PPP p"),
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Date Range:",
            B:
              dateRange.from && dateRange.to
                ? `${format(new Date(dateRange.from), "PPP")} to ${format(new Date(dateRange.to), "PPP")}`
                : "All Time",
            C: "",
            D: "",
            E: "",
          },
          { A: "", B: "", C: "", D: "", E: "" },
          { A: "OVERALL METRICS", B: "", C: "", D: "", E: "" },
          {
            A: "Total Enrollments:",
            B: totalEnrollmentsCount,
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Total Revenue:",
            B: `₹${totalEnrollmentRevenue.toFixed(2)}`,
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Average Enrollment Price:",
            B: `₹${avgEnrollmentPrice.toFixed(2)}`,
            C: "",
            D: "",
            E: "",
          },
          { A: "", B: "", C: "", D: "", E: "" },
          {
            A: "COURSE BREAKDOWN",
            B: "Enrollments",
            C: "Revenue",
            D: "% of Total Enrollments",
            E: "% of Total Revenue",
          }
        );

        // Add course stats
        Object.values(courseEnrollmentStats).forEach((stats) => {
          summaryData.push({
            A: stats.title,
            B: stats.count,
            C: `₹${stats.revenue.toFixed(2)}`,
            D: `${((stats.count / totalEnrollmentsCount) * 100).toFixed(2)}%`,
            E: `${((stats.revenue / totalEnrollmentRevenue) * 100).toFixed(2)}%`,
          });
        });

        // Add monthly breakdown
        summaryData.push(
          { A: "", B: "", C: "", D: "", E: "" },
          {
            A: "MONTHLY BREAKDOWN",
            B: "Enrollments",
            C: "Revenue",
            D: "% of Total Enrollments",
            E: "% of Total Revenue",
          }
        );

        // Sort months chronologically
        const sortedMonths = Object.keys(monthlyStats).sort((a, b) => {
          const dateA = new Date(a);
          const dateB = new Date(b);
          return dateA.getTime() - dateB.getTime();
        });

        sortedMonths.forEach((month) => {
          const stats = monthlyStats[month];
          summaryData.push({
            A: month,
            B: stats.count,
            C: `₹${stats.revenue.toFixed(2)}`,
            D: `${((stats.count / totalEnrollmentsCount) * 100).toFixed(2)}%`,
            E: `${((stats.revenue / totalEnrollmentRevenue) * 100).toFixed(2)}%`,
          });
        });
        break;

      case "user":
        // Calculate summary metrics
        const totalUsers = filteredData.length;
        const totalUserEnrollments = filteredData.reduce(
          (sum, user) => sum + (user.coursesEnrolled || 0),
          0
        );
        const totalUserRevenue = filteredData.reduce(
          (sum, user) => sum + (user.totalSpent || 0),
          0
        );
        const avgEnrollmentsPerUser =
          totalUsers > 0 ? totalUserEnrollments / totalUsers : 0;
        const avgRevenuePerUser =
          totalUsers > 0 ? totalUserRevenue / totalUsers : 0;

        // Enrollment count breakdown
        const enrollmentCountStats = {
          "1 course": { users: 0, revenue: 0 },
          "2-3 courses": { users: 0, revenue: 0 },
          "4-5 courses": { users: 0, revenue: 0 },
          "6+ courses": { users: 0, revenue: 0 },
        };

        filteredData.forEach((user) => {
          const count = user.coursesEnrolled || 0;
          const revenue = user.totalSpent || 0;

          if (count === 1) {
            enrollmentCountStats["1 course"].users++;
            enrollmentCountStats["1 course"].revenue += revenue;
          } else if (count >= 2 && count <= 3) {
            enrollmentCountStats["2-3 courses"].users++;
            enrollmentCountStats["2-3 courses"].revenue += revenue;
          } else if (count >= 4 && count <= 5) {
            enrollmentCountStats["4-5 courses"].users++;
            enrollmentCountStats["4-5 courses"].revenue += revenue;
          } else if (count >= 6) {
            enrollmentCountStats["6+ courses"].users++;
            enrollmentCountStats["6+ courses"].revenue += revenue;
          }
        });

        // Top spending users
        const topUsers = [...filteredData]
          .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
          .slice(0, 5)
          .map((user) => ({
            Username: user.username || "Unknown",
            Email: user.email || "N/A",
            Courses: user.coursesEnrolled || 0,
            TotalSpent: user.totalSpent || 0,
            LastEnrollment: user.lastEnrollment
              ? format(new Date(user.lastEnrollment), "PPP")
              : "N/A",
          }));

        // Add summary header
        summaryData.push(
          { A: "USER REPORT SUMMARY", B: "", C: "", D: "", E: "" },
          {
            A: "Generated On:",
            B: format(new Date(), "PPP p"),
            C: "",
            D: "",
            E: "",
          },
          { A: "", B: "", C: "", D: "", E: "" },
          { A: "OVERALL METRICS", B: "", C: "", D: "", E: "" },
          { A: "Total Users:", B: totalUsers, C: "", D: "", E: "" },
          {
            A: "Total Enrollments:",
            B: totalUserEnrollments,
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Total Revenue:",
            B: `₹${totalUserRevenue.toFixed(2)}`,
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Avg. Enrollments per User:",
            B: avgEnrollmentsPerUser.toFixed(2),
            C: "",
            D: "",
            E: "",
          },
          {
            A: "Avg. Revenue per User:",
            B: `₹${avgRevenuePerUser.toFixed(2)}`,
            C: "",
            D: "",
            E: "",
          },
          { A: "", B: "", C: "", D: "", E: "" },
          {
            A: "ENROLLMENT COUNT BREAKDOWN",
            B: "Users",
            C: "% of Total Users",
            D: "Revenue",
            E: "% of Total Revenue",
          }
        );

        // Add enrollment count stats
        Object.entries(enrollmentCountStats).forEach(([range, stats]) => {
          summaryData.push({
            A: range,
            B: stats.users,
            C: `${((stats.users / totalUsers) * 100).toFixed(2)}%`,
            D: `₹${stats.revenue.toFixed(2)}`,
            E: `${((stats.revenue / totalUserRevenue) * 100).toFixed(2)}%`,
          });
        });

        // Add top users
        summaryData.push(
          { A: "", B: "", C: "", D: "", E: "" },
          {
            A: "TOP SPENDING USERS",
            B: "Email",
            C: "Courses Enrolled",
            D: "Total Spent",
            E: "Last Enrollment",
          }
        );

        topUsers.forEach((user) => {
          summaryData.push({
            A: user.Username,
            B: user.Email,
            C: user.Courses,
            D: `₹${user.TotalSpent.toFixed(2)}`,
            E: user.LastEnrollment,
          });
        });
        break;
    }

    return summaryData;
  };

  // Generate detailed data based on report type
  const generateDetailsData = (filteredData: any[]) => {
    const detailsData = [];

    switch (reportType) {
      case "course":
        // Add header row
        detailsData.push({
          A: "Course Title",
          B: "Category",
          C: "Status",
          D: "Price (₹)",
          E: "Enrollments",
          F: "Revenue (₹)",
          G: "Chapters",
          H: "Topics",
          I: "Quizzes",
          J: "Resources",
          K: "Created Date",
          L: "Last Updated",
        });

        // Add course details
        filteredData.forEach((course) => {
          const totalTopics =
            course.chapters?.reduce(
              (sum, chapter) => sum + (chapter.topics?.length || 0),
              0
            ) || 0;
          const totalQuizzes =
            course.chapters?.reduce(
              (sum, chapter) => sum + (chapter.quiz?.length || 0),
              0
            ) || 0;
          const totalResources =
            course.chapters?.reduce(
              (sum, chapter) => sum + (chapter.resources?.length || 0),
              0
            ) || 0;

          detailsData.push({
            A: course.title || "Untitled",
            B: course.category?.name || "Uncategorized",
            C: course.status || "Unknown",
            D: (course.price || 0).toFixed(2),
            E: course.enrollments?.length || 0,
            F: (
              (course.price || 0) * (course.enrollments?.length || 0)
            ).toFixed(2),
            G: course.chapters?.length || 0,
            H: totalTopics,
            I: totalQuizzes,
            J: totalResources,
            K: course.createdAt
              ? format(new Date(course.createdAt), "PPP")
              : "N/A",
            L: course.updatedAt
              ? format(new Date(course.updatedAt), "PPP")
              : "N/A",
          });
        });
        break;

      case "enrollment":
        // Add header row
        detailsData.push({
          A: "Student Name",
          B: "Student Email",
          C: "Course Title",
          D: "Category",
          E: "Enrollment Date",
          F: "Price Paid (₹)",
          G: "Status",
          H: "Payment Method",
          I: "Transaction ID",
        });

        // Add enrollment details
        filteredData.forEach((enrollment) => {
          detailsData.push({
            A: enrollment.user?.username || "Unknown User",
            B: enrollment.user?.email || "N/A",
            C: enrollment.courseTitle || "Unknown Course",
            D: enrollment.categoryName || "Uncategorized",
            E: enrollment.createdAt
              ? format(new Date(enrollment.createdAt), "PPP")
              : "N/A",
            F: (enrollment.price || 0).toFixed(2),
            G: enrollment.status || "Unknown",
            H: enrollment.paymentMethod || "N/A",
            I: enrollment.transactionId || "N/A",
          });
        });
        break;

      case "user":
        // Add header row
        detailsData.push({
          A: "Username",
          B: "Email",
          C: "Name",
          D: "Courses Enrolled",
          E: "Total Spent (₹)",
          F: "Last Enrollment Date",
          G: "User Since",
          H: "Role",
        });

        // Add user details
        filteredData.forEach((user) => {
          detailsData.push({
            A: user.username || "Unknown",
            B: user.email || "N/A",
            C: user.name || "N/A",
            D: user.coursesEnrolled || 0,
            E: (user.totalSpent || 0).toFixed(2),
            F: user.lastEnrollment
              ? format(new Date(user.lastEnrollment), "PPP")
              : "N/A",
            G: user.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A",
            H: user.role || "Student",
          });

          // If detailed enrollments are needed, add them below each user
          if (user.enrollments && user.enrollments.length > 0) {
            detailsData.push({
              A: "  Course Enrollments:",
              B: "Course Title",
              C: "Enrollment Date",
              D: "Price Paid (₹)",
              E: "Status",
              F: "",
              G: "",
              H: "",
            });

            user.enrollments.forEach((enrollment, index) => {
              const courseTitle =
                authoredCourses.find((c) => c.id === enrollment.courseId)
                  ?.title || "Unknown Course";

              detailsData.push({
                A: `  ${index + 1}.`,
                B: courseTitle,
                C: enrollment.createdAt
                  ? format(new Date(enrollment.createdAt), "PPP")
                  : "N/A",
                D: (enrollment.price || 0).toFixed(2),
                E: enrollment.status || "Unknown",
                F: "",
                G: "",
                H: "",
              });
            });

            // Add a blank row after each user's enrollments
            detailsData.push({
              A: "",
              B: "",
              C: "",
              D: "",
              E: "",
              F: "",
              G: "",
              H: "",
            });
          }
        });
        break;
    }

    return detailsData;
  };
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate detailed reports for your courses, enrollments, and users
          </p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            Report Generator
          </CardTitle>
          <CardDescription>
            Generate detailed Excel reports for courses, enrollments, and users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Report</TabsTrigger>
              <TabsTrigger value="filters">Filters & Options</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="course">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>Course Report</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="enrollment">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>Enrollment Report</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>User Report</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      placeholder="Enter report name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Report Content</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-summary"
                        checked={includeSummary}
                        onCheckedChange={setIncludeSummary}
                      />
                      <Label htmlFor="include-summary" className="font-normal">
                        Include Summary
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-details"
                        checked={includeDetails}
                        onCheckedChange={setIncludeDetails}
                      />
                      <Label htmlFor="include-details" className="font-normal">
                        Include Details
                      </Label>
                    </div>
                  </div>
                </div>

                {(reportType === "enrollment" || reportType === "user") && (
                  <div className="space-y-2">
                    <Label>
                      {reportType === "enrollment"
                        ? "Enrollment"
                        : "Last Enrollment"}{" "}
                      Date Range
                    </Label>
                    {/* Uncomment and implement DateRangePicker */}
                    {/* <DateRangePicker value={dateRange} onChange={setDateRange} /> */}
                  </div>
                )}

                {isGenerating && (
                  <div className="space-y-2">
                    <Label>Generating Report...</Label>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="search-term">Search</Label>
                  <Input
                    id="search-term"
                    placeholder={`Search ${reportType}s...`}
                    onChange={(e) => debouncedSearch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sort-by">Sort By</Label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        setFilters((prev) => ({ ...prev, sortBy: value }))
                      }
                    >
                      <SelectTrigger id="sort-by">
                        <SelectValue placeholder="Select sort order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        {(reportType === "course" ||
                          reportType === "enrollment") && (
                          <>
                            <SelectItem value="price-high">
                              Price (High to Low)
                            </SelectItem>
                            <SelectItem value="price-low">
                              Price (Low to High)
                            </SelectItem>
                          </>
                        )}
                        {(reportType === "course" || reportType === "user") && (
                          <>
                            <SelectItem value="enrollments">
                              Most Enrollments
                            </SelectItem>
                            <SelectItem value="revenue">
                              Highest Revenue
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {(reportType === "course" || reportType === "enrollment") && (
                    <div className="space-y-2">
                      <Label>Price Range (₹)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.priceRange.min}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: {
                                ...prev.priceRange,
                                min: e.target.value,
                              },
                            }))
                          }
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.priceRange.max}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: {
                                ...prev.priceRange,
                                max: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                {(reportType === "course" || reportType === "enrollment") && (
                  <>
                    <div className="space-y-2">
                      <Label>Categories</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categories.map((category: any) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${category.id}`}
                              checked={filters.selectedCategories.includes(
                                category.id
                              )}
                              onCheckedChange={(checked) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  selectedCategories: checked
                                    ? [...prev.selectedCategories, category.id]
                                    : prev.selectedCategories.filter(
                                        (id) => id !== category.id
                                      ),
                                }))
                              }
                            />
                            <Label
                              htmlFor={`category-${category.id}`}
                              className="font-normal"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {["PUBLISHED", "DRAFT"].map((status) => (
                          <div
                            key={status}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`status-${status}`}
                              checked={filters.selectedStatuses.includes(
                                status
                              )}
                              onCheckedChange={(checked) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  selectedStatuses: checked
                                    ? [...prev.selectedStatuses, status]
                                    : prev.selectedStatuses.filter(
                                        (s) => s !== status
                                      ),
                                }))
                              }
                            />
                            <Label
                              htmlFor={`status-${status}`}
                              className="font-normal"
                            >
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetFilters}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Generate Excel Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
