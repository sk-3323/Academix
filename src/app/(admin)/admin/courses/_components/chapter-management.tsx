import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetChapterApi } from "@/store/chapter/slice";
import { GetSingleCourseApi } from "@/store/course/slice";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import { AppDispatch } from "@/store/store";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DeleteTopicApi } from "@/store/topic/slice";

const ChapterManagement = ({ courseId }: { courseId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: course } = useSelector((state: any) => state.CourseStore);
  const { data: chapterData } = useSelector((state: any) => state.ChapterStore);

  const router = useRouter();
  useEffect(() => {
    if (courseId) {
      dispatch(GetSingleCourseApi({ id: courseId }));
      dispatch(GetChapterApi({ searchParams: { courseId: courseId } }));
    }
  }, [courseId, dispatch]);

  // Create a map from chapter ID to full chapter object
  const chapterMap = {};
  chapterData.forEach((fullChapter: any) => {
    chapterMap[fullChapter.id] = fullChapter;
  });
  console.log(course);
  console.log(chapterData);

  return (
    <div className="w-full">
      {course?.chapters?.length > 0 ? (
        <Accordion type="single" collapsible>
          {course.chapters?.map((chapter: any) => {
            const fullChapter = chapterMap[chapter.id];
            return (
              <AccordionItem key={chapter.id} value={chapter.id}>
                <AccordionTrigger>{chapter.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {fullChapter?.topics?.length > 0 ? (
                      fullChapter.topics.map((topic: any) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <div>{topic.title}</div>
                          {/* <div className="badge">{topic.status}</div> */}
                          <div className="flex gap-2">
                            <Badge variant="secondary">{topic.status}</Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/admin/courses/${course.id}/chapters/${chapter.id}/topics/${topic.id}`
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                dispatch(
                                  DeleteTopicApi({
                                    id: topic.id,
                                  })
                                );
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">No topics available.</p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/admin/courses/${course.id}`)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Topic
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ) : (
        <p className="text-center">No chapters available for this course.</p>
      )}
    </div>
  );
};

export default ChapterManagement;
