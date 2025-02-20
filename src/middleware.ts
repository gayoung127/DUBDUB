import { NextRequest, NextResponse } from "next/server";

const BACK_URL = process.env.NEXT_PUBLIC_BACK_URL;
export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const prevPage = request.cookies.get("prevPage")?.value;
  const decodedPrevPage = prevPage ? decodeURIComponent(prevPage) : "/";

  // ✅ accessToken이 없으면 바로 "/"로 리디렉션
  if (!accessToken) {
    const response = NextResponse.redirect(new URL("/", request.url));

    if (!request.cookies.get("prevPage")) {
      response.cookies.set(
        "prevPage",
        encodeURIComponent(request.nextUrl.pathname),
        {
          path: "/",
          maxAge: 60,
        },
      );
    }

    return response;
  }

  // ✅ 홈 화면 ("/")에서 accessToken이 있으면 /lobby로 이동 (단, 유효한 경우)
  if (request.nextUrl.pathname === "/") {
    const isValidToken = await validateToken(accessToken);
    if (!isValidToken) {
      return NextResponse.next(); // 토큰이 유효하지 않으면 홈 화면 유지
    }
    return NextResponse.redirect(new URL("/lobby", request.url));
  }

  // ✅ 보호된 페이지 접근 시 토큰 검증
  const isValidToken = await validateToken(accessToken);
  if (!isValidToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(
      "prevPage",
      encodeURIComponent(request.nextUrl.pathname),
      {
        path: "/",
        maxAge: 60,
      },
    );
    return response;
  }

  return NextResponse.next();
}

const validateToken = async (accessToken?: string): Promise<boolean> => {
  const BASE_URL = `${BACK_URL}/auth/validate`;

  try {
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
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
