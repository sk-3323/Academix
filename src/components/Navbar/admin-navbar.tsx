"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { NavigationMenuDemo } from "./NavMenuItems";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SearchInput } from "./search-input";

const AdminNavbar = ({ isMobile }: { isMobile: boolean }) => {
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
          <h1 className="font-extrabold">Acedemix </h1>
        </div>
        {!isMobile && <div>Student Dashboard</div>}
      </>
    );
  }

  return (
    <>
      <div className="flex justify-start items-center gap-x-4">
        <h1 className="font-extrabold">Acedemix</h1>
        {isSearchPage && (
          <>
            <div className="hidden md:block">
              <SearchInput />
            </div>
          </>
        )}
      </div>
      {!isMobile && <div>Admin Dashboard</div>}
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

export default AdminNavbar;
