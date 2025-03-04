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

interface EndPageProps {
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  passingScore: number;

  nextAction?: () => void;
}

const EndPage = ({
  correctAnswers,
  incorrectAnswers,
  totalQuestions,
  passingScore,
  nextAction,
}: EndPageProps) => {
  const router = useRouter();

  const chartData = [
    {
      name: "Answers",
      Correct: correctAnswers,
      Incorrect: incorrectAnswers,
    },
  ];

  const handleNextAction = () => {
    // if (nextAction) {
    //   nextAction();
    // } else {
    //   // Default navigation if no specific action provided
    //   router.push("/dashboard");
    // }
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
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Correct" fill="#10B981" />
                <Bar dataKey="Incorrect" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Results */}
          <div className="flex justify-between text-sm font-medium text-gray-600">
            <span>Total Questions: {totalQuestions}</span>
            <span>Correct Answers: {correctAnswers}</span>
            <span>Incorrect Answers: {incorrectAnswers}</span>
          </div>
        </CardContent>

        <CardFooter className="flex gap-x-3">
          <Button
            className="w-full text-md rounded"
            onClick={handleNextAction}
          >
            Try Again
          </Button>
          <Button
            className="w-full text-md rounded bg-[#27E0B3] hover:bg-[#27e0b2ac]"
            onClick={handleNextAction}
          >
            Go to Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EndPage;
