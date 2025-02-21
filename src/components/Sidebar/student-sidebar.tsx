"use client";

import * as React from "react";
import {
  Home,
  Settings,
  Users,
  HelpCircle,
  Menu,
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  CreditCard,
  LogOut,
  User,
  LogIn,
  Info,
  Contact,
  VideoIcon,
  TvMinimalPlay,
  MessageCircleQuestion,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
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

const items = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/student/course" },
  { icon: ShieldCheck, label: "Certificates", href: "/student/certificate" },
  { icon: User, label: "Profile", href: "/student/profile" },
  { icon: CreditCard, label: "Payment", href: "/student/payment" },
  { icon: VideoIcon, label: "Video Lectures", href: "/student/video" },
  { icon: MessageCircleQuestion, label: "Quiz", href: "/student/quiz" },
];

export function StudentSidebar({
  collapsible,
}: {
  collapsible?: "icon" | "none";
}) {
  const { setOpen } = useSidebar();
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
        <SidebarHeader className="p-2">{isHovering && "Sidebar"}</SidebarHeader>
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
          <Button className="bg-red-500 font-semibold">
            {!isHovering ? <LogOut /> : "Logout"}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
