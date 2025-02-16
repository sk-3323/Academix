import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerification } from "@/helpers/sendVerificationMail";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { hashPassword } from "@/lib/fileHandler";
import { User } from "../../../../../types/User";

export const POST = apiHandler(async (request: NextRequest) => {
  // Parse and validate the request body
  console.log(request.body, "reerer");

  const body: User = await request.json();
  console.log(body, "body");

  const { username, email, password, confirmPassword, phone } = body;

  // Check if passwords match
  if (password !== confirmPassword) {
    throw new ErrorHandler("Passwords do not match.", 400);
  }
  // Check if the user already exists
  const existingUserVerifiedByUsername = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (existingUserVerifiedByUsername) {
    throw new ErrorHandler("User already verified.", 400);
  }

  const existUserByEmail = await prisma.user.findUnique({
    where: { email: email },
  });

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (existUserByEmail) {
    if (existUserByEmail.isVerified) {
      throw new ErrorHandler("User already exist with this email.", 400);
    } else {
      const hashedPassword = await hashPassword(password);
      const verifyExpiryDate = new Date(Date.now() + 120000);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: verifyExpiryDate,
        },
      });
    }
  } else {
    const hashedPassword = await hashPassword(password);
    const verifyExpiryDate = new Date();
    verifyExpiryDate.setHours(verifyExpiryDate.getMinutes() + 2);

    const createdUser = await prisma.user.create({
      data: {
        email,
        username: username,
        password: hashedPassword,
        phone: phone,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: verifyExpiryDate,
      },
    });
  }

  const emailResponse = await sendEmailVerification(
    email,
    username,
    verifyCode
  );

  console.log("emailResponse :>>", emailResponse);

  if (!emailResponse.status) {
    throw new ErrorHandler(emailResponse.message, 500);
  }

  const userId = await prisma.user.findUnique({
    where: { email },
  });

  return NextResponse.json(
    {
      status: true,
      data: userId?.id,
      message: "User Registered Successfully ,Please Verify Your Email",
    },
    {
      status: 200,
    }
  );
});
