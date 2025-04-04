import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { apiHandler, ErrorHandler } from "./lib/errorHandler";
export { default } from "next-auth/middleware";

const publicRoutesRegex =
  /^\/$|^\/(about|contact|api\/home|courses(?:\/.*)?|api\/course(?:\/.*)?|assets\/logos\/light-h-logo-with-name\.svg)$/;

export const middleware = apiHandler(async (request: NextRequest) => {
  const path = request.nextUrl.pathname;

  const isApiRoute = path.startsWith("/api/");
  const isAuthRoute = path.startsWith("/api/auth/");
  const isAccountRoute = path.startsWith("/account/");

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    // raw: true,
  });
  // console.log(token, "tokne");

  if (token) {
    request.headers.set("x-user-token", JSON.stringify(token));
  }

  if (publicRoutesRegex.test(path)) {
    return NextResponse.next({ request: request });
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
    "/((?!favicon.ico|_next/static|_next/image|sitemap.xml|robots.txt|api/uploadthing).*)",
};
