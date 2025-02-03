import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiHandler, ErrorHandler } from "./lib/errorHandler";

export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export const middleware = apiHandler(async (request: NextRequest) => {
  try {
    // Check if the request is for an API route
    const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
    const isAuthPage =
      request.nextUrl.pathname.endsWith("/login") ||
      request.nextUrl.pathname.endsWith("/signup");

    // Handle page routes
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      raw: true,
    });

    if (isApiRoute && !isAuthPage) {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ErrorHandler("Missing or invalid Bearer token", 401);
      }

      let providedToken = authHeader.split(" ")[1];

      if (!token || token !== providedToken) {
        throw new ErrorHandler("Invalid token", 401);
      }
    }

    if (isAuthPage) {
      if (token) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }

    return NextResponse.next();
  } catch (error: any) {
    throw error;
  }
});

export const config = {
  matcher: [
    "/",
    "/account/login",
    "/account/signup",
    "/protected/:path*",
    "/api/:path*",
  ],
};
