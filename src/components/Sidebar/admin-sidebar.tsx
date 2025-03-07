"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  CreditCard,
  LogOut,
  User,
  BookAudioIcon,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Image from "next/image";
import DarkLogo from "../../../public/assets/logos/dark-logo.svg";
import LightLogo from "../../../public/assets/logos/light-logo.svg";
import DarkName from "../../../public/assets/logos/dark-name.svg";
import LightName from "../../../public/assets/logos/light-name.svg";
import { useTheme } from "next-themes";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: BookAudioIcon, label: "Courses", href: "/admin/courses" },
  { icon: BookOpen, label: "Payment", href: "/admin/payment" },
  { icon: ShieldCheck, label: "Certificates", href: "/admin/certificate" },
  { icon: UsersIcon, label: "Users", href: "/admin/user" },
  // { icon: CreditCard, label: "Payment", href: "/admin/payment" },
  { icon: User, label: "Profile", href: "/admin/profile" },
];

export function AdminSidebar({
  collapsible,
}: {
  collapsible?: "icon" | "none";
}) {
  const { setOpen, isMobile } = useSidebar();
  const { theme } = useTheme();
  const [isHovering, setIsHovering] = React.useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovering(true);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      setOpen(false);
    }, 300); // Delay closing to prevent accidental closures
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/account/login" });
  };

  React.useEffect(() => {
    setIsHovering(false);
    setOpen(false);
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible={collapsible}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="transition-all duration-300 ease-in"
      >
        <SidebarHeader className="p-2 min-h-16 flex items-center justify-center">
          {" "}
          <Link href="/" legacyBehavior passHref>
            <>
              {!isHovering && !isMobile ? (
                <>
                  {theme === "dark" ? (
                    <Image alt="logo" src={DarkLogo} width={50} />
                  ) : (
                    <Image alt="logo" src={LightLogo} width={50} />
                  )}
                </>
              ) : (
                <>
                  {theme === "dark" ? (
                    <Image alt="logo" src={DarkName} width={150} />
                  ) : (
                    <Image alt="logo" src={LightName} width={150} />
                  )}
                </>
              )}
            </>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      variant="outline"
                      className="w-full justify-start gap-4 p-4 my-1"
                    >
                      <a href={item.href} className="flex items-center">
                        <item.icon className="h-5 w-5 shrink-0" />
                        <span
                          className={`${
                            isHovering ? "opacity-100" : "opacity-100"
                          } transition-opacity duration-300 ease-in-out`}
                        >
                          {item.label}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <Button className="bg-red-500 font-semibold" onClick={handleLogout}>
            {!isHovering && !isMobile ? <LogOut /> : "Logout"}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
