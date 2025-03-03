// import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
// import { prisma } from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";
// import { validateData } from "@/lib/fileHandler";
// import {
//   changeQuestionStatusSchema,
//   checkAnswerSchema,
// } from "@/schema/question/schema";

// export const POST = apiHandler(async (request: NextRequest, content: any) => {
//   let data = await request.json();
//   data = await validateData(checkAnswerSchema, data);

//   let result = await prisma.$transaction(async (tx) => {
//     const questionFound = await tx.question.findUnique({
//       where: {
//         id: data?.questionId,
//       },
//       include: {
//         answer: true,
//       },
//     });

//     if (!questionFound) {
//       throw new ErrorHandler("Question not found", 404);
//     }

//     // return ;
//   });

//   return NextResponse.json(
//     {
//       status: true,
//       message:
//         result?.status === "DRAFT"
//           ? "question has sent to draft"
//           : "question has been published",
//       result,
//     },
//     { status: 200 }
//   );
// });
