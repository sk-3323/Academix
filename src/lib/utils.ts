// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formDataToJsonWithoutFiles(formData: FormData): any {
  const obj: any = {};

  formData.forEach((value, key) => {
    // Skip fields where the value is a File (file input)
    if (value instanceof File) {
      return;
    }

    obj[key] = value;
  });

  return obj;
}
