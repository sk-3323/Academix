import { apiHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
// model Certificate {
//     id               String    @id @default(auto()) @map("_id") @db.ObjectId
//     issueDate        DateTime? @default(now())
//     certificateId String?   @unique

//     // Relations
//     userId   String @db.ObjectId
//     user     User   @relation(fields: [userId], references: [id])
//     courseId String @db.ObjectId
//     course   Course @relation(fields: [courseId], references: [id], onDelete: Cascade)

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }
export const POST = apiHandler(async (req: NextRequest, content: any) => {
  const data = req.json();
  let result = await prisma.$transaction(async (tx) => {
    return await tx.certificate.create({
      data: {
        certificateId: data.certificateId,
        userId: data.userId,
        courseId: data.courseId,
      },
    });
  });
});
