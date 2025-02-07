import { configureStore } from "@reduxjs/toolkit";
import CourseSlice from "@/store/course/slice";

const store = configureStore({
  reducer: {
    CourseStore: CourseSlice,
  },
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
