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
import { FlagIcon, Forward, Loader2, Lock, Timer, Undo2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  AddQuizAnswerApi,
  clearQuizAnswerData,
  clearQuizAnswerState,
} from "@/store/quiz-answer/slice";
import { toast } from "sonner";
import EndPage from "./_components/end-page";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const QuizIdPage = ({
  params,
}: {
  params: { courseId: string; quizId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();

  const { singleData: quiz } = useSelector((state: any) => state["QuizStore"]);
  const { loading: quizProgressLoading } = useSelector(
    (state: any) => state["QuizProgressStore"]
  );
  const { loading: quizAnswerLoading, singleData: quizAnswerResult } =
    useSelector((state: any) => state["QuizAnswerStore"]);

  useEffect(() => {
    dispatch(
      GetPublishedQuizWithProgressApi({
        courseId: params?.courseId,
        quizId: params?.quizId,
      })
    );
  }, [params?.courseId]);

  const [isLocked, setIsLocked] = useState(
    quiz?.chapter?.course?.enrollments?.length === 0
  );

  useEffect(() => {
    let flag = quiz?.chapter?.course?.enrollments?.length === 0;

    setIsLocked(flag);
  }, [quiz?.chapter?.course?.enrollments]);

  const [isEnded, setIsEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [isAttempted, setIsAttempted] = useState(
    quiz?.completedBy?.length === 0
  );
  useEffect(() => {
    let flag = quiz?.completedBy?.length === 0;

    setIsAttempted(flag);
  }, [quiz?.completedBy]);

  const handleSubmitOnTimeExpire = async () => {
    setTimerActive(false);

    await dispatch(
      AddQuizAnswerApi({
        values: {
          answerId: selectedChoice,
          questionId: currentQuestion?.id,
          quizProgressId: quiz?.completedBy?.[0]?.id,
        },
      })
    );
    toast.info("Time's up! Moving to next question.");
  };

  useEffect(() => {
    if (!isLocked && !isAttempted && quiz?.timeLimit) {
      // Convert timeLimit to seconds (assuming it's stored in seconds)
      setTimeLeft(quiz.timeLimit);
      setTimerActive(true);
    }
  }, [quiz?.timeLimit, isLocked, isAttempted]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timerActive && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Auto-submit when time expires
      handleSubmitOnTimeExpire();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, timeLeft]);

  // Reset timer when moving to next question
  useEffect(() => {
    if (!isLocked && !isAttempted && quiz?.timeLimit) {
      setTimeLeft(quiz.timeLimit);
      setTimerActive(true);
    }
  }, [questionIndex]);

  const handleSuccess = () => {
    dispatch(
      GetPublishedQuizWithProgressApi({
        courseId: params?.courseId,
        quizId: params?.quizId,
      })
    );
    setIsEnded(false);
    setQuestionIndex(0);
    setSelectedChoice(null);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setTimeLeft(quiz?.timeLimit || null);
    setTimerActive(false);
  };

  const [quizProgressActions, setQuizProgressActions] = useState({
    clearState: clearQuizProgressState,
    callbackFunction: handleSuccess,
  });

  useDynamicToast("QuizProgressStore", quizProgressActions);

  const [quizAnswerActions, setQuizAnswerActions] = useState({
    clearState: clearQuizAnswerState,
    callbackFunction: () => {},
  });

  useDynamicToast("QuizAnswerStore", quizAnswerActions);

  const currentQuestion = useMemo(() => {
    return quiz?.questions?.[questionIndex];
  }, [questionIndex, quiz?.questions]);

  const options = useMemo(() => {
    if (!currentQuestion?.options) {
      return [];
    }
    return currentQuestion?.options;
  }, [currentQuestion]);

  const [isCompleted, setIsCompleted] = useState(
    quiz?.completedBy?.[0]?.isCompleted
  );
  useEffect(() => {
    let flag = quiz?.completedBy?.[0]?.isCompleted;

    setIsCompleted(flag);
  }, [quiz?.completedBy?.[0]?.isCompleted]);

  useEffect(() => {
    if (isCompleted) {
      setIsEnded(true);
    } else {
      setIsEnded(false);
    }
  }, [isCompleted]);

  const handleNext = useCallback(async () => {
    setTimerActive(false);

    if (!selectedChoice) {
      toast.error("Please select an option");
    } else {
      await dispatch(
        AddQuizAnswerApi({
          values: {
            answerId: selectedChoice,
            questionId: currentQuestion?.id,
            quizProgressId: quiz?.completedBy?.[0]?.id,
          },
        })
      );
    }
  }, [
    params?.quizId,
    currentQuestion?.id,
    quiz?.completedBy?.[0]?.id,
    selectedChoice,
  ]);

  useEffect(() => {
    if (Object.keys(quizAnswerResult).length !== 0) {
      if (quizAnswerResult?.isCorrect) {
        setCorrectAnswers((pre) => pre + 1);
      } else {
        setWrongAnswers((pre) => pre + 1);
      }
      setSelectedChoice(null);
      if (questionIndex === quiz?.questions?.length - 1) {
        setIsEnded(true);
        setTimerActive(false);
        return;
      }
      setQuestionIndex((pre) => pre + 1);
      dispatch(clearQuizAnswerData());

      if (quiz?.timeLimit) {
        setTimeLeft(quiz.timeLimit);
        setTimerActive(true);
      }
    }
  }, [quizAnswerResult?.isCorrect]);

  useEffect(() => {
    let correct = 0;
    let wrong = 0;
    let index = 0;
    setSelectedChoice(null);
    quiz?.completedBy?.[0]?.userAnswers?.forEach((ans: any, i: number) => {
      if (ans?.isCorrect) {
        correct += 1;
      } else {
        wrong += 1;
      }
      if (questionIndex === quiz?.questions?.length) {
        setIsEnded(true);
        setTimerActive(false);
        return;
      }
      index = i + 1;
    });

    setCorrectAnswers(correct);
    setWrongAnswers(wrong);
    setQuestionIndex(index);

    if (!isEnded && quiz?.timeLimit) {
      setTimeLeft(quiz.timeLimit);
      setTimerActive(true);
    }
  }, [quiz?.completedBy?.[0]?.userAnswers]);

  useEffect(() => {
    if (isLocked || isAttempted) {
      setTimerActive(false);
    }
  }, [isLocked, isAttempted]);

  if (isEnded) {
    return (
      <EndPage
        correctAnswers={correctAnswers}
        incorrectAnswers={wrongAnswers}
        totalQuestions={quiz?.questions?.length}
        passingScore={quiz?.passingScore}
        loading={quizProgressLoading}
        quizProgressId={quiz?.completedBy?.[0]?.id}
        isCompleted={isCompleted}
        handleSuccess={handleSuccess}
        nextTopicId={quiz?.nextQuiz?.id}
        nextType={quiz?.nextQuiz?.nextType}
        setQuizProgressActions={setQuizProgressActions}
        courseId={params?.courseId}
      />
    );
  }

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
          loading={quizProgressLoading}
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
                    {timeLeft !== null ? formatTime(timeLeft) : "0:00"}
                  </span>
                </div>
              </div>
              <QuestionCounter correct={correctAnswers} wrong={wrongAnswers} />
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
                  variant={
                    selectedChoice === option?.id ? "default" : "secondary"
                  }
                  onClick={() => {
                    setSelectedChoice(option?.id);
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
              <Button
                className="mt-2"
                onClick={handleNext}
                disabled={quizAnswerLoading}
              >
                {true ? (
                  <span className="flex items-center gap-2">
                    {" "}
                    {quizAnswerLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Forward />
                    )}
                    Next
                  </span>
                ) : (
                  <>
                    <span className="flex items-center gap-2">
                      {quizAnswerLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FlagIcon />
                      )}
                      Finish
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
