import { NextRequest, NextResponse } from "next/server";

const BACK_URL = "https://i12a801.p.ssafy.io/api";

export async function middleware(request: NextRequest) {
  console.log("BACK_URL:", BACK_URL); // ✅ 환경 변수 확인

  const accessToken = request.cookies.get("accessToken")?.value;

  const prevPage = request.cookies.get("prevPage")?.value;
  console.log("Stored prevPage:", prevPage); // ✅ 쿠키 값 확인

  const decodedPrevPage = prevPage ? decodeURIComponent(prevPage) : "/";

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

    if (!isValidToken) {
      console.warn("Invalid token, staying on current page.");
      return NextResponse.next(); // ✅ 더 이상 리디렉션하지 않음
    }
    const redirectUrl = new URL("/lobby", request.url);
    console.log("🚀 Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ 보호된 페이지 접근 시 토큰 검증
  const isValidToken = await validateToken();
  if (!isValidToken) {
    console.warn("Token is invalid, staying on current page.");
    return NextResponse.next(); // ✅ 무한 리디렉션 방지
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
  matcher: ["/", "/lobby/:path*/studio", "/lobby", "/lobby/create"],
};
