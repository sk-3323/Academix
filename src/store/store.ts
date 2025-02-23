import { configureStore } from "@reduxjs/toolkit";
import CourseSlice from "@/store/course/slice";
import CategorySlice from "@/store/category/slice";
import ChapterSlice from "@/store/chapter/slice";
import TopicSlice from "@/store/topic/slice";
import ResourceSlice from "@/store/resource/slice";
import UserProgressSlice from "@/store/user-progress/slice";
import EnrollmentSlice from "@/store/enrollment/slice";
import QuizSlice from "@/store/quiz/slice";
import QuestionSlice from "@/store/question/slice";

const store = configureStore({
  reducer: {
    CourseStore: CourseSlice,
    CategoryStore: CategorySlice,
    ChapterStore: ChapterSlice,
    TopicStore: TopicSlice,
    ResourceStore: ResourceSlice,
    UserProgressStore: UserProgressSlice,
    EnrollmentStore: EnrollmentSlice,
    QuizStore: QuizSlice,
    QuestionStore: QuestionSlice,
  },
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
