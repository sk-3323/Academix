"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Code2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
];

export const CODE_SNIPPETS = {
  javascript: `// JavaScript Example
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Alex");

// Try modifying this code and run it again
const numbers = [1, 2, 3, 4, 5];
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));`,

  typescript: `// TypeScript Example
type Params = {
  name: string;
}

function greet(data: Params) {
  console.log("Hello, " + data.name + "!");
}

greet({ name: "Alex" });

// Try modifying this code and run it again
const numbers: number[] = [1, 2, 3, 4, 5];
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));`,

  python: `# Python Example
def greet(name):
    print("Hello, " + name + "!")

greet("Alex")

# Try modifying this code and run it again
numbers = [1, 2, 3, 4, 5]
print("Sum:", sum(numbers))`,

  java: `// Java Example
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
        
        // Try modifying this code and run it again
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
}`,

  csharp: `// C# Example
using System;

namespace HelloWorld
{
    class Hello { 
        static void Main(string[] args) {
            Console.WriteLine("Hello World in C#");
            
            // Try modifying this code and run it again
            int[] numbers = {1, 2, 3, 4, 5};
            int sum = 0;
            foreach (int num in numbers) {
                sum += num;
            }
            Console.WriteLine("Sum: " + sum);
        }
    }
}`,

  php: `<?php
// PHP Example
$name = 'Alex';
echo "Hello, " . $name . "!";

// Try modifying this code and run it again
$numbers = [1, 2, 3, 4, 5];
echo "Sum: " . array_sum($numbers);
?>`,
};

export function LanguageSelector({
  language,
  onSelect,
}: {
  language: string;
  onSelect: (language: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center">
            <Code2 className="mr-2 h-4 w-4" />
            {language
              ? languages.find((l) => l.value === language)?.label
              : "Select Language"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      language === lang.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
