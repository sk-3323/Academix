import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  BookOpen,
  CalendarIcon,
  ListCollapse,
  SquareArrowOutUpRight,
  Users,
} from "lucide-react";
import { Course } from "../../../types/allType";
import { format } from "date-fns";
import { usePathname } from "next/navigation";

export const HoverEffect = ({
  items,
  className,
}: {
  items: Course[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const pathname = usePathname();
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items?.map((item: Course, idx: number) => (
        <div
          key={idx}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover ease-in-out transition-transform hover:scale-105"
                priority
              />
              {item.isFree && (
                <Badge className="absolute right-2 top-2 px-3 bg-[#27e0b3] hover:bg-[#27e0b289]">
                  Free
                </Badge>
              )}
              {/* <Badge
                variant="outline"
                className="absolute left-2 top-2 backdrop-blur-sm"
              >
                {item.level.charAt(0).toUpperCase() +
                  item.level.slice(1).toLowerCase()}
              </Badge> */}
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-normal">
                  {item.category?.name ?? ""}
                </Badge>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  {format(new Date(item.createdAt), "dd-MM-yyyy")}
                </div>
              </div>
              <Link href={`/courses/${item.id}`} className="group">
                <h3 className="line-clamp-1 text-xl font-bold tracking-tight group-hover:text-primary">
                  {item.title}
                </h3>
              </Link>
              <div
                className="line-clamp-2 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: item.description,
                }}
              />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={item.instructor.avatar}
                      alt={item.instructor.username}
                    />
                    <AvatarFallback>
                      {getInitials(item.instructor.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {item.instructor.username}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{item?.chapters?.length} chapters</span>
                </div>
                {item.enrollments && (
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{item?.enrollments?.length} enrolled</span>
                  </div>
                )}
              </div>
              {pathname.startsWith("/my-course") ? (
                <Link
                  href={`/courses/${item.id}`}
                  className="px-4 text-sm py-1 bg-[#27e0b3] hover:scale-105 transition-all ease-in rounded-3xl flex gap-2 items-center"
                >
                  Go to Course <SquareArrowOutUpRight className="h-4" />
                </Link>
              ) : (
                <Link
                  href={`/course/${item.id}`}
                  className="px-4 text-sm py-1 bg-[#27e0b3] hover:scale-105 transition-all ease-in rounded-3xl flex gap-2 items-center"
                >
                  View Course <ListCollapse className="h-4" />
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-black border border-transparent border-black/[0.2] dark:border-white/[0.2] dark:group-hover:border-slate-300 group-hover:border-slate-700 relative z-10",
        className
      )}
    >
      <div className="relative z-20">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardHeader = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("px-4 py-2", className)}>{children}</div>;
};

export const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("px-4 py-2", className)}>{children}</div>;
};

export const CardFooter = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("px-4 py-2", className)}>{children}</div>;
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "dark:text-zinc-100 text-zinc-900 font-bold tracking-wide mt-4",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 dark:text-zinc-400 text-zinc-600 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
