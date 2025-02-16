"use client";

import { GetCategoryApi } from "@/store/category/slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Categories from "./_components/categories";
import { SearchInput } from "@/components/Navbar/search-input";
import { useSession } from "next-auth/react";
import CourseList from "./_components/course-list";
import { GetCourseWithProgressApi } from "@/store/course/slice";

interface searchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const searchPage = ({ searchParams }: searchPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: any) => state["CategoryStore"]);
  const { data: courseData } = useSelector(
    (state: any) => state["CourseStore"]
  );

  useEffect(() => {
    dispatch(GetCategoryApi());
  }, []);
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user?.id) {
      dispatch(
        GetCourseWithProgressApi({
          userId: `${session?.user?.id}`,
          title: searchParams?.title,
          categoryId: searchParams?.categoryId,
          requiredFields: ["userId"],
        })
      );
    }
  }, [session?.user?.id, searchParams]);

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 spac-y-4">
        <Categories items={data} />
        <CourseList items={courseData} />
      </div>
    </>
  );
};

export default searchPage;
