"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Clock, Award, BookOpen, Filter, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";

// Type definitions
interface Quiz {
  id: string;
  title: string;
  passingScore: number | null;
  timeLimit: number | null;
  order: number;
  status: string;
  chapterId: string;
  createdAt: string;
  updatedAt: string;
}

interface Chapter {
  id: string;
  title: string;
  courseId: string;
  quiz: Quiz[];
}

interface Course {
  id: string;
  title: string;
  chapters: Chapter[];
}

export default function QuizModule() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { data: courseData } = useSelector((state: any) => state.CourseStore);
  // Extract all quizzes from the course data
  const allQuizzes = courseData.flatMap((course: Course) =>
    course.chapters.flatMap((chapter: Chapter) =>
      chapter.quiz.map((quiz) => ({
        ...quiz,
        chapterTitle: chapter.title,
        courseTitle: course.title,
        courseId: course.id,
      }))
    )
  );

  // Filter quizzes based on search term and status filter
  const filteredQuizzes = allQuizzes.filter((quiz: any) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? quiz.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Format time limit to display in minutes and seconds
  const formatTimeLimit = (seconds: number | null) => {
    if (!seconds) return "No limit";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle row click to navigate to quiz detail
  const handleQuizClick = (quizId: string) => {
    router.push(`/teacher/quiz/${quizId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Module</CardTitle>
          <CardDescription>
            Manage and view all quizzes across your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  {statusFilter || "All Statuses"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PUBLISHED")}>
                  Published
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("DRAFT")}>
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableCaption>A list of all quizzes in your courses</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Passing Score
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Time Limit
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.length > 0 ? (
                  filteredQuizzes.map((quiz: any) => (
                    <TableRow
                      key={quiz.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleQuizClick(quiz.id)}
                    >
                      <TableCell className="font-medium">
                        {quiz.title}
                      </TableCell>
                      <TableCell
                        className="max-w-[150px] truncate"
                        title={quiz.courseTitle}
                      >
                        {quiz.courseTitle}
                      </TableCell>
                      <TableCell
                        className="max-w-[150px] truncate"
                        title={quiz.chapterTitle}
                      >
                        {quiz.chapterTitle}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          {quiz.passingScore ?? "Not set"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatTimeLimit(quiz.timeLimit)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(quiz.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            quiz.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {quiz.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuizClick(quiz.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No quizzes found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Showing {filteredQuizzes.length} of {allQuizzes.length} quizzes
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {allQuizzes.length} total quizzes
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{allQuizzes.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Across all courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Published Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {allQuizzes.filter((q: Quiz) => q.status === "PUBLISHED").length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Ready for students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Draft Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {allQuizzes.filter((q: Quiz) => q.status === "DRAFT").length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">In preparation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
