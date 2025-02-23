"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import Courses from "@/components/CourseList/Courses";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CourseMarquee } from "@/components/Marquee/course-marquee";

export default function Home() {
  const quotes = ["Learn Smarter", "Not Harder"];

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
        <Button className="mt-6 bg-[#27E0B3] text-zinc-950 hover:bg-[#20c9a0] px-4 py-2 sm:px-6 sm:py-3 rounded-md font-semibold text-sm sm:text-base">
          Check Courses - Make an Impact
        </Button>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 p-6 mt-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
          {[
            { stat: "25+", label: "Courses" },
            { stat: "25+", label: "Students" },
            { stat: "25+", label: "Teachers" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl tracking-tight mb-1">
                {item.stat}
              </h1>
              <span className="text-xs sm:text-sm text-gray-600">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Course Marquee (Uncommented and Responsive) */}
      <section className="md:w-[90vw] lg:w-[96vw] w-[85vw] py-6 mx-auto overflow-x-hidden">
        <CourseMarquee />
      </section>

      {/* Courses List */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <Courses />
      </section>

      {/* Mission Statement */}
      <section className="w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 bg-gray-100">
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
            src="https://www.youtube.com/embed/-9-jzZqGB-4?si=laj27EL5ygsAjG0c"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-xl w-full aspect-video"
          />
        </div>
      </section>
    </div>
  );
}
