import { decryptToken } from "@/lib/jwtGenerator";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Modify the handleAuth function to accept the correct parameter type
const handleAuth = async (opts: { req: NextRequest }) => {
  const token = await getToken({
    req: opts.req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
  });

  let user = await decryptToken(token);

  if (!user) throw new UploadThingError("Unauthorized");

  return { userId: user.id };
};

export const ourFileRouter = {
  userAvatar: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => await handleAuth({ req }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
  courseThumbnail: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => await handleAuth({ req }))
    .onUploadError(({ error, fileKey }) => {
      console.log("error while Uploading ", error);
      console.log("fileKey", fileKey);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  chapterResources: f(["text", "image", "audio", "video", "pdf"])
    .middleware(async ({ req }) => await handleAuth({ req }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
  topicVideo: f({
    video: {
      maxFileSize: "2GB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => await handleAuth({ req }))
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
