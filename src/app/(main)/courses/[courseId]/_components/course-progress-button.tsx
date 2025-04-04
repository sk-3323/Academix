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
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { jsPDF } from "jspdf"; // Import jsPDF
import { APIClient } from "@/helpers/apiHelper";
import { useSession } from "next-auth/react";

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
  const { singleData: courseData } = useSelector(
    (state: any) => state.CourseStore
  );

  const { data: userData } = useSession();
  const certificateSettings = {
    template: "standard",
    title: "Certificate of Completion",
    subtitle: "has successfully completed the course",
    signature: courseData?.instructor?.username || "Course Instructor",
    signaturePosition: "center",
    showLogo: true,
    showDate: true,
    showBorder: true,
    primaryColor: "#0ea5e9",
    secondaryColor: "#8b5cf6",
    fontFamily: "serif",
    fontSize: 24,
    borderWidth: 5,
    includeQR: false,
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const signatureRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const logo = new Image();
    logo.src = "/assets/logos/light-h-logo-with-name.svg"; // Adjust path
    logo.crossOrigin = "anonymous";
    logoRef.current = logo;

    const signature = new Image();
    signature.src = "/assets/logos/light-name.svg"; // Adjust path
    signature.crossOrigin = "anonymous";
    signatureRef.current = signature;
  }, []);
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
      setActions((current: any) => ({
        ...current,
        callbackFunction: handleSuccess,
      }));
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

  const renderCertificate = (canvas: HTMLCanvasElement) => {
    if (!canvas || !courseData) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(1, "#f8fafc");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    if (certificateSettings.showBorder) {
      ctx.strokeStyle = certificateSettings.primaryColor;
      ctx.lineWidth = certificateSettings.borderWidth;
      ctx.strokeRect(
        certificateSettings.borderWidth / 2,
        certificateSettings.borderWidth / 2,
        width - certificateSettings.borderWidth,
        height - certificateSettings.borderWidth
      );
    }

    // Logo
    if (certificateSettings.showLogo && logoRef.current) {
      ctx.drawImage(logoRef.current, width / 2 - 75, 50, 200, 150); // Proportional increase
    }

    // Title
    ctx.font = `bold ${certificateSettings.fontSize}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = certificateSettings.primaryColor;
    ctx.textAlign = "center";
    ctx.fillText(certificateSettings.title, width / 2, 200);

    // Subtitle
    ctx.font = `italic ${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.fillText("This is to certify that", width / 2, 250);

    // Student Name
    ctx.font = `bold ${certificateSettings.fontSize * 1.2}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = certificateSettings.secondaryColor;
    ctx.fillText(userData.user.username, width / 2, 300);

    // Course Completion Text
    ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#64748b";
    ctx.fillText(certificateSettings.subtitle, width / 2, 340);

    // Course Name
    ctx.font = `bold ${certificateSettings.fontSize * 0.8}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#0f172a";
    ctx.fillText(courseData.title, width / 2, 380);

    // Date
    if (certificateSettings.showDate) {
      const completionDate = new Date().toLocaleDateString(); // Use actual completion date if available
      ctx.font = `${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.fillText(`Issued on ${completionDate}`, width / 2, 430);
    }

    // Signature
    if (signatureRef.current) {
      const signatureX =
        certificateSettings.signaturePosition === "right"
          ? width * 0.7
          : certificateSettings.signaturePosition === "left"
            ? width * 0.3
            : width / 2;

      ctx.drawImage(signatureRef.current, signatureX - 75, 470, 150, 50);
      ctx.font = `bold ${certificateSettings.fontSize * 0.6}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#0f172a";
      ctx.fillText(certificateSettings.signature, signatureX, 540);
      ctx.font = `${certificateSettings.fontSize * 0.5}px ${certificateSettings.fontFamily}`;
      ctx.fillStyle = "#64748b";
      ctx.fillText("Instructor", signatureX, 560);
    }

    // Certificate ID
    ctx.font = `${certificateSettings.fontSize * 0.4}px ${certificateSettings.fontFamily}`;
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(
      `Certificate ID: CERT-${userData.user.id}-${Date.now().toString().slice(-6)}`,
      width / 2,
      height - 30
    );
  };

  const handleGenerateCertificate = async () => {
    const api = new APIClient();

    try {
      setIsLoading(true);

      if (!courseData) {
        toast.error("Course or user data not available");
        return;
      }

      // Render certificate to hidden canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = 900; // Match DynamicCertificateGenerator dimensions
      canvas.height = 500;
      renderCertificate(canvas);

      // Convert canvas to image
      const certificateImage = canvas.toDataURL("image/png");

      // Create PDF with jsPDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [800, 600], // Match canvas size
      });

      // Add certificate image
      doc.addImage(certificateImage, "PNG", 0, 0, 800, 600);

      // Add Watermark
      doc.setFontSize(50);
      doc.setTextColor(200, 200, 200); // Light gray

      // Save PDF
      doc.save(`${courseData.title}_Certificate_${userData.user.username}.pdf`);
      const res = await api.create("/certificate", {
        courseId: courseData.id,
        // certificateId = `CERT-${userData.id - Date.now().toString().slice(-6)}`,
      });
      console.log(res);
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
      {isCompleted && (
        <Button
          type="button"
          variant="destructive"
          className="w-full md:w-auto"
          onClick={handleGenerateCertificate}
          // disabled={isLoading}
        >
          Generate Certificate
          <ShieldCheck className="w-4 h-4 ml-2" />
        </Button>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CourseProgressButton;
