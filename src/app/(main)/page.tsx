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
// "use client";

// import { Button } from "@/components/ui/button";
// import Courses from "@/components/CourseList/Courses";
// import { CourseMarquee } from "@/components/Marquee/course-marquee";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { TypewriterEffect } from "@/components/ui/typewriter-effect";
// import { TextRevealCard } from "@/components/ui/text-reveal-card";
// import { SparklesCore } from "@/components/ui/sparkles";
// import { MovingBorderButton } from "@/components/ui/moving-border-button";
// import { FloatingNav } from "@/components/ui/floating-navbar";
// import { BookOpen, Lightbulb, Users, GraduationCap } from "lucide-react";
// import { motion } from "framer-motion";

// export default function Home() {
//   const { data } = useSelector((state: any) => state.HomeStore);
//   const router = useRouter();

//   const navItems = [
//     {
//       name: "Home",
//       link: "/",
//       icon: <BookOpen className="h-4 w-4" />,
//     },
//     {
//       name: "Courses",
//       link: "/course",
//       icon: <GraduationCap className="h-4 w-4" />,
//     },
//     {
//       name: "About",
//       link: "/about",
//       icon: <Users className="h-4 w-4" />,
//     },
//   ];

//   return (
//     <div className="w-full min-h-screen overflow-x-hidden">
//       {/* Floating Navigation */}
//       <FloatingNav navItems={navItems} />

//       {/* Hero Section */}
//       <section className="w-full min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative">
//         {/* Background Sparkles */}
//         <div className="absolute inset-0 w-full h-full">
//           <SparklesCore
//             id="sparkles-core"
//             background="transparent"
//             minSize={0.6}
//             maxSize={1.4}
//             particleDensity={70}
//             className="w-full h-full"
//             particleColor="#27E0B3"
//             speed={0.05}
//           />
//         </div>

//         <div className="relative z-10 text-center max-w-full">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mb-6 inline-block px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-sm font-medium"
//           >
//             Welcome to the future of learning
//           </motion.div>

//           <div className="mb-8">
//             <TypewriterEffect
//               words={[
//                 {
//                   text: "Learn",
//                   className: "text-5xl sm:text-6xl md:text-7xl font-bold",
//                 },
//                 {
//                   text: "Smarter,",
//                   className:
//                     "text-5xl sm:text-6xl md:text-7xl font-bold text-[#27E0B3]",
//                 },
//                 {
//                   text: "Not",
//                   className: "text-5xl sm:text-6xl md:text-7xl font-bold",
//                 },
//                 {
//                   text: "Harder",
//                   className:
//                     "text-5xl sm:text-6xl md:text-7xl font-bold text-[#27E0B3]",
//                 },
//               ]}
//               className="mb-4"
//               cursorClassName="h-8 sm:h-10 md:h-12"
//             />
//           </div>

//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1, duration: 0.5 }}
//             className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto mb-8"
//           >
//             Unlock your potential with our interactive courses designed to make
//             learning engaging, effective, and enjoyable.
//           </motion.p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <MovingBorderButton
//               borderRadius="0.5rem"
//               className="bg-black dark:bg-black text-white dark:text-white border-neutral-200 dark:border-slate-800 px-6 py-3 font-medium text-base"
//               onClick={() => router.push("/course")}
//             >
//               Explore Courses
//             </MovingBorderButton>

//             <Button
//               variant="outline"
//               className="px-6 py-3 border-[#27E0B3] text-[#27E0B3] hover:bg-[#27E0B3]/10"
//               onClick={() => router.push("/signup")}
//             >
//               Sign Up Free
//             </Button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-6 mt-12 w-full max-w-4xl">
//           {data?.courses && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//               className="relative group"
//             >
//               <TextRevealCard
//                 text={`${data.courses}+ Courses`}
//                 revealText="Expand Your Knowledge"
//                 className="w-full h-40 sm:h-48"
//               >
//                 <BookOpen className="h-6 w-6 text-[#27E0B3] mb-2" />
//                 <span className="text-sm">Diverse curriculum</span>
//               </TextRevealCard>
//             </motion.div>
//           )}

//           {data?.students && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4, duration: 0.5 }}
//               className="relative group"
//             >
//               <TextRevealCard
//                 text={`${data.students}+ Students`}
//                 revealText="Join Our Community"
//                 className="w-full h-40 sm:h-48"
//               >
//                 <Users className="h-6 w-6 text-[#27E0B3] mb-2" />
//                 <span className="text-sm">Global learners</span>
//               </TextRevealCard>
//             </motion.div>
//           )}

//           {data?.teachers && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6, duration: 0.5 }}
//               className="relative group"
//             >
//               <TextRevealCard
//                 text={`${data.teachers}+ Teachers`}
//                 revealText="Learn From Experts"
//                 className="w-full h-40 sm:h-48"
//               >
//                 <Lightbulb className="h-6 w-6 text-[#27E0B3] mb-2" />
//                 <span className="text-sm">Industry professionals</span>
//               </TextRevealCard>
//             </motion.div>
//           )}
//         </div>
//       </section>

//       {/* Course Marquee */}
//       <section className="md:w-[89vw] lg:w-[95vw] w-[84vw] py-6 mx-auto overflow-x-hidden">
//         <CourseMarquee />
//       </section>

//       {/* Courses List */}
//       <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
//         <Courses />
//       </section>

//       {/* Mission Statement */}
//       <section className="w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 bg-gray-100 dark:bg-black/80">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//           className="text-center"
//         >
//           <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter text-center max-w-2xl">
//             We do whatever it takes to help you
//           </h1>
//           <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tighter text-[#27E0B3] text-center mt-2 max-w-2xl">
//             understand the concepts.
//           </h1>
//           <div className="w-24 h-1 bg-[#27E0B3] mx-auto mt-6 rounded-full" />
//         </motion.div>
//       </section>

//       {/* Video Section */}
//       <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           viewport={{ once: true }}
//           className="w-full max-w-[900px] mx-auto rounded-xl overflow-hidden shadow-2xl"
//         >
//           <iframe
//             width="100%"
//             height="auto"
//             src="https://www.youtube.com/embed/WhLLzITPu8Q?si=WxR_6rfm82fEXVAH&autoplay=1&loop=1&playlist=WhLLzITPu8Q"
//             title="YouTube video player"
//             frameBorder="0"
//             allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerPolicy="strict-origin-when-cross-origin"
//             allowFullScreen
//             className="rounded-xl w-full aspect-video"
//           />
//         </motion.div>
//       </section>
//     </div>
//   );
// }
