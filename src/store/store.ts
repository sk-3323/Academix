import { configureStore } from "@reduxjs/toolkit";
import CourseSlice from "@/store/course/slice";
import CategorySlice from "@/store/category/slice";
import ChapterSlice from "@/store/chapter/slice";
import TopicSlice from "@/store/topic/slice";

const store = configureStore({
  reducer: {
    CourseStore: CourseSlice,
    CategoryStore: CategorySlice,
    ChapterStore: ChapterSlice,
    TopicStore: TopicSlice,
  },
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
