"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SearchInput } from "./search-input";
import Image from "next/image";
import Link from "next/link";
import DarkHLogoName from "../../../public/assets/logos/dark-h-logo-with-name.svg";
import LightHLogoName from "../../../public/assets/logos/light-h-logo-with-name.svg";
import DarkName from "../../../public/assets/logos/dark-name.svg";
import LightName from "../../../public/assets/logos/light-name.svg";
import DarkLogo from "../../../public/assets/logos/dark-logo.svg";
import LightLogo from "../../../public/assets/logos/light-logo.svg";

const TeacherNavbar = ({ isMobile }: { isMobile: boolean }) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  // Only render theme toggle after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme toggle until mounted
  if (!mounted) {
    return (
      <>
        <div>
          <Link href="/" legacyBehavior passHref>
            {theme === "dark" ? (
              <Image alt="logo" src={DarkHLogoName} height={50} />
            ) : (
              <Image alt="logo" src={LightHLogoName} height={50} />
            )}
          </Link>
        </div>
        {!isMobile && <div>Teacher Dashboard</div>}
      </>
    );
  }

  return (
    <>
      <div className="flex justify-start items-center gap-x-4">
        {!isMobile && (
          <Link href="/" legacyBehavior passHref>
            {theme === "dark" ? (
              <Image alt="logo" src={DarkHLogoName} height={50} />
            ) : (
              <Image alt="logo" src={LightHLogoName} height={50} />
            )}
          </Link>
        )}
        {isSearchPage && (
          <>
            <div className="hidden md:block">
              <SearchInput />
            </div>
          </>
        )}
      </div>
      {!isMobile ? (
        <div>Teacher Dashboard</div>
      ) : (
        <Link href="/" legacyBehavior passHref>
          {theme === "dark" ? (
            <Image alt="name" src={DarkName} height={50} />
          ) : (
            <Image alt="name" src={LightName} height={50} />
          )}
        </Link>
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

export default TeacherNavbar;
