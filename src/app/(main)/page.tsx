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
  const quotes = ["Learn Smarter", " Not Harder"];
  return (
    <div className="w-full">
      <div className=" h-screen w-full flex flex-col justify-center items-center">
        {/* <h1 className="text-7xl font-extrabold leading-none tracking-tighter">
          Learn <span className="text-[#27E0B3]">Learn</span>
        </h1>
        <h1 className="text-7xl font-extrabold leading-none tracking-tighter">
          Not Harder
        </h1> */}
        <div className="w-full flex justify-center items-center">
          <TextGenerateEffect words={quotes}></TextGenerateEffect>
        </div>
        <button className="bg-[#27E0B3] text-zinc-950 p-3 rounded-md font-semibold mt-5 ">
          Check Courses-Make an Impact
        </button>
        <div className="flex p-10 mt-5 w-full justify-evenly">
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl tracking-tight mb-1">25+</h1>
            <span className="text-sm">Courses</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl mb-1 tracking-tight">25+</h1>
            <span className="text-sm">Students</span>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl mb-1 tracking-tight">25+</h1>
            <span className="text-sm">Teachers</span>
          </div>
        </div>
      </div>
      <CourseMarquee />
      <Courses />
      <div className="flex w-full flex-col justify-center items-center p-5 my-10">
        <h1 className="lg:text-5xl md:text-3xl sm:2xl font-semibold leading-none tracking-tighter my-5">
          we do whatever it takes to help you
        </h1>
        <h1 className="lg:text-5xl text-3xl font-semibold leading-none tracking-tighter my-1 text-[#27E0B3]">
          understand the concepts.
        </h1>
      </div>
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel
          defaultSize={100}
          className="flex justify-center items-center"
        >
          <iframe
            width="1040"
            height="540"
            src="https://www.youtube.com/embed/-9-jzZqGB-4?si=laj27EL5ygsAjG0c"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="rounded-xl lg:h-[500px] lg:w-[900px] md:h-[400px] md:w-[700px]"
          ></iframe>
        </ResizablePanel>
        {/* <ResizableHandle /> */}
        {/* <ResizablePanel>Two</ResizablePanel> */}
      </ResizablePanelGroup>
    </div>
  );
}
