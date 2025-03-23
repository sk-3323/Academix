"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const SearchInput = ({ className }: { className?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");

  // Initialize search input with URL query parameter
  useEffect(() => {
    setValue(searchParams?.get("query") || "");
  }, [searchParams]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value) return;

    router.push(`/search?query=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={onSubmit} className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-9 pr-4 py-2 bg-background"
        placeholder="Search courses..."
      />
    </form>
  );
};
