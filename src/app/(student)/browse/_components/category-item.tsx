"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { IconType } from "react-icons/lib";
import qs from "query-string";

interface CategoryItemProps {
  label: string;
  icon?: IconType;
  value?: string;
}

const CategoryItem = ({ label, icon: Icon, value }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle || undefined,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "py-2 px-3 text-sm border border-slate-800/50 dark:border-slate-200/80 rounded-full flex items-center gap-x-1 transition",
        isSelected &&
          "bg-gray-600 hover:bg-gray-600/90 dark:bg-slate-200 text-white dark:text-gray-600 border-transparent font-semibold dark:hover:bg-slate-200/90"
      )}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </Button>
  );
};

export default CategoryItem;
