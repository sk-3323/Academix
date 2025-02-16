import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavigationMenuDemo } from "@/components/Navbar/NavMenuItems";
import { Button } from "@/components/ui/button";
import { Chapter, Course, Topic, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "./course-mobile-sidebar";

interface CourseSidebarProps {
  course: Course & { progressCount: number } & {
    chapters: (Chapter & {
      topics: (Topic & {
        userProgress: UserProgress[] | null;
      })[];
    })[];
  };
  isMobile: boolean;
}

const CourseNavbar = ({ course, isMobile }: CourseSidebarProps) => {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

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
        <h1 className="font-extrabold">Acedemix </h1>
      </div>
      {!isMobile && (
        <div>
          <NavigationMenuDemo />
        </div>
      )}
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
