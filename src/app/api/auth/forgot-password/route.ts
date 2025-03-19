import { NODE_APP_URL } from "@/constants/config";
import { sendResetPasswordLink } from "@/helpers/resetPasswordMail";
import { sendEmailVerification } from "@/helpers/sendVerificationMail";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiHandler(async (req: NextRequest, content: any) => {
  let email = await req.json();
  console.log(email);

  let result = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!result) {
    throw new ErrorHandler("User not found", 404);
  }
  const link = `${NODE_APP_URL}/account/reset-password/${result.id}`;
  const emailRes = await sendResetPasswordLink(email, result.username, link);
  console.log(emailRes, "result");

  return NextResponse.json({
    status: true,
    message: "User Fetched...",
    result,
  });
});

export const PUT = apiHandler(async (req: NextRequest, content: any) => {
  let data = await req.json();
  console.log(req, "dataaaa");
  return NextResponse.json({
    status: true,
    message: "User Updated...",
    result: data,
  });
});
