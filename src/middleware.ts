import { NextRequest, NextResponse } from "next/server";

const BACK_URL = process.env.NEXT_PUBLIC_BACK_URL;
export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (accessToken && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/lobby", request.url));
  }

  if (!accessToken && request.nextUrl.pathname !== "/") {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("prevPage", request.nextUrl.pathname, { path: "/" });
    return response;
  }

  const isValidToken = await validateToken();

  if (!isValidToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("prevPage", request.nextUrl.pathname, { path: "/" });
    return response;
  }

  return NextResponse.next();
}

const validateToken = async (): Promise<boolean> => {
  const BASE_URL = `${BACK_URL}/auth/validate`;

  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error(
        `Token validation failed. HTTP error! status: ${response.status}`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error during token validation: ", error);
    return false;
  }
};

export const config = {
  matcher: ["/lobby/:path*/studio", "/"],
};
