import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "../icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CourseProgress } from "@/components/Course/course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  chaptersLength: number;
  price: number;
  isFree: boolean;
  progress: number | null;
  category: string;
  instructor: any;
}
export const CourseCard = ({
  id,
  title,
  thumbnail,
  chaptersLength,
  price,
  isFree,
  progress,
  category,
  instructor,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group bg-slate-200 dark:bg-gray-700 hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={thumbnail} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-sm text-muted-foreground ">{category}</p>
          <div className="flex items-center gap-x-2 mt-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={instructor.avatar} alt={instructor.username} />
              <AvatarFallback>{instructor.username}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              Created By {instructor.username}
            </p>
          </div>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-sm">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              value={progress}
            />
          ) : (
            <p className="text-lg md:text-md font-medium">
              {isFree ? "Free" : formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
