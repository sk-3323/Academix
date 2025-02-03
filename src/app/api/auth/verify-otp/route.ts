import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface verify {
  email: string;
  otp: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const { email: id, otp } = await req.json();
    console.log(id, otp, "backckck");

    // Verify the OTP and update the user's account status
    const userExistByEmail = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!userExistByEmail) {
      return NextResponse.json({
        message: "User not found",
      });
    }

    if (userExistByEmail.verifyCode != otp) {
      return NextResponse.json({
        message: "Invalid OTP",
      });
    }

    const currentTime = new Date();
    if (
      !userExistByEmail.verifyCodeExpiry ||
      userExistByEmail.verifyCodeExpiry < currentTime
    ) {
      return NextResponse.json({
        message: "OTP has expired",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isVerified: true,
        verifyCode: null,
        verifyCodeExpiry: null,
      },
    });
    return NextResponse.json(
      {
        message: "Email verified successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          isVerified: updatedUser.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error verification email", error);
  }
};
