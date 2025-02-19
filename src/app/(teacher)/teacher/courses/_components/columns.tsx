"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  MoreVertical,
  Pencil,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full flex items-center text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full flex items-center text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      let category = row.getValue("category") as { name: string };
      return <div>{category?.name}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full flex items-center text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      let price: any = row.getValue("price") || 0;
      price = formatPrice(price);
      return <div>{`${price}`}</div>;
    },
  },
  {
    accessorKey: "isFree",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full flex items-center text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Access
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      let isFree: any = row.getValue("isFree") as boolean;
      let txt = isFree ? "Free" : "Paid";
      return (
        <Badge
          className={cn(
            "bg-slate-500 dark:bg-gray-300",
            !isFree && "bg-emerald-700 dark:bg-emerald-400"
          )}
        >
          {txt}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          className="w-full flex items-center text-center"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          {isSorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : isSorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      let status = row.getValue("status") || "DRAFT";
      return (
        <Badge
          className={cn(
            "bg-slate-500 dark:bg-gray-300",
            status === "PUBLISHED" && "bg-sky-700 dark:bg-sky-400"
          )}
        >
          {`${status}`}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-full w-full text-end flex items-end p-0"
            >
              <span className="sr-only">Open Menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
