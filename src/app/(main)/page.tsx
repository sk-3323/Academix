"use client";

import { Button } from "@/components/ui/button";
import Courses from "@/components/CourseList/Courses";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CourseMarquee } from "@/components/Marquee/course-marquee";
import { useRouter } from "next/navigation";
import CountUp from "@/components/ui/count-up";
import { useSelector } from "react-redux";

export default function Home() {
  const { data } = useSelector((state: any) => state.HomeStore);
  const quotes = ["Learn Smarter", "Not Harder"];
  const router = useRouter();

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-full">
          <TextGenerateEffect
            words={quotes}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter break-words"
          />
        </div>
        <Button
          className="mt-6 bg-[#27E0B3] text-zinc-950 hover:bg-[#20c9a0] px-4 py-2 sm:px-6 sm:py-3 rounded-md font-semibold text-sm sm:text-base"
          onClick={() => router.push("/course")}
        >
          Check Courses - Make an Impact
        </Button>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 p-6 mt-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-xl sm:text-3xl md:text-3xl tracking-tight mb-1">
              {!!data?.courses && (
                <>
                  <CountUp
                    from={0}
                    to={data?.courses}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  +
                </>
              )}
            </h1>
            <span className="text-xs sm:text-sm text-gray-600">Courses</span>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-xl sm:text-3xl md:text-3xl tracking-tight mb-1">
              {!!data?.students && (
                <>
                  <CountUp
                    from={0}
                    to={data?.students}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  +
                </>
              )}
            </h1>
            <span className="text-xs sm:text-sm text-gray-600">Students</span>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-xl sm:text-3xl md:text-3xl tracking-tight mb-1">
              {!!data?.teachers && (
                <>
                  <CountUp
                    from={0}
                    to={data?.teachers}
                    separator=","
                    direction="up"
                    duration={1}
                    className="count-up-text"
                  />
                  +
                </>
              )}
            </h1>
            <span className="text-xs sm:text-sm text-gray-600">Teachers</span>
          </div>
        </div>
      </section>

      {/* Course Marquee (Uncommented and Responsive) */}
      <section className="md:w-[89vw] lg:w-[95vw] w-[84vw] py-6 mx-auto overflow-x-hidden">
        <CourseMarquee />
      </section>

      {/* Courses List */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <Courses />
      </section>

      {/* Mission Statement */}
      <section className="w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 bg-gray-100 dark:bg-black/80">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter text-center max-w-2xl">
          We do whatever it takes to help you
        </h1>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter text-[#27E0B3] text-center mt-2 max-w-2xl">
          understand the concepts.
        </h1>
      </section>

      {/* Video Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full max-w-[900px] mx-auto">
          <iframe
            width="100%"
            height="auto"
            src="https://www.youtube.com/embed/WhLLzITPu8Q?si=WxR_6rfm82fEXVAH&autoplay=1&loop=1&playlist=WhLLzITPu8Q"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-xl w-full aspect-video"
          />
        </div>
      </section>
    </div>
  );
}
