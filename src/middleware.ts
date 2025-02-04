import { NextRequest, NextResponse } from "next/server";
import { decode, getToken } from "next-auth/jwt";
import { apiHandler, ErrorHandler } from "./lib/errorHandler";
import { getServerSession } from "next-auth";
// import { authOption } from "./lib/auth";

export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export const middleware = apiHandler(async (request: any) => {
  // const token = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  //   // raw: true,
  // });

  // console.log("token :>> ", token);

  // if (token) {
  //   let session = await decode({
  //     token: token,
  //     secret: process.env.NEXTAUTH_SECRET as string,
  //   });

  //   console.log("session :>> ", session);
  // }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/account/login", "/account/signup", "/api/:path*"],
};
