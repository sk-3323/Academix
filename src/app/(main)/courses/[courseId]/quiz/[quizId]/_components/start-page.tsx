"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  formatSecondsToMinutes } from "@/lib/format";
import { AddQuizProgressApi } from "@/store/quiz-progress/slice";
import { AppDispatch } from "@/store/store";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface StartPageProps {
  // setActions: any;
  quiz: any;
  quizId: string;
  userId?: string;
  loading: boolean;
}

const StartPage = ({
  // setActions,
  quiz,
  quizId,
  userId,
  loading,
}: StartPageProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleQuizStart = async () => {
    try {
      // setActions((current: any) => {
      //   return { ...current, callbackFunction: () => {} };
      // });

      await dispatch(
        AddQuizProgressApi({
          values: { quizId, userId },
          requiredFields: ["quizId", "userId"],
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message);
      throw error;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="border-0 shadow-md flex flex-col">
        <CardHeader className="flex-grow flex flex-col justify-center">
          <CardTitle className="text-3xl font-serif text-center">
            {quiz?.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex justify-center px-6">
          <Button
            className="text-xl py-6 rounded w-full bg-[#27E0B3] hover:bg-[#27e0b2ac]"
            onClick={handleQuizStart}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2" />}
            Start
          </Button>
        </CardContent>

        <CardFooter className="pb-6 px-6">
          <div className="w-full flex justify-between items-center text-sm font-medium">
            <span>
              {quiz?.questions?.length > 0 &&
                `${quiz?.questions?.length} Questions`}
            </span>

            <span>
              Time:{" "}
              {quiz?.timeLimit
                ? formatSecondsToMinutes(quiz?.timeLimit)
                : "No Limit"}
            </span>

            <span>Passing Score: {quiz?.passingScore || "No Limit"}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StartPage;
