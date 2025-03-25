"use client";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect, usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Award,
  User,
  Book,
  FileText,
  HelpCircle,
  Folder,
  Lock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { GetSingleCourseApi } from "@/store/course/slice";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Course, Quiz, Resource, Topic } from "../../../../../types/allType";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { clearEnrollmentState } from "@/store/enrollment/slice";
import Script from "next/script";
import { EnrollmentModal } from "./_components/enrollment-modal";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sidebar Accordion Component
const CourseSidebar = ({
  course,
  isLoggedIn,
  onResourceClick,
}: {
  course: Course;
  isLoggedIn: boolean;
  onResourceClick: () => void;
}) => {
  const publishedChapters =
    course.chapters?.filter((ch) => ch.status === "PUBLISHED") || [];

  return (
    <div className="border rounded-lg p-6 sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Course Content</h2>

      {publishedChapters.length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {publishedChapters.map((chapter: any, index: any) => (
            <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {index + 1}. {chapter.title}
                  </span>
                  {chapter.status === "DRAFT" && (
                    <Badge variant="outline" className="text-xs">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-2">
                  {/* Topics */}
                  {chapter.topics?.length > 0 && (
                    <div className="border-l-2 border-muted pl-4 py-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <Book className="h-4 w-4 text-primary" /> Topics
                      </h4>
                      <Accordion type="single" collapsible className="w-full">
                        {chapter.topics.map((topic: Topic) => (
                          <AccordionItem
                            key={topic.id}
                            value={`topic-${topic.id}`}
                          >
                            <AccordionTrigger className="text-sm py-2 hover:no-underline">
                              <div className="flex items-center gap-2">
                                {topic.order}. {topic.title}
                                {!isLoggedIn && topic.video && (
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="text-xs text-muted-foreground pl-4">
                              {topic.description ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: topic.description,
                                  }}
                                />
                              ) : (
                                <p>No description available</p>
                              )}
                              {topic.video && (
                                <div className="mt-2">
                                  {isLoggedIn ? (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Video Available
                                    </Badge>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs mt-2 flex items-center gap-1"
                                      onClick={onResourceClick}
                                    >
                                      <Lock className="h-3 w-3" /> Watch Video
                                    </Button>
                                  )}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}

                  {/* Quizzes */}
                  {chapter.quizzes?.length > 0 && (
                    <div className="border-l-2 border-muted pl-4 py-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <HelpCircle className="h-4 w-4 text-primary" /> Quizzes
                      </h4>
                      <ul className="space-y-3">
                        {chapter.quizzes.map((quiz: Quiz) => (
                          <li
                            key={quiz.id}
                            className="text-sm bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors relative"
                          >
                            <div className="font-medium">{quiz.title}</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                              <span>
                                {quiz.questions?.length || 0} questions
                              </span>
                              <span>•</span>
                              <span>{quiz.timeLimit || "No"} time limit</span>
                            </div>
                            {!isLoggedIn && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs mt-2 flex items-center gap-1"
                                onClick={onResourceClick}
                              >
                                <Lock className="h-3 w-3" /> Take Quiz
                              </Button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resources */}
                  {chapter.resources?.length > 0 && (
                    <div className="border-l-2 border-muted pl-4 py-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-primary" /> Resources
                      </h4>
                      <ul className="space-y-2">
                        {chapter.resources.map((resource: Resource) => (
                          <li
                            key={resource.id}
                            className="text-sm flex items-center gap-2 group"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                            {isLoggedIn ? (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors group-hover:underline"
                              >
                                {resource.title}
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({resource.type})
                                </span>
                              </a>
                            ) : (
                              <button
                                onClick={onResourceClick}
                                className="hover:text-primary transition-colors group-hover:underline flex items-center gap-1"
                              >
                                {resource.title}
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({resource.type})
                                </span>
                                <Lock className="h-3 w-3 text-muted-foreground ml-1" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!chapter.topics?.length &&
                    !chapter.quizzes?.length &&
                    !chapter.resources?.length && (
                      <p className="text-xs text-muted-foreground italic">
                        No additional content available for this chapter
                      </p>
                    )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No published content available
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Check back soon for updates
          </p>
        </div>
      )}
    </div>
  );
};

export default function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const [enrollmentActions, setEnrollmentActions] = useState({
    clearState: clearEnrollmentState,
    callbackFunction: () => {},
  });

  useDynamicToast("EnrollmentStore", enrollmentActions, pathname);
  const dispatch = useDispatch<AppDispatch>();
  const {
    singleData: course,
    loading,
    error,
  } = useSelector((state: any) => state.CourseStore);
  const { singleData: user } = useSelector((state: any) => state.UserStore);

  const isLoggedIn = !!user?.id;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (user) {
      const enrolledCourse = user?.enrollments?.map(
        (enroll: any) => enroll?.course?.id === params?.courseId
      );

      if (enrolledCourse && enrolledCourse[0] === true) {
        return redirect(
          `/courses/${params?.courseId}/topics/${course?.chapters?.[0]?.topics?.[0]?.id}`
        );
      }
    }
  }, [user]);

  useEffect(() => {
    if (params?.courseId) {
      const resp = dispatch(GetSingleCourseApi({ id: params.courseId }));
    }
  }, [dispatch, params?.courseId]);

  const handleResourceClick = () => {
    setIsModalOpen(true);
  };

  if (!isMounted || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <div className="flex flex-wrap gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Course
          </h2>
          <p className="text-muted-foreground">
            {error.message || "Something went wrong"}
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Return to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  const publishedChapters =
    course.chapters?.filter((ch: any) => ch.status === "PUBLISHED") || [];
  const totalChapters = course.chapters?.length || 0;
  const publishedChaptersCount = publishedChapters.length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <Link
          href="/"
          className="flex items-center text-sm mb-6 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title || "Course thumbnail"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <h1 className="text-3xl font-bold mb-4">
                {course.title || "Untitled Course"}
              </h1>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {course.level || "N/A"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {course.createdAt
                    ? new Date(course.createdAt).toLocaleDateString()
                    : "N/A"}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {publishedChaptersCount} chapters
                </Badge>
                <Badge variant="secondary">
                  {course.category?.name || "Uncategorized"}
                </Badge>
              </div>

              <Tabs defaultValue="overview" className="mb-8">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{
                      __html:
                        course.description || "<p>No description available</p>",
                    }}
                  />
                </TabsContent>

                <TabsContent value="curriculum" className="mt-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Course Content</h3>
                      <div className="text-sm text-muted-foreground">
                        {publishedChaptersCount} / {totalChapters} chapters
                        available
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {course.chapters?.map((chapter: any, index: any) => (
                        <AccordionItem
                          key={chapter.id}
                          value={`tab-chapter-${chapter.id}`}
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex flex-col items-start text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  Chapter {index + 1}: {chapter.title}
                                </span>
                                {chapter.status === "DRAFT" && (
                                  <Badge variant="outline" className="text-xs">
                                    Coming Soon
                                  </Badge>
                                )}
                              </div>
                              {chapter.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {chapter.description
                                    .replace(/<[^>]*>/g, "")
                                    .substring(0, 100)}
                                  {chapter.description.length > 100
                                    ? "..."
                                    : ""}
                                </p>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pl-4">
                              {/* Topics List */}
                              {chapter.topics?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Book className="h-4 w-4" /> Topics (
                                    {chapter.topics.length})
                                  </h4>
                                  <ul className="space-y-3">
                                    {chapter.topics.map((topic: Topic) => (
                                      <li
                                        key={topic.id}
                                        className="border-l-2 border-muted pl-3 py-1"
                                      >
                                        <div className="font-medium text-sm flex items-center gap-2">
                                          {topic.order}. {topic.title}
                                          {!isLoggedIn && topic.video && (
                                            <Lock className="h-3 w-3 text-muted-foreground" />
                                          )}
                                        </div>
                                        {topic.description && (
                                          <div className="text-xs text-muted-foreground mt-1">
                                            {topic.description
                                              .replace(/<[^>]*>/g, "")
                                              .substring(0, 80)}
                                            {topic.description.length > 80
                                              ? "..."
                                              : ""}
                                          </div>
                                        )}
                                        {!isLoggedIn && topic.video && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs mt-2 flex items-center gap-1"
                                            onClick={handleResourceClick}
                                          >
                                            <Lock className="h-3 w-3" /> Watch
                                            Video
                                          </Button>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Quizzes List */}
                              {chapter.quizzes?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4" />{" "}
                                    Assessments ({chapter.quizzes.length})
                                  </h4>
                                  <ul className="space-y-2">
                                    {chapter.quizzes.map((quiz: any) => (
                                      <li
                                        key={quiz.id}
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        <span>{quiz.title}</span>
                                        <span className="text-xs text-muted-foreground">
                                          ({quiz.questions} questions)
                                        </span>
                                        {!isLoggedIn && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs ml-2 flex items-center gap-1"
                                            onClick={handleResourceClick}
                                          >
                                            <Lock className="h-3 w-3" /> Take
                                            Quiz
                                          </Button>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Resources List */}
                              {chapter.resources?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Resources (
                                    {chapter.resources.length})
                                  </h4>
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {chapter.resources.map(
                                      (resource: Resource) => (
                                        <li
                                          key={resource.id}
                                          className="text-sm"
                                        >
                                          {isLoggedIn ? (
                                            <a
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                                            >
                                              <Folder className="h-4 w-4 text-primary" />
                                              <div>
                                                <div className="font-medium">
                                                  {resource.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {resource.type}
                                                </div>
                                              </div>
                                            </a>
                                          ) : (
                                            <button
                                              onClick={handleResourceClick}
                                              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors w-full text-left"
                                            >
                                              <Folder className="h-4 w-4 text-primary" />
                                              <div className="flex-1">
                                                <div className="font-medium">
                                                  {resource.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {resource.type}
                                                </div>
                                              </div>
                                              <Lock className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                          )}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="instructor" className="mt-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={course.instructor?.avatar}
                          alt={course.instructor?.username || "Instructor"}
                        />
                        <AvatarFallback>
                          {getInitials(
                            course.instructor?.username || "Instructor"
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {course.instructor?.username || "Unknown Instructor"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor?.role || "N/A"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">
                    {course.instructor?.bio ||
                      `Experienced instructor with expertise in ${course.category?.name || "various fields"}.`}
                  </p>
                </TabsContent>
              </Tabs>

              {/* Purchase/Enroll Section */}
              <div className="border rounded-lg p-6 mb-8">
                <div className="mb-6">
                  {course.isFree ? (
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      Free
                    </div>
                  ) : (
                    <div className="text-2xl font-bold mb-1">
                      ₹{course.price || "N/A"}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <CourseEnrollButton
                    courseId={course.id}
                    isFree={course.isFree}
                    price={course.price}
                    setActions={setEnrollmentActions}
                  />
                  <div className="text-sm text-muted-foreground">
                    <p>This course includes:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {publishedChaptersCount} chapters
                      </li>
                      <li className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {course.enrollments?.length || 0} students enrolled
                      </li>
                      <li className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Certificate of completion
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar with Course Content */}
          <div className="lg:col-span-1">
            <CourseSidebar
              course={course}
              isLoggedIn={isLoggedIn}
              onResourceClick={handleResourceClick}
            />
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        course={course}
        courseId={params.courseId}
        setActions={setEnrollmentActions}
      />

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}
