"use client";

import { Moon, Sun, Menu, Search } from "lucide-react";
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
import { useSelector } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Navbar = ({ isMobile }: { isMobile: boolean }) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const router = useRouter();
  const { status, role } = useRole();
  const { data: session } = useSession();
  const { singleData: userData } = useSelector((state: any) => state.UserStore);

  const navItems = [
    {
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Courses",
      href: "/course",
      active: pathname === "/course",
    },
    {
      label: "About",
      href: "/about",
      active: pathname === "/about",
    },
    {
      label: "Contact",
      href: "/contact",
      active: pathname === "/contact",
    },
  ];
  const studentNavItems = [
    {
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Courses",
      href: "/course",
      active: pathname === "/course",
    },
    {
      label: "Classroom",
      href: "/classroom",
      active: pathname === "/classroom",
    },
    {
      label: "Code Editor",
      href: "/code-editor",
      active: pathname === "/code-editor",
    },
    {
      label: "About",
      href: "/about",
      active: pathname === "/about",
    },
    {
      label: "Contact",
      href: "/contact",
      active: pathname === "/contact",
    },
  ];
  // Only render theme toggle after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  // Prevent hydration mismatch by not rendering theme toggle until mounted
  if (!mounted) {
    return (
      <div className="w-full flex justify-between items-center p-2 sm:p-4">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <div className="hidden sm:block">
              <Image
                alt="logo"
                src={theme === "dark" ? DarkHLogoName : LightHLogoName}
                height={50}
                priority
              />
            </div>
            <div className="block sm:hidden">
              <Image
                alt="logo"
                src={theme === "dark" ? DarkName : LightName}
                height={40}
                priority
              />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="container flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[240px] sm:w-[300px] flex items-center flex-col "
            >
              <div className="px-2 py-6">
                <Link href="/" className="flex items-center mb-6">
                  <Image
                    alt="logo"
                    src={theme === "dark" ? DarkName : LightName}
                    height={40}
                    priority
                  />
                </Link>
                <div className="mt-4 flex flex-col flex-gap items-start w-full">
                  {role === "STUDENT" && userData?.enrollments?.length > 0
                    ? studentNavItems.map((nav) => (
                        <Link
                          key={nav.label}
                          href={nav.href}
                          className={`w-full py-3 px-4 text-base font-medium transition-colors duration-200 ${
                            nav.active
                              ? "text-gray-900 bg-[#CCFBF1]"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          } border-b border-gray-200 last:border-b-0`}
                          passHref
                        >
                          {nav.label}
                        </Link>
                      ))
                    : navItems.map((nav) => (
                        <Link
                          key={nav.label}
                          href={nav.href}
                          className={`w-full py-3 px-4 text-base font-medium transition-colors duration-200 ${
                            nav.active
                              ? "text-gray-900 bg-[#CCFBF1]"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                          } border-b border-gray-200 last:border-b-0`}
                          passHref
                        >
                          {nav.label}
                        </Link>
                      ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="hidden sm:block">
              <Image
                alt="logo"
                src={theme === "dark" ? DarkHLogoName : LightHLogoName}
                height={50}
                priority
              />
            </div>
            <div className="block sm:hidden">
              <Image
                alt="logo"
                src={theme === "dark" ? DarkName : LightName}
                height={40}
                priority
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className=" lg:flex lg:items-center lg:gap-6">
            <NavigationMenuDemo />
          </div>
        )}

        {/* Right Section: Search, Theme Toggle, User */}
        <div className="flex items-center gap-2">
          {/* Search Button/Input */}
          {/* {isSearchPage ? (
            <div
              className={cn(
                "hidden md:block w-full max-w-sm",
                isSearchOpen &&
                  "absolute left-0 right-0 top-0 z-50 flex h-16 items-center justify-center bg-background px-4 sm:px-6"
              )}
            >
              <SearchInput />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => router.push("/search")}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )} */}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Authentication */}
          {status === "unauthenticated" ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => router.push("/account/signup")}
              >
                Register
              </Button>
              <Button onClick={() => router.push("/account/login")} size="sm">
                Login
              </Button>
            </div>
          ) : (
            status === "authenticated" && (
              <Avatar
                className="h-8 w-8 cursor-pointer transition-transform hover:scale-105"
                onClick={() => router.push("/profile")}
              >
                <AvatarImage src={userData?.avatar} alt="User Avatar" />
                <AvatarFallback>
                  {userData?.username?.substring(0, 2)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            )
          )}
        </div>
      </div>

      {/* Mobile Search Bar (only on search page) */}
      {isSearchPage && (
        <div className="md:hidden border-t px-4 py-3">
          <SearchInput className="w-full" />
        </div>
      )}
    </header>
  );
};

export default Navbar;
