"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const courses = [
  {
    title: "Cook Course",
    image:
      "https://images.unsplash.com/photo-1556911261-6bd341186b2f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvb2t8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "How to be organized",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBzeWNvbG9neXxlbnwwfDB8MHx8fDA%3D",
  },
  {
    title: "Street Art",
    image:
      "https://images.unsplash.com/photo-1583225214464-9296029427aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0cmVldCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Photography",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Video Editing",
    image:
      "https://images.unsplash.com/photo-1526698905402-e13b880ad864?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpZGVvJTIwZWRpdHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Business Course",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YnVzc2luZXNzfGVufDB8fDB8fHww",
  },
];

const courses2 = [
  {
    title: "Artificial Intelligence",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fEFJfGVufDB8fDB8fHww",
  },
  {
    title: "Marketing",
    image:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFya2V0aW5nfGVufDB8fDB8fHww",
  },
  {
    title: "Digital Marketing",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRpZ2l0YWwlMjBtYXJrZXRpbmd8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Healthy Lifestyle",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGxpZmVzdHlsZXxlbnwwfDB8MHx8fDA%3D",
  },
  {
    title: "Camping",
    image:
      "https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Health & Fitness",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEZpdG5lc3N8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Teaching & Academics",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVhY2hpbmd8ZW58MHx8MHx8fDA%3D",
  },
];

interface CourseProps {
  image: string;
  title: string;
}

const CourseImage = ({ course }: { course: CourseProps }) => {
  return (
    <div className="w-[160px] sm:w-[220px] md:w-[280px] h-[120px] sm:h-[160px] md:h-[200px] rounded-xl border-2 mx-1 sm:mx-2 group relative overflow-hidden shrink-0">
      <span className="opacity-0 duration-300 group-hover:opacity-100 absolute z-10 bottom-0 left-0 text-foreground bg-background px-2 py-1 text-xs sm:text-sm rounded-tr-xl">
        {course.title}
      </span>
      <Image
        width={280}
        height={200}
        src={course.image}
        alt={course.title}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export const CourseMarquee = () => {
  return (
    <section className="w-full max-w-full flex flex-col items-center justify-center gap-4 py-6 sm:py-8 overflow-x-hidden">
      <div className="w-full max-w-[100vw] overflow-hidden">
        <Marquee
          pauseOnClick={true}
          className="rotate-[-1deg]"
          speed={25}
          gradient={true}
          gradientWidth={50}
        >
          {courses.map((item, index) => (
            <CourseImage course={item} key={index} />
          ))}
        </Marquee>
      </div>
      <div className="w-full max-w-[100vw] overflow-hidden">
        <Marquee
          pauseOnClick={true}
          className="rotate-[1deg]"
          gradient={true}
          gradientWidth={50}
          speed={25}
          direction="right"
        >
          {courses2.map((item, index) => (
            <CourseImage course={item} key={index} />
          ))}
        </Marquee>
      </div>
    </section>
  );
};
