// "use client";

// import { Button } from "@/components/ui/button";
// import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
// import { AppDispatch } from "@/store/store";
// import { GetPublishedTopicWithProgressApi } from "@/store/topic/slice";
// import { AddUserProgressApi } from "@/store/user-progress/slice";
// import { CheckCircle, ShieldCheck, XCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";

// interface CourseProgressButtonProps {
//   topicId: string;
//   courseId: string;
//   setActions: any;
//   nextTopicId?: string;
//   isCompleted?: boolean;
//   startConfetti: any;
//   nextType: string;
// }

// const CourseProgressButton = ({
//   topicId,
//   courseId,
//   nextTopicId,
//   isCompleted,
//   setActions,
//   startConfetti,
//   nextType,
// }: CourseProgressButtonProps) => {
//   const Icon = isCompleted ? XCircle : CheckCircle;
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
//   const [isLoading, setIsLoading] = useState(false);
//   const { singleData: courseData } = useSelector(
//     (state: any) => state.CourseStore
//   );

//   const handleSuccess = async () => {
//     try {
//       dispatch(
//         GetSingleCourseWithProgressApi({
//           id: courseId,
//         })
//       );

//       if (!isCompleted && !nextTopicId) {
//         startConfetti();
//       }

//       if (!isCompleted && nextTopicId) {
//         if (nextType === "TOPIC") {
//           router.push(`/courses/${courseId}/topics/${nextTopicId}`);
//         } else if (nextType === "QUIZ") {
//           router.push(`/courses/${courseId}/quiz/${nextTopicId}`);
//         }
//       } else {
//         dispatch(
//           GetPublishedTopicWithProgressApi({
//             courseId: courseId,
//             topicId: topicId,
//           })
//         );
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error?.message);
//       throw error;
//     }
//   };

//   const handleClick = async () => {
//     try {
//       setIsLoading(true);

//       setActions((current: any) => {
//         return { ...current, callbackFunction: handleSuccess };
//       });

//       await dispatch(
//         AddUserProgressApi({
//           values: {
//             isCompleted: !isCompleted,
//             topicId: topicId,
//           },
//           requiredFields: ["isCompleted", "topicId"],
//         })
//       );
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error?.message);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const handleGenerateCertificate = async () => {
//     try {
//       setIsLoading(true);
//       // await dispatch(GetSingleC);
//       // Generate Certificate Logic Here
//       // dispatch(GenerateCertificateApi({ courseId: courseId, topicId: topicId }));
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error?.message);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="flex gap-3">
//       <Button
//         type="button"
//         variant={isCompleted ? "outline" : "success"}
//         className="w-full md:w-auto"
//         onClick={handleClick}
//         disabled={isLoading}
//       >
//         {isCompleted ? "Not Completed" : "Mark as complete"}
//         <Icon className="w-4 h-4 ml-2" />
//       </Button>
//       {!isCompleted && !nextTopicId && (
//         <Button
//           type="button"
//           variant={"destructive"}
//           className="w-full md:w-auto"
//           onClick={handleGenerateCertificate}
//           disabled={isLoading}
//         >
//           Generate Certificate
//           <ShieldCheck className="w-4 h-4 ml-2" />
//         </Button>
//       )}
//     </div>
//   );
// };

// export default CourseProgressButton;
"use client";

import { Button } from "@/components/ui/button";
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { GetPublishedTopicWithProgressApi } from "@/store/topic/slice";
import { AddUserProgressApi } from "@/store/user-progress/slice";
import { CheckCircle, ShieldCheck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { jsPDF } from "jspdf"; // Import jsPDF

interface CourseProgressButtonProps {
  topicId: string;
  courseId: string;
  setActions: any;
  nextTopicId?: string;
  isCompleted?: boolean;
  startConfetti: any;
  nextType: string;
}

const CourseProgressButton = ({
  topicId,
  courseId,
  nextTopicId,
  isCompleted,
  setActions,
  startConfetti,
  nextType,
}: CourseProgressButtonProps) => {
  const Icon = isCompleted ? XCircle : CheckCircle;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const { singleData: courseData } = useSelector((state: any) => state.CourseStore);

  const handleSuccess = async () => {
    try {
      dispatch(GetSingleCourseWithProgressApi({ id: courseId }));

      if (!isCompleted && !nextTopicId) {
        startConfetti();
      }

      if (!isCompleted && nextTopicId) {
        if (nextType === "TOPIC") {
          router.push(`/courses/${courseId}/topics/${nextTopicId}`);
        } else if (nextType === "QUIZ") {
          router.push(`/courses/${courseId}/quiz/${nextTopicId}`);
        }
      } else {
        dispatch(GetPublishedTopicWithProgressApi({ courseId, topicId }));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    }
  };

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setActions((current: any) => ({ ...current, callbackFunction: handleSuccess }));
      await dispatch(
        AddUserProgressApi({
          values: { isCompleted: !isCompleted, topicId },
          requiredFields: ["isCompleted", "topicId"],
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      setIsLoading(true);

      // Ensure course data is available
      if (!courseData) {
        toast.error("Course data not available");
        return;
      }

      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Certificate Dimensions (A4: 297mm x 210mm in landscape)
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Add Watermark (diagonal text)
      doc.setFontSize(50);
      doc.setTextColor(200, 200, 200); // Light gray for watermark
      doc.text("ACADEMIX CERTIFICATE", pageWidth / 2, pageHeight / 2, {
        angle: 45,
        align: "center",
      });

      // Reset text color for main content
      doc.setTextColor(0, 0, 0);

      // Certificate Border
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20); // Border 10mm from edges

      // Title
      doc.setFontSize(30);
      doc.setFont("helvetica", "bold");
      doc.text("Certificate of Completion", pageWidth / 2, 40, { align: "center" });

      // Course Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "normal");
      doc.text(`Course: ${courseData.title}`, pageWidth / 2, 70, { align: "center" });

      // Issued To
      doc.setFontSize(16);
      doc.text(
        `Issued to: ${courseData.instructor.username}`,
        pageWidth / 2,
        90,
        { align: "center" }
      );

      // Description
      doc.setFontSize(12);
      const descriptionLines = doc.splitTextToSize(
        "This certificate is awarded for successfully completing the course, demonstrating proficiency in the subject matter.",
        pageWidth - 40
      );
      doc.text(descriptionLines, pageWidth / 2, 110, { align: "center" });

      // Additional Details
      doc.setFontSize(14);
      doc.text(`Level: ${courseData.level}`, 20, 150);
      doc.text(`Category: ${courseData.category.name}`, 20, 165);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 180);

      // Instructor
      doc.text(
        `Instructor: ${courseData.instructor.username}`,
        pageWidth - 20,
        150,
        { align: "right" }
      );

      // Signature Line
      doc.setLineWidth(0.5);
      doc.line(pageWidth - 100, 165, pageWidth - 20, 165); // Signature line
      doc.text("(Signature)", pageWidth - 60, 170, { align: "center" });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Generated by Academix",
        pageWidth / 2,
        pageHeight - 15,
        { align: "center" }
      );

      // Save the PDF
      doc.save(`${courseData.title}_Certificate.pdf`);
      toast.success("Certificate generated and downloaded!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to generate certificate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant={isCompleted ? "outline" : "success"}
        className="w-full md:w-auto"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isCompleted ? "Not Completed" : "Mark as complete"}
        <Icon className="w-4 h-4 ml-2" />
      </Button>
      {!isCompleted && !nextTopicId && (
        <Button
          type="button"
          variant="destructive"
          className="w-full md:w-auto"
          onClick={handleGenerateCertificate}
          disabled={isLoading}
        >
          Generate Certificate
          <ShieldCheck className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default CourseProgressButton;