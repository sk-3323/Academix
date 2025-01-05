"use client";
import { Moon, Sun, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { NavigationMenuDemo } from "./NavMenuItems";

const Navbar = ({ isMobile }: { isMobile: boolean }) => {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <div>
        <h1 className="font-extrabold">Acedemix</h1>
      </div>
      {!isMobile && (
        <div>
          <NavigationMenuDemo />
        </div>
      )}
      <div className="flex justify-center">
        {theme === "dark" ? (
          <Button variant={"outline"} onClick={() => setTheme("light")}>
            <Sun></Sun>
          </Button>
        ) : (
          <Button variant={"outline"} onClick={() => setTheme("dark")}>
            <Moon></Moon>
          </Button>
        )}
      </div>
    </>
  );
};

export default Navbar;
