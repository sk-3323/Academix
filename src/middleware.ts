import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiHandler, ErrorHandler } from "./lib/errorHandler";

export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export const middleware = apiHandler(async (request: NextRequest) => {
  let path = request.nextUrl.pathname;
  const isApiRoute = path.startsWith("/api/");
  const isAuthRoute = path.startsWith("/api/auth/");
  const isAccountRoute = path.startsWith("/account/");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
  });

  if (token) {
    request.headers.set("x-user-token", token);
  }

  if (!token) {
    if (isApiRoute) {
      if (isAuthRoute)
        return NextResponse.next({
          request: request,
        });
      throw new ErrorHandler("Unauthorized : empty token.", 401);
    }
    if (isAccountRoute)
      return NextResponse.next({
        request: request,
      });
    return NextResponse.redirect(new URL("/account/login", request.nextUrl));
  }

  if (isApiRoute)
    return NextResponse.next({
      request: request,
    });
  if (isAccountRoute)
    return NextResponse.redirect(new URL("/", request.nextUrl));

  return NextResponse.next({
    request: request,
  });
});

export const config = {
  matcher:
    "/((?!favicon.ico|_next/static|_next/image|sitemap.xml|robots.txt).*)",
};
