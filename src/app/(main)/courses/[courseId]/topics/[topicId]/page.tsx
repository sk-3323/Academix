// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   BookOpen,
//   CheckCircle,
//   ChevronDown,
//   Clock,
//   File,
//   FileText,
//   Lock,
//   Play,
//   PlayCircle,
//   Star,
// } from "lucide-react";
// import { Banner } from "@/components/banner";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Card, CardContent } from "@/components/ui/card";
// import Preview from "@/components/preview";
// import { IconBadge } from "@/components/icon-badge";
// import VideoPlayer from "../../_components/video-player";
// import { CourseEnrollButton } from "../../_components/course-enroll-button";
// import { ResourceBar } from "../../_components/resource-bar";
// import CourseProgressButton from "../../_components/course-progress-button";
// import { useConfetti } from "@/hooks/use-confetti";
// import { useDynamicToast } from "@/hooks/DynamicToastHook";
// import { clearEnrollmentState } from "@/store/enrollment/slice";
// import { clearUserProgressState } from "@/store/user-progress/slice";

// const TopicIdPage = ({
//   params,
// }: {
//   params: { courseId: string; topicId: string };
// }) => {
//   const { startConfetti, ConfettiComponent } = useConfetti();
//   const pathname = usePathname();

//   // Mock data - in real implementation, this would come from your API
//   const course = {
//     id: "67cad724b9c1cb55b541a809",
//     title: "Machine Learning",
//     description:
//       "<p>Machine Learning is a branch of artificial intelligence that focuses on the development of algorithms and statistical models that enable computers to perform tasks without explicit instructions. It involves training models on large datasets to identify patterns and make predictions or decisions. Applications range from image and speech recognition to recommendation systems and autonomous vehicles, making it a key technology in various industries. Machine Learning techniques include supervised learning, unsupervised learning, and reinforcement learning, each suited to different types of problems.</p>",
//     thumbnail:
//       "https://utfs.io/f/7bc2e451-ca4f-45a7-a17d-0b8e64b98b42-3sigft.jpg",
//     price: 120,
//     isFree: false,
//     level: "BEGINNER",
//     category: { name: "Engineering" },
//     instructor: {
//       username: "Rishi Gaiwala",
//       avatar:
//         "https://utfs.io/f/22bbbde7-7ff7-4c0d-ba6e-d07ff73f3b08-3sigft.jpg",
//     },
//     chapters: [
//       {
//         id: "67cad8d6b9c1cb55b541a80a",
//         title: "Introduction to Machine Learning",
//         description:
//           "<p>Machine learning models fall into three primary categories: supervised learning, unsupervised learning, and reinforcement learning</p>",
//         order: 1,
//         topics: [
//           {
//             id: "67cadd16b9c1cb55b541a82a",
//             title: "What is Machine Learning?",
//             description:
//               "<p>Machine learning (ML) is a branch of artificial intelligence (AI) that focuses on enabling computers and machines to learn from data and algorithms</p>",
//             order: 1,
//             isFree: false,
//             muxData: {
//               playbackId: "fGZjd3KfIgfuH5bRdeeQsos2B5DlUffQUeOpiTyGP54",
//             },
//             userProgress: [],
//           },
//           {
//             id: "67cadd1eb9c1cb55b541a82b",
//             title:
//               "Types of Machine Learning: Supervised, Unsupervised, Reinforcement",
//             description:
//               "<p>Machine learning encompasses three primary types: supervised, unsupervised, and reinforcement learning.</p>",
//             order: 2,
//             isFree: false,
//             muxData: {
//               playbackId: "Mw00vG1rrWDmaB2R64qYP4zblzDOLXdvhR01NP7PzFUhQ",
//             },
//             userProgress: [],
//           },
//         ],
//         resources: [
//           {
//             id: "67cadcfcb9c1cb55b541a829",
//             title: "Machine Learning",
//             url: "https://utfs.io/f/c0067152-2c34-4dff-9c58-29a406e9c45d-cx8frq.pdf",
//           },
//         ],
//         quiz: [
//           {
//             id: "67cad998b9c1cb55b541a80f",
//             title: "Introduction to ML",
//             passingScore: 3,
//             timeLimit: 300,
//             order: 1,
//             questions: [
//               {
//                 id: "67cad9f2b9c1cb55b541a810",
//                 title:
//                   "Which of the following is a type of supervised learning?",
//                 options: [
//                   { title: "A. Clustering" },
//                   { title: "B. Classification" },
//                   { title: "C. Dimensionality Reduction" },
//                 ],
//                 answer: { title: "B. Classification" },
//               },
//               // More questions would be here
//             ],
//           },
//         ],
//       },
//       {
//         id: "67cad8eeb9c1cb55b541a80b",
//         title: "Data Preprocessing and Exploration",
//         description:
//           "<p>Data preprocessing is a crucial step in the machine learning pipeline</p>",
//         order: 2,
//         topics: [
//           {
//             id: "67cc0f3d04592fe5d573d1c8",
//             title: "Topic 1",
//             description: "<p>Data preprocessing techniques</p>",
//             order: 1,
//             isFree: true,
//             muxData: {
//               playbackId: "6JCzaynCfRaOyga7tcCLsMJKYvVSUJ01IgbIlDxEViMg",
//             },
//             userProgress: [],
//           },
//         ],
//         resources: [
//           {
//             id: "67cc117304592fe5d573d1ca",
//             title: "Introduction",
//             url: "https://utfs.io/f/f2d6a7d0-b212-4d79-a7f8-1852492a4684-t1vb8q.pdf",
//           },
//         ],
//         quiz: [],
//       },
//     ],
//     enrollments: [],
//     progressCount: 0,
//   };

//   // Find the current topic
//   const currentChapter = course.chapters.find((chapter) =>
//     chapter.topics.some((topic) => topic.id === params.topicId)
//   );

//   const topic = currentChapter?.topics.find(
//     (topic) => topic.id === params.topicId
//   );

//   // Find next topic
//   const getNextTopic = () => {
//     const currentTopicIndex =
//       currentChapter?.topics.findIndex((t) => t.id === params.topicId) || 0;
//     const nextTopicInChapter = currentChapter?.topics[currentTopicIndex + 1];

//     if (nextTopicInChapter) {
//       return {
//         id: nextTopicInChapter.id,
//         nextType: "topic",
//       };
//     }

//     const currentChapterIndex = course.chapters.findIndex(
//       (ch) => ch.id === currentChapter?.id
//     );
//     const nextChapter = course.chapters[currentChapterIndex + 1];

//     if (nextChapter && nextChapter.topics.length > 0) {
//       return {
//         id: nextChapter.topics[0].id,
//         nextType: "topic",
//       };
//     }

//     return null;
//   };

//   const nextTopic = getNextTopic();

//   const [isLocked, setIsLocked] = useState(
//     !topic?.isFree && course.enrollments.length === 0
//   );

//   const [isCompleteOnEnd, setIsCompleteOnEnd] = useState(
//     course.enrollments.length !== 0 && topic?.userProgress.length === 0
//   );

//   const [activeTab, setActiveTab] = useState("content");

//   const [enrollmentActions, setEnrollmentActions] = useState({
//     clearState: clearEnrollmentState,
//     callbackFunction: () => {},
//   });

//   const [userProgressActions, setUserProgressActions] = useState({
//     clearState: clearUserProgressState,
//     callbackFunction: () => {},
//   });

//   useDynamicToast("EnrollmentStore", enrollmentActions, pathname);
//   useDynamicToast("UserProgressStore", userProgressActions);

//   // Calculate course progress
//   const totalTopics = course.chapters.reduce(
//     (acc, chapter) => acc + chapter.topics.length,
//     0
//   );
//   const completedTopics = course.progressCount || 0;
//   const progressPercentage =
//     totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

//   return (
//     <div className=" min-h-screen">
//       <ConfettiComponent />

//       {/* Course Header */}
//       <div className=" border-b">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row gap-8 mb-3">
//             <div className="w-full md:w-2/3">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
//                 <Link href="/courses" className="hover:text-primary">
//                   Courses
//                 </Link>
//                 <ChevronDown className="h-4 w-4" />
//                 <Link
//                   href={`/courses/${course.category.name.toLowerCase()}`}
//                   className="hover:text-primary"
//                 >
//                   {course.category.name}
//                 </Link>
//               </div>

//               <h1 className="text-3xl md:text-4xl font-bold mb-4">
//                 {course.title}
//               </h1>

//               <div className="flex items-center gap-4 mb-4">
//                 <Badge variant="outline" className="bg-primary/10 text-primary">
//                   {course.level}
//                 </Badge>
//                 <div className="flex items-center">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 text-muted-foreground" />
//                   <span className="ml-2 text-sm text-muted-foreground">
//                     (4.0)
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3 mb-6">
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src={course.instructor.avatar || "/placeholder.svg"}
//                     alt={course.instructor.username}
//                     width={32}
//                     height={32}
//                     className="rounded-full"
//                   />
//                   <span className="text-sm font-medium">
//                     {course.instructor.username}
//                   </span>
//                 </div>
//                 {/* <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                   <Clock className="h-4 w-4" />
//                   <span>8 hours</span>
//                 </div> */}
//                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                   <BookOpen className="h-4 w-4" />
//                   <span>{totalTopics} lessons</span>
//                 </div>
//               </div>

//               {course.enrollments.length > 0 && (
//                 <div className="mb-4">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span>Your progress</span>
//                     <span>
//                       {completedTopics}/{totalTopics} completed
//                     </span>
//                   </div>
//                   <Progress value={progressPercentage} className="h-2" />
//                 </div>
//               )}
//             </div>

//             <div className="w-full md:w-1/3 flex flex-col gap-4">
//               <div className="relative aspect-video rounded-lg overflow-hidden border shadow-sm">
//                 <Image
//                   src={course.thumbnail || "/placeholder.svg"}
//                   alt={course.title}
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/30">
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     className="rounded-full bg-white text-primary hover:bg-white/90 hover:text-primary/90"
//                   >
//                     <Play className="h-8 w-8 fill-current" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-2xl font-bold">
//                     {course.isFree ? "Free" : `₹${course.price}`}
//                   </span>
//                 </div>

//                 {course.enrollments.length === 0 ? (
//                   <CourseEnrollButton
//                     courseId={params.courseId}
//                     isFree={course.isFree}
//                     price={course.price}
//                     setActions={setEnrollmentActions}
//                   />
//                 ) : (
//                   <Button className="w-full" size="lg">
//                     Continue Learning
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//           {/* Notification Banners */}
//           {topic?.userProgress?.[0]?.isCompleted && (
//             <Banner
//               variant="success"
//               label="You already completed this topic"
//             />
//           )}
//           {isLocked && (
//             <Banner
//               variant="warning"
//               label="You need to purchase this course to watch this topic"
//             />
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Sidebar - Course Content */}
//           <div className="order-2 lg:order-1 lg:col-span-1">
//             <div className="sticky top-20">
//               <div className="bg-card rounded-lg border shadow-sm">
//                 <div className="p-4 border-b">
//                   <h2 className="text-xl font-semibold">Course Content</h2>
//                 </div>

//                 <Accordion
//                   type="multiple"
//                   defaultValue={[currentChapter?.id || ""]}
//                   className="w-full"
//                 >
//                   {course.chapters.map((chapter) => (
//                     <AccordionItem key={chapter.id} value={chapter.id}>
//                       <AccordionTrigger className="px-4 py-3 hover:no-underline">
//                         <div className="flex items-start gap-3 text-left">
//                           <div className="mt-0.5">
//                             <BookOpen className="h-5 w-5 text-muted-foreground" />
//                           </div>
//                           <div>
//                             <div className="font-medium">{chapter.title}</div>
//                             <div className="text-xs text-muted-foreground mt-1">
//                               {chapter.topics.length} lessons
//                               {chapter.quiz.length > 0 &&
//                                 ` • ${chapter.quiz.length} quiz`}
//                             </div>
//                           </div>
//                         </div>
//                       </AccordionTrigger>
//                       <AccordionContent className="px-0">
//                         <div className="flex flex-col">
//                           {chapter.topics.map((chapterTopic) => (
//                             <Link
//                               key={chapterTopic.id}
//                               href={`/courses/${params.courseId}/topics/${chapterTopic.id}`}
//                               className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${
//                                 chapterTopic.id === params.topicId
//                                   ? "bg-muted"
//                                   : ""
//                               }`}
//                             >
//                               <div className="flex-shrink-0">
//                                 {chapterTopic.userProgress?.length > 0 ? (
//                                   <CheckCircle className="h-5 w-5 text-primary" />
//                                 ) : chapterTopic.isFree ||
//                                   course.enrollments.length > 0 ? (
//                                   <PlayCircle className="h-5 w-5 text-muted-foreground" />
//                                 ) : (
//                                   <Lock className="h-5 w-5 text-muted-foreground" />
//                                 )}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="text-sm font-medium truncate">
//                                   {chapterTopic.title}
//                                 </div>
//                                 <div className="text-xs text-muted-foreground mt-0.5">
//                                   10:30
//                                 </div>
//                               </div>
//                             </Link>
//                           ))}

//                           {chapter.quiz.map((quiz) => (
//                             <Link
//                               key={quiz.id}
//                               href={`/courses/${params.courseId}/chapters/${chapter.id}/quiz/${quiz.id}`}
//                               className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
//                             >
//                               <div className="flex-shrink-0">
//                                 {quiz.completedBy?.some(
//                                   (c) => c.userId === "current-user-id"
//                                 ) ? (
//                                   <CheckCircle className="h-5 w-5 text-primary" />
//                                 ) : course.enrollments.length > 0 ? (
//                                   <FileText className="h-5 w-5 text-muted-foreground" />
//                                 ) : (
//                                   <Lock className="h-5 w-5 text-muted-foreground" />
//                                 )}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <div className="text-sm font-medium truncate">
//                                   {quiz.title}
//                                 </div>
//                                 <div className="text-xs text-muted-foreground mt-0.5">
//                                   {quiz.questions.length} questions •{" "}
//                                   {Math.floor(quiz.timeLimit / 60)} min
//                                 </div>
//                               </div>
//                             </Link>
//                           ))}

//                           {chapter.resources.length > 0 && (
//                             <div className="px-4 py-3 border-t">
//                               <div className="text-sm font-medium mb-2">
//                                 Resources
//                               </div>
//                               {chapter.resources.map((resource) => (
//                                 <a
//                                   key={resource.id}
//                                   href={resource.url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1"
//                                 >
//                                   <File className="h-4 w-4" />
//                                   <span className="truncate">
//                                     {resource.title}
//                                   </span>
//                                 </a>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </AccordionContent>
//                     </AccordionItem>
//                   ))}
//                 </Accordion>
//               </div>
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className="order-1 lg:order-2 lg:col-span-2">
//             {/* Video Player */}
//             <div className="mb-6">
//               <div className="rounded-lg overflow-hidden border shadow-sm">
//                 {topic && (
//                   <VideoPlayer
//                     topicId={params.topicId}
//                     nextTopicId={nextTopic?.id}
//                     nextType={nextTopic?.nextType}
//                     playbackId={topic.muxData?.playbackId!}
//                     isLocked={isLocked}
//                     isCompleteOnEnd={isCompleteOnEnd}
//                     courseId={params.courseId}
//                     title={topic.title}
//                     setActions={setUserProgressActions}
//                     startConfetti={startConfetti}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Topic Title and Progress Button */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//               <h2 className="text-2xl font-semibold">{topic?.title}</h2>

//               {course.enrollments.length !== 0 ? (
//                 <CourseProgressButton
//                   nextType={nextTopic?.nextType}
//                   topicId={params.topicId}
//                   courseId={params.courseId}
//                   nextTopicId={nextTopic?.id}
//                   isCompleted={!!topic?.userProgress?.[0]?.isCompleted}
//                   setActions={setUserProgressActions}
//                   startConfetti={startConfetti}
//                 />
//               ) : (
//                 <CourseEnrollButton
//                   courseId={params.courseId}
//                   isFree={course.isFree}
//                   price={course.price}
//                   setActions={setEnrollmentActions}
//                 />
//               )}
//             </div>

//             <Separator className="mb-6" />

//             {/* Tabs for Content, Resources, etc. */}
//             <Tabs
//               value={activeTab}
//               onValueChange={setActiveTab}
//               className="mb-8"
//             >
//               <TabsList className="mb-6">
//                 <TabsTrigger value="content">Content</TabsTrigger>
//                 {currentChapter?.resources.length ? (
//                   <TabsTrigger value="resources">Resources</TabsTrigger>
//                 ) : null}
//                 <TabsTrigger value="discussion">Discussion</TabsTrigger>
//               </TabsList>

//               <TabsContent value="content" className="mt-0">
//                 <Card>
//                   <CardContent className="p-6">
//                     <Preview value={topic?.description!} />
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="resources" className="mt-0">
//                 <Card>
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-x-2 mb-4">
//                       <IconBadge icon={File} />
//                       <h2 className="text-xl font-semibold">
//                         Resources & Attachments
//                       </h2>
//                     </div>
//                     <Separator className="mb-4" />
//                     <ResourceBar
//                       resources={currentChapter?.resources || []}
//                       isLocked={isLocked}
//                     />
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="discussion" className="mt-0">
//                 <Card>
//                   <CardContent className="p-6">
//                     <div className="flex flex-col items-center justify-center py-12 text-center">
//                       <div className="rounded-full bg-primary/10 p-3 mb-4">
//                         <MessageCircle className="h-6 w-6 text-primary" />
//                       </div>
//                       <h3 className="text-lg font-medium mb-2">
//                         Join the discussion
//                       </h3>
//                       <p className="text-muted-foreground mb-4 max-w-md">
//                         Ask questions, share insights, and connect with fellow
//                         learners in the discussion area.
//                       </p>
//                       <Button disabled={isLocked}>Start a conversation</Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopicIdPage;

// // This component is just a placeholder since it's not defined in the imports
// const MessageCircle = ({ className }: { className?: string }) => {
//   return <div className={className}></div>;
// };
"use client";

import { Button } from "@/components/ui/button";
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { GetPublishedTopicWithProgressApi } from "@/store/topic/slice";
import { AddUserProgressApi } from "@/store/user-progress/slice";
import { CheckCircle, ShieldCheck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { APIClient } from "@/helpers/apiHelper";

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
  const { singleData: userData } = useSelector((state: any) => state.UserStore); // Assuming user data is available

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const signatureRef = useRef<HTMLImageElement | null>(null);

  // Certificate settings (customizable as needed)
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

  // Load logo and signature images
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
    } finally {
      setIsLoading(false);
    }
  };

  const renderCertificate = (canvas: HTMLCanvasElement) => {
    if (!canvas || !courseData || !userData) return;

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
    ctx.fillText(userData.username, width / 2, 300);

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
      `Certificate ID: CERT-${userData.id}-${Date.now().toString().slice(-6)}`,
      width / 2,
      height - 30
    );
  };

  const handleGenerateCertificate = async () => {
    const api = new APIClient();

    try {
      setIsLoading(true);

      if (!courseData || !userData) {
        toast.error("Course or user data not available");
        return;
      }

      // Render certificate to hidden canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = 800; // Match DynamicCertificateGenerator dimensions
      canvas.height = 600;
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
      doc.save(`${courseData.title}_Certificate_${userData.username}.pdf`);
      await api.create("/certificate", {
        userId: userData.id,
        courseId: courseData.id,
        certificateId = `CERT-${userData.id - Date.now().toString().slice(-6)}`,
      });
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
      {/* Hidden canvas for rendering certificate */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CourseProgressButton;
