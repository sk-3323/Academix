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

          {/* {isTabShow && (
            <div className="py-2 sm:w-full md:w-auto">
              <Tabs defaultValue="invoice-list" className="w-full">
                <TabsList className="bg-transparent border-none">
                  <TabsTrigger
                    value="invoice-list"
                    className="text-white hover:text-white data-[state=active]:bg-white/10"
                  >
                    Invoice List
                  </TabsTrigger>
                  <TabsTrigger
                    value="simple-invoice"
                    className="text-white hover:text-white data-[state=active]:bg-white/10"
                  >
                    Simple Invoice
                  </TabsTrigger>
                  <TabsTrigger
                    value="email-invoice"
                    className="text-white hover:text-white data-[state=active]:bg-white/10"
                  >
                    Email Invoice
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )} */}

          {renderRight && <div className="ml-auto">{renderRight()}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
