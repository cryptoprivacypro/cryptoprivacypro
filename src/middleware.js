import { NextResponse } from "next/server";

/**
 * Add security headers to every response.
 */
function addSecurityHeaders(response) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  return response;
}

/**
 * Middleware entry point.
 */
export function middleware(req) {
  const url = req.nextUrl;
  const response = NextResponse.next();

  // Add security headers globally
  addSecurityHeaders(response);

  // Debug log to confirm middleware hits
  console.log("MIDDLEWARE HIT:", url.pathname);

  // Apply Basic Auth only to /admin routes
  if (url.pathname.startsWith("/admin")) {
    const basicAuth = req.headers.get("authorization");
    const user = process.env.ADMIN_USER || "admin";
    const pass = process.env.ADMIN_PASS || "admin123";

    if (basicAuth) {
      const [scheme, encoded] = basicAuth.split(" ");
      if (scheme === "Basic") {
        const decoded = Buffer.from(encoded, "base64").toString();
        const [u, p] = decoded.split(":");

        if (u === user && p === pass) {
          return response; // Authentication successful
        }
      }
    }

    return new Response("Auth Required", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic realm="Secure Area"`,
      },
    });
  }

  return response;
}

/**
 * Matcher to include all routes but apply Basic Auth only for /admin paths.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

