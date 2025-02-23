// components/PageHeader.tsx
import React from "react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  headerTitle: string;
  //   isTabShow?: boolean;
  renderRight?: () => React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  headerTitle,
  //   isTabShow = false,
  renderRight,
  className,
}) => {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="w-full mb-4">
        <div className="flex items-center justify-between flex-wrap ">
          <h3 className="text-2xl font-bold py-3 pb-2">{headerTitle}</h3>

          {renderRight && <div className="ml-auto">{renderRight()}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
