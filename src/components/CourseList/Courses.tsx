import { useSelector } from "react-redux";
import { HoverEffect } from "../ui/card-hover-effect";

const Courses = () => {
  const { data } = useSelector((state: any) => state.HomeStore);

  return (
    <div className="w-full p-10 min-h-screen my-10">
      <h1 className="font-bold text-2xl">
        Offered <span className="text-[#27E0B3]">Courses</span>
      </h1>
      <div className="courses flex justify-center items-center">
        <HoverEffect items={data?.topCourses} />
      </div>
    </div>
  );
};

export default Courses;
