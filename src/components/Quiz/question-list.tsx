"use client";

import { useEffect, useState } from "react";
import { Question } from "@prisma/client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "../ui/badge";

interface QuestionListProps {
  items: Question[];
  onReorder: (updatedData: { id: string; order: number }[]) => void;
  onEdit: (id: string) => void;
}

const QuestionList = ({ items, onReorder, onEdit }: QuestionListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestions(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result?.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result?.source?.index, 1);
    items.splice(result?.destination?.index, 0, reorderedItem);

    const startIndex = Math.min(
      result?.source?.index,
      result?.destination?.index
    );
    const endIndex = Math.max(
      result?.source?.index,
      result?.destination?.index
    );
    let updatedQuestion = items.slice(startIndex, endIndex + 1);

    setQuestions(items);

    let bulkUpdateData: any = updatedQuestion.map((questions) => ({
      id: questions?.id,
      order: items.findIndex((item) => item?.id === questions?.id) + 1,
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {questions.map((questions: any, index: number) => (
              <Draggable key={questions?.id} draggableId={questions?.id} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 dark:bg-gray-700 border-slate-200 dark:border-gray-600 border text-slate-700 dark:text-slate-200 mb-4 text-sm rounded-lg",
                      questions?.status === "PUBLISHED" &&
                        "bg-sky-100 dark:bg-sky-900 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-200"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 border-r-slate-300 dark:border-r-gray-600  dark:hover:bg-gray-600 rounded-l-md transition",
                        questions?.status === "PUBLISHED" &&
                          "border-r-sky-200 dark:border-r-sky-800 bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {questions?.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {questions?.status && (
                        <Badge
                          className={cn(
                            "bg-slate-500 dark:bg-gray-300",
                            questions?.status === "PUBLISHED" &&
                              "bg-sky-700 dark:bg-sky-400"
                          )}
                        >
                          {questions?.status}
                        </Badge>
                      )}
                      <Pencil
                        onClick={() => onEdit(questions?.id)}
                        className="w-4 h-4 ms-1 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided?.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default QuestionList;
