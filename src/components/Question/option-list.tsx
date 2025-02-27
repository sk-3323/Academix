"use client";

import { useEffect, useState } from "react";
import { Option } from "@prisma/client";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import {
  BadgeAlert,
  BadgeCheck,
  Grip,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FormDialog, FormDialogSchema } from "../Modals/confirm-modal";

interface OptionListProps {
  items: Option[];
  onReorder: (updatedData: { id: string; order: number }[]) => void;
  onEdit: (id: string, values: FormDialogSchema) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  open: boolean;
  setOpen: any;
}

const OptionList = ({
  items,
  onReorder,
  onEdit,
  onDelete,
  onStatusChange,
  open,
  setOpen,
}: OptionListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [options, setOptions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setOptions(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result?.destination) return;

    const items = Array.from(options);
    const [reorderedItem] = items.splice(result?.source?.index, 1);
    items.splice(result?.destination?.index, 0, reorderedItem);

    const startIndex = Math.min(
      result?.source?.index,
      result?.destination?.index
    );
    const endIndex = Math.max(
      result?.source?.index,
      result?.destination?.index
    );
    const updatedOption = items.slice(startIndex, endIndex + 1);

    setOptions(items);

    const bulkUpdateData: any = updatedOption.map((options) => ({
      id: options?.id,
      order: items.findIndex((item) => item?.id === options?.id) + 1,
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="options">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {options.map((options: any, index: number) => (
              <Draggable
                key={options?.id}
                draggableId={options?.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 dark:bg-gray-700 border-slate-200 dark:border-gray-600 border text-slate-700 dark:text-slate-200 mb-4 text-sm rounded-lg",
                      options?.status === "PUBLISHED" &&
                        "bg-sky-100 dark:bg-sky-900 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-200"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 border-r-slate-300 dark:border-r-gray-600  dark:hover:bg-gray-600 rounded-l-md transition",
                        options?.status === "PUBLISHED" &&
                          "border-r-sky-200 dark:border-r-sky-800 bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-800"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {options?.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {options?.status && (
                        <Badge
                          className={cn(
                            "bg-slate-500 dark:bg-gray-300",
                            options?.status === "PUBLISHED" &&
                              "bg-sky-700 dark:bg-sky-400"
                          )}
                        >
                          {options?.status}
                        </Badge>
                      )}
                      <FormDialog
                        onSubmit={onEdit}
                        optionId={options?.id}
                        initialData={options}
                        open={open}
                        setOpen={setOpen}
                      >
                        <Pencil className="w-4 h-4 mx-1 cursor-pointer hover:opacity-75 transition" />
                      </FormDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-end flex items-center p-0"
                          >
                            <span className="sr-only">Open Menu</span>
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 transition-all duration-200 ease-in-out"
                        >
                          <DropdownMenuItem
                            onClick={() => onDelete(options?.id)}
                            className="transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-gray-700"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          {options?.status === "PUBLISHED" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                onStatusChange(options?.id, "DRAFT")
                              }
                              className="transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                              <BadgeAlert className="w-4 h-4 mr-2" />
                              Mark as Draft
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                onStatusChange(options?.id, "PUBLISHED")
                              }
                              className="transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-gray-700"
                            >
                              <BadgeCheck className="w-4 h-4 mr-2" />
                              Mark as Published
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided?.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default OptionList;
