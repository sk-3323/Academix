import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import openai from "@/lib/openAi";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiHandler(async (req: NextRequest, content: any) => {
  const formData = await req.formData();
  const courseTitle = formData.get("courseTitle");
  if (!courseTitle) {
    throw new ErrorHandler("Invalid course title", 400);
  }

  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [
      {
        role: "user",
        content: `Give me short description about 50 words related to ${courseTitle}`,
      }, // The user's prompt
    ],
    max_tokens: 150,
    temperature: 0.7,
  });
  const result = response.choices[0].message.content;

  return NextResponse.json({
    message: "Description Fetched Successfully.",
    result: result,
    success: true,
  });
});
