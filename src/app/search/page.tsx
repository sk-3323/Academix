"use client";

import { GetCategoryApi } from "@/store/category/slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Categories from "./_components/categories";
import { SearchInput } from "@/components/Navbar/search-input";

const searchPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: any) => state["CategoryStore"]);

  useEffect(() => {
    dispatch(GetCategoryApi());
  }, []);

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categories items={data} />
      </div>
    </>
  );
};

export default searchPage;
