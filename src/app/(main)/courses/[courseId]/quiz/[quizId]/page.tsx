"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { FlagIcon, Forward, Lock, Timer, Undo2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Label } from "recharts";
import QuestionCounter from "./_components/question-counter";
import { useDispatch, useSelector } from "react-redux";
import {
  GetPublishedQuizWithProgressApi,
  GetSingleQuizApi,
} from "@/store/quiz/slice";
import { AppDispatch } from "@/store/store";
import { clearEnrollmentState } from "@/store/enrollment/slice";
import { usePathname } from "next/navigation";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { clearQuizProgressState } from "@/store/quiz-progress/slice";
import { Banner } from "@/components/banner";
import StartPage from "./_components/start-page";
import { useSession } from "next-auth/react";

const QuizIdPage = ({
  params,
}: {
  params: { courseId: string; quizId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: quiz } = useSelector((state: any) => state["QuizStore"]);
  const { loading } = useSelector((state: any) => state["QuizProgressStore"]);
  const { data: session } = useSession();

  useEffect(() => {
    dispatch(
      GetPublishedQuizWithProgressApi({
        courseId: params?.courseId,
        quizId: params?.quizId,
      })
    );
  }, [params?.courseId]);

  const handleSuccess = () => {
    dispatch(
      GetPublishedQuizWithProgressApi({
        courseId: params?.courseId,
        quizId: params?.quizId,
      })
    );
  };

  const [isLocked, setIsLocked] = useState(
    quiz?.chapter?.course?.enrollments?.length === 0
  );

  useEffect(() => {
    let flag = quiz?.chapter?.course?.enrollments?.length === 0;

    setIsLocked(flag);
  }, [quiz?.chapter?.course?.enrollments]);

  const [isCompleteOnEnd, setIsCompleteOnEnd] = useState(
    quiz?.chapter?.course?.enrollments?.length !== 0 &&
      quiz?.completedBy?.length === 0
  );

  useEffect(() => {
    let flag =
      quiz?.chapter?.course?.enrollments?.length !== 0 &&
      !quiz?.completedBy?.[0]?.isCompleted;

    setIsCompleteOnEnd(flag);
  }, [quiz?.completedBy, quiz?.chapter?.course?.enrollments]);

  const [enrollmentActions, setEnrollmentActions] = useState({
    clearState: clearEnrollmentState,
    callbackFunction: () => {},
  });
  let pathname = usePathname();

  useDynamicToast("EnrollmentStore", enrollmentActions, pathname);

  const [quizProgressActions, setQuizProgressActions] = useState({
    clearState: clearQuizProgressState,
    callbackFunction: handleSuccess,
  });

  useDynamicToast("QuizProgressStore", quizProgressActions);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(0);

  const currentQuestion = useMemo(() => {
    return quiz?.questions?.[questionIndex];
  }, [questionIndex, quiz?.questions]);

  const options = useMemo(() => {
    if (!currentQuestion?.options) {
      return [];
    }
    return currentQuestion?.options;
  }, [currentQuestion]);

  const [isAttempted, setIsAttempted] = useState(
    quiz?.completedBy?.length === 0
  );

  useEffect(() => {
    let flag = quiz?.completedBy?.length === 0;

    setIsAttempted(flag);
  }, [quiz?.completedBy]);

  return (
    <>
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to attempt this quiz"
        />
      )}

      {isLocked && (
        <div className="w-full flex items-center justify-center flex-col gap-y-2 bg-slate-200 dark:bg-slate-700 h-[70vh] mt-2">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This Quiz is Locked</p>
        </div>
      )}

      {!isLocked && isAttempted && (
        <StartPage
        quiz={quiz}
          // setActions={setQuizProgressActions}
          quizId={params?.quizId}
          userId={session?.user?.id!}
          loading={loading}
        />
      )}
      {!isLocked && !isAttempted && (
        <>
          <div className="w-full">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <div className="flex items-end justify-end mt-3 text-slate-400">
                  <Timer className="h-8 w-8 mr-2" />
                  <span className="text-2xl flex items-end justify-end">
                    0:0
                  </span>
                </div>
              </div>
              <QuestionCounter correct={3} wrong={1} />
            </div>

            <Card className="w-full mt-4">
              <CardHeader className="flex flex-row items-center">
                <CardTitle className="mr-5 text-center divide-y divide-zinc-600">
                  <div>{questionIndex + 1}</div>
                  <div className="text-base text-slate-400">
                    {quiz?.questions?.length}
                  </div>
                </CardTitle>
                <CardDescription className="flex-grow text-lg">
                  {currentQuestion?.title}
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="flex flex-col items-center justify-center w-full mt-4">
              {options.map((option: any, i: number) => (
                <Button
                  key={i}
                  className="flex justify-start w-full py-8 mb-4"
                  variant={selectedChoice === i ? "default" : "secondary"}
                  onClick={() => {
                    setSelectedChoice(i);
                  }}
                >
                  <div className="flex items-center justify-start">
                    <div className="p-2 px-3 mr-5 border dark:border-gray-500/40 border-gray-200 rounded-md">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="text-start">{option?.title}</div>
                  </div>
                </Button>
              ))}
              <Button className="mt-2">
                {true ? (
                  <span className="flex items-center gap-2">
                    {" "}
                    <Forward /> Next
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      <FlagIcon className="text-xl" /> Finish
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuizIdPage;
