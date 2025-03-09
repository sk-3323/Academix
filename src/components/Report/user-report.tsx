"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { User } from "../../../types/allType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Assuming you have a Dialog component
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Logo component for consistent branding
const CompanyLogo = () => (
  <div className="flex items-center justify-center mb-4">
    <div className="w-16 h-16 rounded-full flex items-center justify-center">
      <img
        src="/assets/logos/dark-logo.svg"
        height={100}
        width={150}
        alt="Acedemix Logo"
      />
    </div>
    <img
      src="/assets/logos/light-name.svg"
      height={100}
      width={150}
      alt="Acedemix"
    />
  </div>
);

// Report section component for consistent styling
const ReportSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
    <p className="text-gray-600 mb-4 text-center">{description}</p>
    {children}
  </div>
);

const ReportGenerator = ({ userData }: { userData: User[] }) => {
  const [roleChartData, setRoleChartData] = useState<any>(null);
  const [enrollmentChartData, setEnrollmentChartData] = useState<any>(null);
  const [courseCompletionData, setCourseCompletionData] = useState<any>(null);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Refs for each section to capture for PDF
  const headerRef = useRef<HTMLDivElement>(null);
  const roleChartRef = useRef<HTMLDivElement>(null);
  const enrollmentChartRef = useRef<HTMLDivElement>(null);
  const userSummaryRef = useRef<HTMLDivElement>(null);
  const courseCompletionRef = useRef<HTMLDivElement>(null);

  // Process data when "Generate Report" is clicked
  const processReportData = () => {
    // Process Role Distribution (Pie Chart)
    const roleCounts = userData.reduce((acc: any, user: User) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    setRoleChartData({
      labels: Object.keys(roleCounts),
      datasets: [
        {
          label: "User Roles",
          data: Object.values(roleCounts),
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });

    // Process Enrollment Counts by Course (Bar Chart)
    const courseEnrollments = userData
      .flatMap((user) => user.enrollments)
      .reduce((acc: any, enrollment: any) => {
        const courseTitle = enrollment.course?.title || "Unknown Course";
        acc[courseTitle] = (acc[courseTitle] || 0) + 1;
        return acc;
      }, {});

    setEnrollmentChartData({
      labels: Object.keys(courseEnrollments),
      datasets: [
        {
          label: "Enrollments",
          data: Object.values(courseEnrollments),
          backgroundColor: "rgba(54, 162, 235, 0.8)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });

    // Mock data for course completion rates
    setCourseCompletionData({
      labels: Object.keys(courseEnrollments),
      datasets: [
        {
          label: "Completion Rate (%)",
          data: Object.keys(courseEnrollments).map(
            () => Math.floor(Math.random() * 40) + 60
          ),
          backgroundColor: "rgba(75, 192, 192, 0.8)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });

    setIsReportGenerated(true);
  };

  // Chart options
  const pieChartOptions: any = {
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Distribution by Role",
        font: { size: 16 },
      },
    },
    maintainAspectRatio: false,
  };

  const barChartOptions: any = {
    plugins: { legend: { position: "bottom" } },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Students" },
      },
      x: { title: { display: true, text: "Course Name" } },
    },
    maintainAspectRatio: false,
  };

  // Generate PDF
  const generatePDF = async () => {
    if (
      !headerRef.current ||
      !roleChartRef.current ||
      !enrollmentChartRef.current ||
      !userSummaryRef.current ||
      !courseCompletionRef.current
    )
      return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;

    const addSectionToPDF = async (
      element: HTMLElement,
      title: string,
      currentY: number
    ) => {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (currentY + imgHeight + 20 > pageHeight) {
        doc.addPage();
        currentY = margin;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, currentY + 5);
      currentY += 10;

      doc.addImage(imgData, "PNG", margin, currentY, imgWidth, imgHeight);
      return currentY + imgHeight + 15;
    };

    const headerCanvas = await html2canvas(headerRef.current, {
      scale: 2,
      useCORS: true,
    });
    const headerImgData = headerCanvas.toDataURL("image/png");
    const headerImgWidth = contentWidth;
    const headerImgHeight =
      (headerCanvas.height * headerImgWidth) / headerCanvas.width;

    doc.addImage(
      headerImgData,
      "PNG",
      margin,
      margin,
      headerImgWidth,
      headerImgHeight
    );

    let currentY = margin + headerImgHeight + 5;
    doc.setFontSize(10);
    doc.text(
      `Report Generated: ${new Date().toLocaleDateString()}`,
      margin,
      currentY
    );
    currentY += 10;

    currentY = await addSectionToPDF(
      roleChartRef.current,
      "User Role Distribution",
      currentY
    );
    currentY = await addSectionToPDF(
      enrollmentChartRef.current,
      "Course Enrollment Analysis",
      currentY
    );
    currentY = await addSectionToPDF(
      courseCompletionRef.current,
      "Course Completion Rates",
      currentY
    );
    await addSectionToPDF(
      userSummaryRef.current,
      "User Summary Data",
      currentY
    );

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Acedemix Educational Analytics - Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    doc.save("acedemix-user-report.pdf");
  };

  const ReportContent = () => (
    <div className="font-sans p-6 max-w-4xl mx-auto bg-white">
      <div ref={headerRef} className="text-center mb-8">
        <CompanyLogo />
        <h2 className="text-3xl font-bold text-gray-800 mt-4">
          Comprehensive User Analytics Report
        </h2>
        <p className="text-gray-600 mt-2">
          This report provides detailed insights into user demographics, course
          enrollments, and educational metrics.
        </p>
      </div>

      <div ref={roleChartRef}>
        <ReportSection
          title="User Role Distribution"
          description="Analysis of user composition by role type across the platform."
        >
          <div className="h-[300px]">
            <Pie data={roleChartData} options={pieChartOptions} />
          </div>
        </ReportSection>
      </div>

      <div ref={enrollmentChartRef}>
        <ReportSection
          title="Course Enrollment Analysis"
          description="Overview of student enrollment distribution across available courses."
        >
          <div className="h-[300px]">
            <Bar data={enrollmentChartData} options={barChartOptions} />
          </div>
        </ReportSection>
      </div>

      <div ref={courseCompletionRef}>
        <ReportSection
          title="Course Completion Rates"
          description="Analysis of student completion percentages across different courses."
        >
          <div className="h-[300px]">
            <Bar
              data={courseCompletionData}
              options={{
                ...barChartOptions,
                scales: {
                  ...barChartOptions.scales,
                  y: {
                    ...barChartOptions.scales.y,
                    title: { text: "Completion Rate (%)" },
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </ReportSection>
      </div>

      <div ref={userSummaryRef}>
        <ReportSection
          title="User Summary Data"
          description="Detailed breakdown of individual user statistics and engagement metrics."
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">
                    Username
                  </th>
                  <th className="border border-gray-300 p-2 text-left">Role</th>
                  <th className="border border-gray-300 p-2 text-left">
                    Enrollments
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Authored Courses
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Verified
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">
                      {user.username}
                    </td>
                    <td className="border border-gray-300 p-2">{user.role}</td>
                    <td className="border border-gray-300 p-2">
                      {user?.enrollments?.length || 0}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user?.authoredCourses?.length || 0}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${user.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {user.isVerified ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(
                        user.updatedAt || Date.now()
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {!isReportGenerated ? (
        <div className="flex justify-center">
          <Button
            onClick={processReportData}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIsPreviewOpen(true)}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9v2m0 14v2m-9-5h2m14 0h2m-7-7l-2-2m2 2l2-2m-2 2l-2 2m2-2l2 2"
              />
            </svg>
            Preview
          </Button>
        </div>
      )}

      {/* Modal for Preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Report</DialogTitle>
          </DialogHeader>
          <div>
            {roleChartData && enrollmentChartData && courseCompletionData && (
              <ReportContent />
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              onClick={generatePDF}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportGenerator;
