"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { NavigationMenuDemo } from "./NavMenuItems";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SearchInput } from "./search-input";
import { useRole } from "@/hooks/use-role";
import Image from "next/image";
import Link from "next/link";
import DarkName from "../../../public/assets/logos/dark-name.svg";
import LightName from "../../../public/assets/logos/light-name.svg";
import DarkHLogoName from "../../../public/assets/logos/dark-h-logo-with-name.svg";
import LightHLogoName from "../../../public/assets/logos/light-h-logo-with-name.svg";
import { useSession } from "next-auth/react";

const Navbar = ({ isMobile }: { isMobile: boolean }) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const router = useRouter();
  const { status, role } = useRole();
  const { data: session } = useSession();

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
      <div className={`w-full flex justify-between items-center`}>
        {!isMobile && (
          <div className="flex justify-start items-center gap-x-4">
            <Link href="/" legacyBehavior passHref>
              {theme === "dark" ? (
                <Image alt="logo" src={DarkHLogoName} height={50} />
              ) : (
                <Image alt="logo" src={LightHLogoName} height={50} />
              )}
            </Link>
          </div>
        )}
        {isSearchPage && (
          <>
            <div className="hidden md:block">
              <SearchInput />
            </div>
          </>
        )}
        <div>
          {!isMobile ? (
            <div>
              <NavigationMenuDemo />
            </div>
          ) : (
            <Link href="/" legacyBehavior passHref>
              {theme === "dark" ? (
                <Image alt="name" src={DarkName} height={40} />
              ) : (
                <Image alt="name" src={LightName} height={40} />
              )}
            </Link>
          )}
        </div>
        <div className="flex justify-center items-center">
          {theme === "dark" ? (
            <Button variant={"outline"} onClick={() => setTheme("light")}>
              <Sun />
            </Button>
          ) : (
            <Button variant={"outline"} onClick={() => setTheme("dark")}>
              <Moon />
            </Button>
          )}
          {status === "unauthenticated" ? (
            <Button
              onClick={() => router.push("/account/login")}
              className="ms-2"
            >
              Login
            </Button>
          ) : (
            status === "authenticated" &&
            role === "STUDENT" && (
              <img
                src={session?.user?.avatar}
                className="rounded-full cursor-pointer ms-2"
                height={50}
                width={50}
                onClick={() => router.push("/profile")}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
