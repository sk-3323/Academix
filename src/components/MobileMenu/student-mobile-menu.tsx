"use client";

import React from "react";
import { Menu, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { StudentSidebar } from "../Sidebar/student-sidebar";

const StudentMobileMenu = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu </span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{!open && <MenuIcon />}</SheetTitle>
        </SheetHeader>
        <div className="mt-10">
          <StudentSidebar collapsible="none" />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StudentMobileMenu;
