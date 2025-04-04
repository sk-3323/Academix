import { sendEmailVerification } from "@/helpers/sendVerificationMail";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface verify {
  email: string;
  otp: string;
}

export const POST = apiHandler(async (request: NextRequest) => {
  const { email: id, otp } = await request.json();

  // Verify the OTP and update the user's account status
  

  const userExistByEmail = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!userExistByEmail) {
    throw new ErrorHandler("User not found", 400);
  }

  if (userExistByEmail.verifyCode != otp) {
    throw new ErrorHandler("Invalid OTP", 400);
  }

  const currentTime = new Date();
  if (
    !userExistByEmail.verifyCodeExpiry ||
    userExistByEmail.verifyCodeExpiry < currentTime
  ) {
    throw new ErrorHandler("OTP has expired", 400);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isVerified: true,
      verifyCode: null,
      verifyCodeExpiry: null,
    },
  });
  return NextResponse.json(
    {
      status: true,
      message: "Email verified successfully",
      result: {
        id: updatedUser.id,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
    },
    { status: 200 }
  );
});

//for resend otp
export const PUT = apiHandler(async (request: NextRequest) => {
  const { id } = await request.json();
  const userExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!userExist) {
    throw new ErrorHandler("UserId not found", 400);
  }
  const currentTime = new Date();
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const verifyExpiryDate = new Date(currentTime.getTime() + 120000);
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      verifyCode: verifyCode,
      verifyCodeExpiry: verifyExpiryDate,
    },
  });
  await sendEmailVerification(userExist.email, userExist.username, verifyCode);
  return NextResponse.json(
    {
      status: true,
      message: "Verification code has been sent again",
      result: {
        id: userExist.id,
        email: userExist.email,
      },
    },
    {
      status: 200,
    }
  );
});
