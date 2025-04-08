"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCategoryApi } from "@/store/category/slice";
import type { AppDispatch } from "@/store/store";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Course } from "../../../../types/allType";
import { motion, AnimatePresence } from "framer-motion";

// Custom Tab Button Component
const TabButton = ({
  category,
  isActive,
  onClick,
  availableCourseCount,
}: {
  category: any;
  isActive: boolean;
  onClick: () => void;
  availableCourseCount: number;
}) => (
  <motion.button
    onClick={onClick}
    className={`relative px-6 py-3 rounded-t-lg font-medium transition-all duration-300 `}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {category.name}
    <span className="ml-2 text-xs bg-primary/10 px-2 py-1 rounded-full">
      {availableCourseCount}
    </span>
    {isActive && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
        layoutId="activeTab"
        initial={false}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </motion.button>
);

// Custom Course Card Component
const CourseCard = ({ course }: { course: Course }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Link
      href={`/course/${course.id}`}
      className="group bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        {course.isFree ? (
          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
            Free
          </Badge>
        ) : (
          <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/80">
            ₹ {course.price}
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
          {course.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <Badge variant="outline" className="text-xs">
            {course.level}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(course.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

const ExploreCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { singleData: userData } = useSelector((state: any) => state.UserStore);
  const { data: categories } = useSelector((state: any) => state.CategoryStore);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get user's enrolled course IDs
  const enrolledCourseIds =
    userData?.enrollments?.map((enrollment: any) => enrollment.courseId) || [];

  useEffect(() => {
    dispatch(GetCategoryApi());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Filter function to exclude enrolled courses
  const getAvailableCourses = (courses: Course[]) => {
    return courses.filter(
      (course: Course) =>
        course.status === "PUBLISHED" && !enrolledCourseIds.includes(course.id)
    );
  };

  // Get count of available courses for a category
  const getAvailableCourseCount = (category: any) => {
    return getAvailableCourses(category.course).length;
  };

  return (
    <div className="container mx-auto py-12 px-4 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary text-[#27e0b3] bg-clip-text"
      >
        Discover New Courses
      </motion.h1>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-background pb-2">
        <div className="flex gap-2 border-b">
          <AnimatePresence>
            {categories
              .filter((category: any) => category.course.length > 0)
              .map((category: any) => (
                <TabButton
                  key={category.id}
                  category={category}
                  isActive={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                  availableCourseCount={getAvailableCourseCount(category)}
                />
              ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Course Content */}
      <AnimatePresence mode="wait">
        {categories
          .filter((category: any) => category.course.length > 0)
          .map(
            (category: any) =>
              activeCategory === category.id && (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getAvailableCourses(category.course).map(
                      (course: Course) => (
                        <CourseCard key={course.id} course={course} />
                      )
                    )}
                  </div>

                  {getAvailableCourses(category.course).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 space-y-4"
                    >
                      <p className="text-muted-foreground">
                        {enrolledCourseIds.length > 0
                          ? "You've enrolled in all available courses in this category!"
                          : "No published courses in this category."}
                      </p>
                      {enrolledCourseIds.length > 0 && (
                        <Link
                          href="/classroom"
                          className="text-primary hover:underline inline-block"
                        >
                          View your enrolled courses
                        </Link>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )
          )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreCourses;
