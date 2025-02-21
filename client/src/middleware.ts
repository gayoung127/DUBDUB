import { NextRequest, NextResponse } from "next/server";

const BACK_URL = "https://i12a801.p.ssafy.io/api";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const prevPage = request.cookies.get("prevPage")?.value;
  const pathname = request.nextUrl.pathname;
  if (!accessToken) {
    if (pathname !== "/") {
      console.warn("Access token is missing, redirecting to /");
      const response = NextResponse.redirect(new URL("/", request.url));
      if (!prevPage) {
        response.cookies.set(
          "prevPage",
          decodeURIComponent(request.nextUrl.pathname),
          { maxAge: 60 },
        );
      }
      return response;
    }
    return NextResponse.next();
  }
  const match = pathname.match(/^\/lobby\/([^/]+)(?:\/(.*))?$/);
  if (match && !pathname.endsWith("/studio")) {
    const newPath = `/lobby/${match[1]}/studio`;
    console.log(`🔄 Redirecting from ${pathname} to ${newPath}`);
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  if (pathname === "/") {
    const redirectUrl = new URL("/lobby", request.nextUrl.origin);
    console.log("🚀 Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

// const validateToken = async (): Promise<boolean> => {
//   const BASE_URL = `${BACK_URL}/auth/validate`;

//   try {
//     const response = await fetch(BASE_URL, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       console.error(
//         `Token validation failed. HTTP error! status: ${response.status}`,
//       );
//       return false;
//     }
//     return true;
//   } catch (error) {
//     console.error("Error during token validation: ", error);
//     return false;
//   }
// };

export const config = {
  matcher: ["/", "/lobby", "/create", "/lobby/:path*", "/lobby/:path*/studio"],
};
