"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { GetSingleCourseApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChapterManagement = ({ courseId }: { courseId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: course } = useSelector((state: any) => state.CourseStore); // Assuming singleData holds the fetched course

  useEffect(() => {
    if (courseId) {
      dispatch(GetSingleCourseApi({ id: courseId }));
    }
  }, [courseId, dispatch]);

  console.log("Selected Course Data:", course);

  return (
    <Accordion type="single" collapsible className="w-full">
      {course?.chapters?.length > 0 ? (
        course.chapters.map((chapter: any) => (
          <AccordionItem key={chapter.id} value={chapter.id}>
            <AccordionTrigger>{chapter.title}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {/* Placeholder for topics (your data doesn’t include topics yet) */}
                <div className="flex items-center justify-between">
                  <div>Topic 1: Getting Started</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>Topic 2: Basic Concepts</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Topic
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <p>No chapters available for this course.</p>
      )}
    </Accordion>
  );
};

export default ChapterManagement;