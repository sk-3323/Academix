"use client";

import { GetCategoryApi } from "@/store/category/slice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Categories from "../api/course/_components/categories";

const searchPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: any) => state["CategoryStore"]);

  useEffect(() => {
    dispatch(GetCategoryApi());
  }, []);

  return (
    <div className="p-6">
      <Categories items={data} />
    </div>
  );
};

export default searchPage;
