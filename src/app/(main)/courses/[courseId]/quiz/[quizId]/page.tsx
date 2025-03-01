"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FlagIcon, Forward } from "lucide-react";
import React from "react";

const QuizIdPage = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <Card className=" border-0 shadow-md flex flex-col">
          <CardHeader className="flex-grow flex flex-col justify-center">
            <CardTitle className="text-3xl font-serif text-center">
              Hollywood What If Quiz
            </CardTitle>
          </CardHeader>

          <CardContent className="flex justify-center px-6">
            <Button className="text-xl py-6 rounded w-full bg-[#27E0B3] hover:bg-[#27e0b2ac]">
              Start
            </Button>
          </CardContent>

          <CardFooter className="flex justify-between items-center pb-6 px-6">
            <div className="text-sm font-medium">15 Questions</div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="timer-mode" className="text-sm font-medium">
                Time Limit : 2.5 minutes
              </Label>
            </div>
          </CardFooter>
        </Card>
      </div>
      {/* <div className="py-[2.5rem]">
        {true ? (
          <div className="space-y-3">
            <div className="flex flex-col gap-6">
              <p className="py-3 px-6 border-2 text-xl font-bold self-end rounded-lg shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)]">
                Question: <span>1</span>/<span className="text-3xl">5</span>{" "}
              </p>
              <h1 className="mt-4 px-10 text-3xl font-bold text-center">
                What is flutter?
              </h1>
            </div>
            <div className="pt-14 space-y-4">
              {[1, 2, 3, 4].map((option, i) => (
                <button
                  className={cn(
                    "relative group py-3 w-full text-center border-2 text-lg font-semibold rounded-lg hover:bg-[rgba(0,0,0,0.03)] transition-all duration-200 ease-in-out",
                    // check selected or not
                    false
                      ? "bg-emerald-100 dark:bg-emerald-500 dark:border-emerald-100 border-emerald-500 dark:shadow-[0_.3rem_0_0_#10b981] shadow-[0_.3rem_0_0_#d1fae5] dark:hover:bg-emerald-500 hover:bg-emerald-100 dark:hover:border-emerald-100 hover:border-emerald-500"
                      : "shadow-[0_.3rem_0_0_rgba(0,0,0,0.1)]"
                  )}
                  key={i}
                >
                  {`Option: ${option}`}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-lg">No questions found for this quiz </p>
        )}
        <div className="w-full py-[4rem] flex items-center justify-center">
          <Button
            className={cn(
              "px-10 py-6 font-bold text-xl rounded-xl transition-all",
              true && "bg-emerald-500 hover:bg-emerald-600"
            )}
          >
            {false ? (
              <span className="flex items-center gap-2">
                {" "}
                <Forward /> Next
              </span>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <FlagIcon className="text-xl" /> Finish
                </span>
              </>
            )}
          </Button>
        </div>
      </div> */}
    </>
  );
};

export default QuizIdPage;
