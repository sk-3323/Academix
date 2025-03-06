"use client";

import QuizActions from "@/components/Quiz/quiz-actions";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { useDynamicToast } from "@/hooks/DynamicToastHook";
import { AppDispatch } from "@/store/store";
import { clearQuizState, GetSingleQuizApi } from "@/store/quiz/slice";
import {
  ArrowLeft,
  CopyCheck,
  Eye,
  LayoutDashboard,
  ListChecks,
  Puzzle,
  Star,
  Timer,
  Video,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScoreForm from "@/components/Quiz/score-form";
import TimeLimitForm from "@/components/Quiz/time-limit-form";
import QuestionForm from "@/components/Quiz/question-form";
import {
  clearQuestionState,
  GetSingleQuestionApi,
} from "@/store/question/slice";
import QuestionActions from "@/components/Question/question-actions";
import TitleForm from "@/components/Question/title-form";
import PointForm from "@/components/Question/point-form";
import AnswerForm from "@/components/Question/answer-form";
import OptionForm from "@/components/Question/option-form";
import { clearOptionState } from "@/store/options/slice";

const page = ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
    quizId: string;
    questionId: string;
  };
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData } = useSelector((state: any) => state["QuestionStore"]);

  useEffect(() => {
    dispatch(GetSingleQuestionApi({ id: params?.questionId }));
  }, []);

  const [questionActions, setQuestionActions] = useState({
    clearState: clearQuestionState,
    callbackFunction: () => {},
  });

  useDynamicToast("QuestionStore", questionActions);

  const [optionActions, setOptionActions] = useState({
    clearState: clearOptionState,
    callbackFunction: () => {},
  });

  useDynamicToast("OptionStore", optionActions);

  const requiredFields = [
    singleData?.title,
    singleData?.points,
    singleData?.answerId,
    singleData?.options?.some((option: any) => option?.status === "PUBLISHED"),
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
          label=" This question is unpublished. It will not be visible in the quiz. "
        />
      )}
      <div className="w-full p-6">
        <Link
          href={`/teacher/courses/${params?.courseId}/chapters/${params?.chapterId}/quiz/${params?.quizId}`}
          className="flex items-center text-sm hover:opacity-75 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to quiz setup
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Question setup</h1>
            <span className="text-sm">
              Complete all fields {completionText}{" "}
            </span>
          </div>

          <QuestionActions
            disabled={!isComplete}
            courseId={params?.courseId}
            chapterId={params?.chapterId}
            quizId={params?.quizId}
            questionId={params?.questionId}
            status={singleData?.status}
            setActions={setQuestionActions}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your question </h2>
            </div>

            <TitleForm
              initialData={{ title: singleData?.title }}
              questionId={params?.questionId}
              setActions={setQuestionActions}
            />

            <div className="flex items-center gap-x-2 mt-6 ">
              <IconBadge icon={Star} />
              <h2 className="text-xl">Points and Answer</h2>
            </div>

            <PointForm
              initialData={{ points: singleData?.points }}
              questionId={params?.questionId}
              setActions={setQuestionActions}
            />

            <AnswerForm
              initialData={{ answerId: singleData?.answerId }}
              questionId={params?.questionId}
              setActions={setQuestionActions}
              options={singleData?.options || []}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CopyCheck} />
                <h2 className="text-xl">Multiple Question Choices</h2>
              </div>
              <OptionForm
                initialData={{ options: singleData?.options }}
                questionId={params?.questionId}
                setActions={setOptionActions}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
