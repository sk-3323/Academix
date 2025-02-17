"use client";
import { Resource } from "@prisma/client";
import { File } from "lucide-react";
import React from "react";

export const ResourceBar = ({
  resources,
  isLocked,
}: {
  resources: Resource[];
  isLocked: boolean;
}) => {
  return (
    <>
      {!isLocked && (
        <>
          {resources?.map((res: any) => (
            <a
              key={res?.id}
              href={res?.url}
              target="_blank"
              className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
            >
              <File className="w-6 h-6 mr-2" />
              <p className="line-clamp-1">{res?.title}</p>
            </a>
          ))}
        </>
      )}
      {isLocked && (
        <>
          <div className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md">
            <p className="text-sm italic">
              This topic offers {resources?.length}{" "}
              {resources?.length === 1 ? "resource" : "resources"}. Enroll now
              to acces{" "}
            </p>
          </div>
        </>
      )}
    </>
  );
};
