"use client";
import { Button } from "@/components/ui/button";
import { avatarDecorations } from "@/config/avatar-decorations";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export const UserCard = () => {
  const xp = 1;
  function getHundreds(number: number) {
    return Math.floor(number / 100) * 100;
  }
  function removeHundreds(number: number): number {
    return number % 100;
  }
  function calculateProgress(currentValue: number, totalValue: number) {
    return Math.round((currentValue / totalValue) * 100);
  }

  const image = "";
  const [groupName, indexString] = image.split("-");
  const index = Number(indexString);
  const matchingDecoration = avatarDecorations.find(
    (decoration) => decoration.title === groupName
  );
  let imageURL = "";
  if (matchingDecoration) {
    imageURL = matchingDecoration.images[index];
  }

  return (
    <div className="bg-slate-100 dark:bg-gray-800 border-b gap-6 xl:gap-0 flex flex-col xl:flex-row p-6">
      <div className="flex gap-6 items-center flex-1">
        <Image
          height={300}
          width={300}
          src={`https://ui-avatars.com/api/?name=Rishi+Gaywala&background=random`}
          alt="logo"
          className="h-10 sm:h-24 lg:h-28 w-10 sm:w-24 lg:w-28 rounded-full"
        />

        <div className="flex flex-col gap-4 w-full pr-6">
          <h1 className="font-bold sm:text-xl lg:text-3xl">Rishi Gaiwala</h1>
          <div className="flex flex-col gap-1">
            <div className="h-2 rounded-full w-full bg-primary/25">
              <div
                className="h-2 rounded-full bg-primary"
                style={{
                  width: `${calculateProgress(removeHundreds(xp), 100)}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <button>{`${xp} `}XP</button>
              <span className="text-muted-foreground">
                {getHundreds(xp) + 100} XP
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center flex-1">
        <Button
          variant={"ghost"}
          className="hover:bg-[#a1a1aa] w-full rounded-xl p-6 bg-transparent border-2 border-gray-400 flex justify-between hover:!scale-[1.01]"
        >
          <span>Earn 10 XP for watching one chapter</span>
          <ArrowRight className="hidden sm:block" />
        </Button>
        <Button
          variant={"ghost"}
          className="hover:bg-[#a1a1aa] w-full rounded-xl p-6 bg-transparent border-2 border-gray-400 flex justify-between hover:!scale-[1.01] animate-pulse cursor-not-allowed"
          disabled
        >
          <span>Earn 50 XP for solving a Quiz </span>
          <ArrowRight className="hidden sm:block" />
        </Button>
      </div>
    </div>
  );
};
