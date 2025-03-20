import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavigationMenuDemo } from "@/components/Navbar/NavMenuItems";
import { Button } from "@/components/ui/button";
import {
  Chapter,
  Course,
  Option,
  Question,
  Quiz,
  QuizProgress,
  Topic,
  UserProgress,
} from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import CourseMobileSidebar from "./course-mobile-sidebar";
import DarkHLogoName from "../../../../../../public/assets/logos/dark-h-logo-with-name.svg";
import LightHLogoName from "../../../../../../public/assets/logos/light-h-logo-with-name.svg";

interface CourseSidebarProps {
  course: Course & { progressCount: number } & {
    chapters: (Chapter & {
      topics: (Topic & {
        userProgress: UserProgress[] | null;
      })[];
      quiz: (Quiz & {
        completedBy: QuizProgress[] | null;
        questions: (Question & {
          answer: Option;
          options: Option[];
        })[];
      })[];
    })[];
  };
  isMobile: boolean;
}

const CourseNavbar = ({ course, isMobile }: CourseSidebarProps) => {
  const { setTheme, theme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div className="flex justify-start items-center gap-x-4">
        <CourseMobileSidebar course={course} />
        {!isMobile && (
          <Link href="/" legacyBehavior passHref>
            {theme === "dark" ? (
              <Image alt="logo" src={DarkHLogoName} height={50} />
            ) : (
              <Image alt="logo" src={LightHLogoName} height={50} />
            )}
          </Link>
        )}
      </div>
      {!isMobile && <div>Course Detail </div>}
      <div className="flex justify-center">
        {theme === "dark" ? (
          <Button variant={"outline"} onClick={() => setTheme("light")}>
            <Sun />
          </Button>
        ) : (
          <Button variant={"outline"} onClick={() => setTheme("dark")}>
            <Moon />
          </Button>
        )}
      </div>
    </>
  );
};

export default CourseNavbar;
