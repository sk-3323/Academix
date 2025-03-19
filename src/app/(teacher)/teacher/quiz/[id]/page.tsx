"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Award,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Calendar,
} from "lucide-react";
import { GetSingleQuizApi } from "@/store/quiz/slice";
import { AppDispatch } from "@/store/store";

// This is a placeholder for your actual Redux action
// Replace this with your actual import
// Replace with your actual AppDispatch type

export default function QuizDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: quizData } = useSelector(
    (state: any) => state["QuizStore"]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      dispatch(GetSingleQuizApi({ id: params.id }));
      setLoading(false);
    }
  }, [dispatch, params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeLimit = (seconds: number) => {
    if (!seconds) return "No time limit";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // If we're still loading or don't have quiz data yet, show a loading state
  if (loading || !quizData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-2xl">Loading Quiz...</CardTitle>
                <CardDescription>
                  Please wait while we fetch the quiz details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted animate-pulse rounded-md"></div>
              <div className="h-24 w-full bg-muted animate-pulse rounded-md"></div>
              <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{quizData.title}</CardTitle>
                <Badge
                  variant={
                    quizData.status === "PUBLISHED" ? "default" : "secondary"
                  }
                >
                  {quizData.status}
                </Badge>
              </div>
              <CardDescription>
                From chapter: {quizData.chapter?.title}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Passing Score</p>
                <p className="font-medium">{quizData.passingScore} points</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time Limit</p>
                <p className="font-medium">
                  {formatTimeLimit(quizData.timeLimit)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(quizData.createdAt)}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="questions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">
                Questions ({quizData.questions?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>
            <TabsContent value="questions" className="mt-4">
              <div className="space-y-6">
                {quizData.questions?.map((question: any, index: number) => (
                  <Card key={question.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 py-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="h-6 w-6 rounded-full p-0 flex items-center justify-center"
                          >
                            {index + 1}
                          </Badge>
                          <CardTitle className="text-base">
                            {question.title}
                          </CardTitle>
                        </div>
                        <Badge>{question.points} points</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {question.options?.map((option: any) => {
                          const isCorrectAnswer =
                            option.id === question.answerId;
                          return (
                            <div
                              key={option.id}
                              className={`p-3 rounded-md flex items-start gap-2 ${
                                isCorrectAnswer
                                  ? "bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900"
                                  : "bg-muted/30 border border-muted"
                              }`}
                            >
                              {isCorrectAnswer ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              ) : (
                                <HelpCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p
                                  className={
                                    isCorrectAnswer ? "font-medium" : ""
                                  }
                                >
                                  {option.title}
                                </p>
                                {isCorrectAnswer && (
                                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    Correct answer
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quiz Statistics</CardTitle>
                  <CardDescription>
                    Overview of quiz performance and completion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-sm font-medium">Completion Rate</p>
                        <p className="text-sm text-muted-foreground">
                          {quizData.completedBy?.length || 0} students
                        </p>
                      </div>
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        No students have completed this quiz yet
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3">
                        Question Breakdown
                      </h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                            <TableHead className="text-right">
                              Options
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quizData.questions?.map(
                            (question: any, index: number) => (
                              <TableRow key={question.id}>
                                <TableCell className="font-medium">
                                  Q{index + 1}:{" "}
                                  {question.title.length > 30
                                    ? `${question.title.substring(0, 30)}...`
                                    : question.title}
                                </TableCell>
                                <TableCell className="text-right">
                                  {question.points}
                                </TableCell>
                                <TableCell className="text-right">
                                  {question.options?.length || 0}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Total questions: {quizData.questions?.length || 0}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back to Quizzes
            </Button>
            <Button>Preview Quiz</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
