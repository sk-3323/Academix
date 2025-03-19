"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";

interface FileUploadProps {
  onChange: (url: string, key: string) => void;
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
        onChange(res?.[0]?.url, res?.[0]?.key);
      }}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      }}
    />
  );
};
