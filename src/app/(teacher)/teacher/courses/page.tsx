"use client";

import { Button } from "@/components/ui/button";
import { GetCourseApi } from "@/store/course/slice";
import { AppDispatch } from "@/store/store";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { useSession } from "next-auth/react";

const CoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: any) => state["CourseStore"]);

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      dispatch(
        GetCourseApi({
          searchParams: {
            instructorId: session?.user?.id,
          },
        })
      );
    }
  }, [session?.user?.id]);

  return (
    <div className="p-6">
      <DataTable data={data} columns={columns} />
    </div>
  );
};
export default CoursesPage;
