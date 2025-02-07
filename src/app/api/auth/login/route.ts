import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { validateData, verifyPassword } from "@/lib/fileHandler";
import { encryptToken } from "@/lib/jwtGenerator";
import loginSchema from "@/schema/login/schema";

export const POST = apiHandler(async (req: NextRequest) => {
  let data: any = await req.json();
  data = await validateData(loginSchema, data);

  let result = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: data.username,
        },
        {
          email: data.username,
        },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      phone: true,
      password: true,
      role: true,
    },
  });

  if (!result) {
    throw new ErrorHandler("User does not exist. Please sign up.", 400);
  }

  // Compare passwords
  let { password, ...userData } = result;
  const isVerified = await verifyPassword(data.password, password);

  if (!isVerified) {
    throw new ErrorHandler("Password is incorrect.", 400);
  }

  let payload: any = { ...userData };

  if (payload?.role === "ADMIN") {
    payload.isAdmin = true;
  }

  let token = await encryptToken(userData);

  return NextResponse.json(
    {
      status: true,
      message: "Login successful",
      token: token,
    },
    {
      status: 200,
    }
  );
});
