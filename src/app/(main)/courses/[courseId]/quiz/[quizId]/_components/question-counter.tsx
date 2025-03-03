import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";

const QuestionCounter = ({
  correct,
  wrong,
}: {
  correct: number;
  wrong: number;
}) => {
  return (
    <Card className="flex flex-row item-center justify-center p-2 gap-x-2">
      <CheckCircle2 className="text-emerald-500" size={30} />
      <span className="mx-2 text-2xl text-emerald-500">{correct}</span>
      <Separator
        orientation="vertical"
        className="dark:bg-slate-600 bg-slate-400"
      />
      <span className="mx-2 text-2xl text-red-500">{wrong}</span>
      <XCircle color="red" size={30} />
    </Card>
  );
};

export default QuestionCounter;
