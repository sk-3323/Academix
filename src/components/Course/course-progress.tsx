import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import React from "react";

interface CourseProgressProps {
  value: number;
  size: "default" | "sm";
  variant: "default" | "success";
}

const colorByVariant = {
  default: "",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  success: "text-xs",
};

export const CourseProgress = ({
  value,
  size,
  variant,
}: CourseProgressProps) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />
      <p
        className={cn(
          "font-medium mt-1",
          colorByVariant[variant || "default"],
          sizeByVariant[variant || "default"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
