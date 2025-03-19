"use client";

import TitleForm from "@/components/Quiz/title-form";
import QuizActions from "@/components/Quiz/quiz-actions";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { AppDispatch } from "@/store/store";
import { clearQuizState, GetSingleQuizApi } from "@/store/quiz/slice";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  ListChecks,
  Puzzle,
  Timer,
  Video,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScoreForm from "@/components/Quiz/score-form";
import TimeLimitForm from "@/components/Quiz/time-limit-form";
import QuestionForm from "@/components/Quiz/question-form";
import { clearQuestionState } from "@/store/question/slice";

const page = ({
  params,
}: {
  params: { courseId: string; chapterId: string; quizId: string };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["QuizStore"]);

  useEffect(() => {
    dispatch(GetSingleQuizApi({ id: params?.quizId }));
  }, []);

  const [quizActions, setQuizActions] = useState({
    clearState: clearQuizState,
    callbackFunction: () => {},
  });

  useDynamicToast("QuizStore", quizActions);

  const [questionActions, setQuestionActions] = useState({
    clearState: clearQuestionState,
    callbackFunction: () => {},
  });

  useDynamicToast("QuestionStore", questionActions);

  const requiredFields = [
    singleData?.title,
    singleData?.passingScore,
    singleData?.questions?.some(
      (chapter: any) => chapter?.status === "PUBLISHED"
    ),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {singleData?.status && singleData?.status === "DRAFT" && (
        <Banner
          variant="warning"
          label=" This quiz is unpublished. It will not be visible in the chapter. "
        />
      )}
      <div className="w-full p-6">
        <Link
          href={`/admin/courses/${params?.courseId}/chapters/${params?.chapterId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to chapter setup
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Quiz setup</h1>
            <span className="text-sm">
              Complete all fields {completionText}{" "}
            </span>
          </div>

          <QuizActions
            disabled={!isComplete}
            courseId={params?.courseId}
            chapterId={params?.chapterId}
            quizId={params?.quizId}
            status={singleData?.status}
            setActions={setQuizActions}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your quiz </h2>
            </div>

            <TitleForm
              initialData={{ title: singleData?.title }}
              quizId={params?.quizId}
              setActions={setQuizActions}
            />

            <div className="flex items-center gap-x-2 mt-6 ">
              <IconBadge icon={Timer} />
              <h2 className="text-xl">Score & Time limits</h2>
            </div>

            <ScoreForm
              initialData={{ passingScore: singleData?.passingScore }}
              quizId={params?.quizId}
              questions={singleData?.questions?.length || 0}
              setActions={setQuizActions}
            />

            <TimeLimitForm
              initialData={{ timeLimit: singleData?.timeLimit }}
              quizId={params?.quizId}
              setActions={setQuizActions}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Puzzle} />
                <h2 className="text-xl">Questions</h2>
              </div>
              <QuestionForm
                initialData={{ questions: singleData?.questions }}
                courseId={params?.courseId}
                chapterId={params?.chapterId}
                quizId={params?.quizId}
                setActions={setQuestionActions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
