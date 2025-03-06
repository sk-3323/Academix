"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { toast } from "sonner";
import {
  clearQuizProgressState,
  CompleteQuizProgressApi,
  ResetQuizProgressApi,
} from "@/store/quiz-progress/slice";

interface EndPageProps {
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  passingScore: number;
  loading: boolean;
  quizProgressId: string;
  isCompleted: boolean;
  handleSuccess: any;
  setQuizProgressActions: any;
  nextTopicId: string;
  nextType: string;
  courseId: string;
}

const EndPage = ({
  correctAnswers,
  incorrectAnswers,
  totalQuestions,
  passingScore,
  loading,
  quizProgressId,
  isCompleted,
  handleSuccess,
  setQuizProgressActions,
  nextTopicId,
  nextType,
  courseId,
}: EndPageProps) => {
  const chartData = [
    {
      name: "Answers",
      Correct: correctAnswers,
      Incorrect: incorrectAnswers,
    },
  ];

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleNextSuccess = () => {
    if (nextTopicId && nextType === "TOPIC") {
      router.push(`/courses/${courseId}/topics/${nextTopicId}`);
    } else if (nextType === "QUIZ") {
      router.push(`/courses/${courseId}/quiz/${nextTopicId}`);
    }
  };

  const handleTryAgain = async () => {
    try {
      setQuizProgressActions({
        clearState: clearQuizProgressState,
        callbackFunction: handleSuccess,
      });

      await dispatch(
        ResetQuizProgressApi({
          id: quizProgressId,
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    }
  };

  const handleNextAction = async () => {
    try {
      if (!isCompleted) {
        setQuizProgressActions({
          clearState: clearQuizProgressState,
          callbackFunction: handleNextSuccess,
        });
        await dispatch(
          CompleteQuizProgressApi({
            id: quizProgressId,
            values: {
              correct: correctAnswers,
              wrong: incorrectAnswers,
              isCompleted: true,
            },
            requiredFields: ["correct", "wrong", "isCompleted"],
          })
        );
      } else {
        if (nextTopicId && nextType === "TOPIC") {
          router.push(`/courses/${courseId}/topics/${nextTopicId}`);
        } else if (nextType === "QUIZ") {
          router.push(`/courses/${courseId}/quiz/${nextTopicId}`);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    }
  };

  const isPassed = correctAnswers >= passingScore;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="border-0 shadow-md w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle
            className={`text-3xl font-serif ${isPassed ? "text-green-600" : "text-red-600"}`}
          >
            {isPassed ? "Congratulations!" : "Quiz Completed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Results Summary */}
          <div className="text-center space-y-2">
            <p className="text-xl font-medium">
              Your Score: {correctAnswers} / {totalQuestions}
            </p>
            <p
              className={`font-semibold ${isPassed ? "text-green-700" : "text-red-700"}`}
            >
              {isPassed ? "You Passed!" : "You Did Not Pass"}
            </p>
          </div>

          {/* Bar Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <Tooltip />
                <Bar
                  dataKey="Correct"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
                <Bar
                  dataKey="Incorrect"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Results */}
          <div className="flex justify-between text-sm font-medium text-gray-600 gap-x-3">
            <span>Total Questions: {totalQuestions}</span>
            <span>Correct Answers: {correctAnswers}</span>
            <span>Incorrect Answers: {incorrectAnswers}</span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-x-3">
          <Button
            className="w-full text-md rounded"
            onClick={handleTryAgain}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Try Again
          </Button>
          <Button
            className="w-full text-md rounded bg-[#27E0B3] hover:bg-[#27e0b2ac]"
            onClick={handleNextAction}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Go to Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EndPage;
