import { configureStore } from "@reduxjs/toolkit";
import HomeSlice from "@/store/home/slice";
import CourseSlice from "@/store/course/slice";
import CategorySlice from "@/store/category/slice";
import ChapterSlice from "@/store/chapter/slice";
import TopicSlice from "@/store/topic/slice";
import ResourceSlice from "@/store/resource/slice";
import UserProgressSlice from "@/store/user-progress/slice";
import EnrollmentSlice from "@/store/enrollment/slice";
import QuizSlice from "@/store/quiz/slice";
import QuestionSlice from "@/store/question/slice";
import OptionSlice from "@/store/options/slice";
import UserSlice from "@/store/user/slice";
import QuizProgressSlice from "@/store/quiz-progress/slice";
import QuizAnswerSlice from "@/store/quiz-answer/slice";
import PaymentRequestSlice from "@/store/payment-request/slice";

const store = configureStore({
  reducer: {
    HomeStore: HomeSlice,
    UserStore: UserSlice,
    CourseStore: CourseSlice,
    CategoryStore: CategorySlice,
    ChapterStore: ChapterSlice,
    TopicStore: TopicSlice,
    ResourceStore: ResourceSlice,
    UserProgressStore: UserProgressSlice,
    EnrollmentStore: EnrollmentSlice,
    QuizStore: QuizSlice,
    QuestionStore: QuestionSlice,
    OptionStore: OptionSlice,
    QuizProgressStore: QuizProgressSlice,
    QuizAnswerStore: QuizAnswerSlice,
    PaymentRequestStore: PaymentRequestSlice,
  },
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
