"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
  disabled: boolean;
}

export const FileUpload = ({
  onChange,
  endpoint,
  disabled,
}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      disabled={disabled}
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
};
