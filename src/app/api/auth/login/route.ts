import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ErrorHandler } from "@/lib/errorHandler";
import { verifyPassword } from "@/lib/fileHandler";
interface User {
  username: string;
  password: string;
  phone: number;
  confirmPassword: string;
  email: string;
  id: string;
  role: number;
  avatar: string;
}
export const POST = apiHandler(async (req: NextRequest) => {
  const { username, password } = await req.json();

  // Check if the user exists
  if (username == "" && password == "") {
    throw new ErrorHandler("Please fill in all fields.", 400);
  }

  var existUser = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!existUser) {
    var existUser = await prisma.user.findUnique({
      where: {
        email: username,
      },
    });
  }

  if (!existUser) {
    throw new ErrorHandler("User does not exist. Please sign up.", 400);
  }

  // Compare passwords
  const passwordMatch = await verifyPassword(password, existUser.password);

  if (!passwordMatch) {
    throw new ErrorHandler("Password is incorrect.", 400);
  }

  // User authenticated successfully
  return NextResponse.json(
    {
      message: "Login successful",
      user: {
        email: existUser.email,
        name: existUser.username,
        // Add any other user data you want to return
      },
    },
    {
      status: 200,
    }
  );
});
