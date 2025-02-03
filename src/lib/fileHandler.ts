import { pbkdf2Sync, randomBytes } from "crypto";
import { ErrorHandler } from "./errorHandler";
import path from "path";
import { existsSync, unlinkSync, writeFileSync } from "fs";

interface FileUploadResult {
  filePath: string;
  fileName: string;
}

export const formDataToJsonWithoutFiles = (formData: FormData): any => {
  const obj: any = {};

  formData.forEach((value, key) => {
    // Skip fields where the value is a File (file input)
    if (value instanceof File) {
      return;
    }

    obj[key] = value;
  });

  return obj;
};

// Function to handle password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex"); // Generate a random salt
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`; // Store salt and hash together
};

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const hashedPassword = pbkdf2Sync(
    password,
    salt,
    1000,
    64,
    "sha512"
  ).toString("hex");
  return hashedPassword === hash;
}

export const validateData = async (schema: any, data: any) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new ErrorHandler(`Invalid or empty JSON object`, 400);
  } else {
    const valid = await schema.safeParse(data);
    if (!valid.success) {
      const errors = valid.error.errors.map(
        (x: any) => `${x?.path?.[0]}: ${x?.message}`
      );
      throw new ErrorHandler(`Validation errors: ${errors.join(", ")}`, 400);
    }
    return valid.data;
  }
};

export const handleFileUpload = async (
  file: File,
  storePath: string
): Promise<FileUploadResult> => {
  const uniqueFileName = `${Date.now()}-${file.name}`;
  const uploadPath = path.join(
    path.resolve(process.cwd(), storePath),
    uniqueFileName
  );

  const buffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(buffer);
  // Write file asynchronously
  await writeFileSync(uploadPath, fileBuffer);

  return {
    filePath: uploadPath,
    fileName: uniqueFileName,
  };
};

// Function to cleanup uploaded file
export const cleanupUploadedFile = async (filePath: string): Promise<void> => {
  try {
    if (existsSync(filePath)) {
      await unlinkSync(filePath);
    }
  } catch (error: any) {
    console.error("Failed to cleanup uploaded file:", error);
    throw new ErrorHandler(error.message, 500);
  }
};
