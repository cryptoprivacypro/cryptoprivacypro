import { NextResponse } from "next/server";

export function middleware(req) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (url.pathname.startsWith("/admin")) {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pass] = atob(authValue).split(":");

      if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
        return NextResponse.next();
      }
    }

    return new Response("Auth Required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

