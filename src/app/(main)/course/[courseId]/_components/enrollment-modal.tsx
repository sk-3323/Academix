"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, BookOpen, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CourseEnrollButton } from "./course-enroll-button";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: any;
  courseId: string;
  setActions: (actions: any) => void;
}

export const EnrollmentModal = ({
  isOpen,
  onClose,
  course,
  courseId,
  setActions,
}: EnrollmentModalProps) => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {showLogin ? "Sign in to continue" : "Unlock Course Content"}
          </DialogTitle>
          <DialogDescription>
            {showLogin
              ? "Sign in to your account to access this course"
              : "Enroll in this course to access all learning materials"}
          </DialogDescription>
        </DialogHeader>

        {!showLogin ? (
          <>
            <div className="flex flex-col items-center py-4">
              <div className="relative h-32 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Lock className="h-10 w-10 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-center mb-2">
                {course.title}
              </h3>

              <div className="w-full space-y-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>
                    {course.chapters?.filter(
                      (ch: any) => ch.status === "PUBLISHED"
                    ).length || 0}{" "}
                    chapters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Certificate upon completion</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <CourseEnrollButton
                courseId={courseId}
                isFree={course?.isFree}
                price={course?.price}
                setActions={setActions}
                onSuccess={onClose}
                className="w-full"
              />
              <Button
                variant="outline"
                onClick={handleLoginClick}
                className="w-full"
              >
                Already enrolled? Sign in
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center py-4">
            <p className="text-center mb-4">
              Sign in to your account to access all course materials and track
              your progress.
            </p>
            <div className="flex flex-col w-full gap-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/register">Create an account</Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
