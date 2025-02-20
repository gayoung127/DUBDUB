import { NextRequest, NextResponse } from "next/server";

const BACK_URL = "https://i12a801.p.ssafy.io/api";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const prevPage = request.cookies.get("prevPage")?.value;

  if (!accessToken && request.nextUrl.pathname !== "/") {
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

  // ✅ 홈 ("/") 접근 시 토큰 검증 후 "/lobby"로 리디렉션
  if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "") {
    const isValidToken = await validateToken();

    if (isValidToken) {
      console.log("✅ User is logged in, redirecting to /lobby");
      return NextResponse.redirect(new URL("/lobby", request.url));
    } else {
      console.warn("⚠️ User is not logged in, staying on /");
      return NextResponse.next();
    }
  }

  //상세 페이지 접근 금지
  const pathname = request.nextUrl.pathname;
  const match = pathname.match(/^\/lobby\/([^/]+)(?:\/(.*))?$/);

  if (match && !pathname.endsWith("/studio")) {
    const newPath = `/lobby/${match[1]}/studio`;
    console.log(`🔄 Redirecting from ${pathname} to ${newPath}`);
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // ✅ 보호된 페이지 접근 시 토큰 검증
  const isValidToken = await validateToken();
  if (!isValidToken) {
    console.warn("Token is invalid, redirecting to /");

    if (request.nextUrl.pathname === "/") {
      return NextResponse.next();
    }
    const response = NextResponse.redirect(new URL("/", request.url));

    // 이전 페이지 정보를 저장 (선택 사항)
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
  matcher: [
    "/",
    "/lobby",
    "/lobby/create",
    "/lobby/:path*",
    "/lobby/:path*/studio",
  ],
};
