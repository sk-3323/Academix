"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { NavigationMenuDemo } from "./NavMenuItems";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchInput } from "./search-input";
import { useRole } from "@/hooks/useRole";
import Image from "next/image";
import Link from "next/link";
import DarkLogo from "../../../public/assets/logos/dark-logo.svg";
import LightLogo from "../../../public/assets/logos/light-logo.svg";
import DarkName from "../../../public/assets/logos/dark-name.svg";
import LightName from "../../../public/assets/logos/light-name.svg";
import DarkHLogoName from "../../../public/assets/logos/dark-h-logo-with-name.svg";
import LightHLogoName from "../../../public/assets/logos/light-h-logo-with-name.svg";

const Navbar = ({ isMobile }: { isMobile: boolean }) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const router = useRouter();
  const { status } = useRole();
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
              <Image alt="logo" src={DarkHLogoName} />
            ) : (
              <Image alt="logo" src={LightHLogoName} />
            )}
          </Link>
        </div>
        {!isMobile && (
          <div>
            <NavigationMenuDemo />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex justify-start items-center gap-x-4">
        {!isMobile ? (
          <Link href="/" legacyBehavior passHref>
            {theme === "dark" ? (
              <Image alt="logo" src={DarkHLogoName} />
            ) : (
              <Image alt="logo" src={LightHLogoName} />
            )}
          </Link>
        ) : (
          <Link href="/" legacyBehavior passHref>
            {theme === "dark" ? (
              <Image alt="logo" src={DarkLogo} />
            ) : (
              <Image alt="logo" src={LightLogo} />
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
        <div>
          <NavigationMenuDemo />
        </div>
      ) : (
        <Link href="/" legacyBehavior passHref>
          {theme === "dark" ? (
            <Image alt="name" src={DarkName} />
          ) : (
            <Image alt="name" src={LightName} />
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
        {status === "unauthenticated" && (
          <Button
            onClick={() => router.push("/account/login")}
            className="ms-2"
          >
            Login
          </Button>
        )}
      </div>
    </>
  );
};

export default Navbar;
