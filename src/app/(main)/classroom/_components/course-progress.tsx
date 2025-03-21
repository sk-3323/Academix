import { AppDispatch } from "@/store/store";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Course } from "../../../../../types/allType";
import { GetEnrollmentApi } from "@/store/enrollment/slice";
import { CourseProgress } from "@/components/Course/course-progress";
import { GetSingleCourseWithProgressApi } from "@/store/course/slice";

const CourseProgressComponent = ({ course }: { course: Course }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const { singleData } = useSelector((state: any) => state["CourseStore"]);
  console.log(singleData, "coursedata");

  useEffect(() => {
    dispatch(
      GetSingleCourseWithProgressApi({
        id: course.id,
      })
    );
  }, [course.id]);
  const data = useSelector((state: any) => state["EnrollmentStore"]);
  console.log(data, "enroll");
  
  useEffect(() => {
    if (course?.id && session?.user?.id) {
      dispatch(
        GetEnrollmentApi({
          searchParams: {
            courseId: course?.id,
            userId: session?.user?.id,
            payment_status: "PAID",
            not_status: "DROPPED",
          },
        })
      );
    }
  }, [course?.id, session?.user?.id]);
  return (
    <div>
      {data?.length !== 0 && !isNaN(singleData?.progressCount) && (
        <div className="mt-1">
          <CourseProgress
            variant={singleData?.progressCount === 100 ? "success" : "default"}
            value={singleData?.progressCount}
          />
        </div>
      )}
    </div>
  );
};

export default CourseProgressComponent;
