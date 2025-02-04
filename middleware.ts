import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // throw new Error("미들웨어 실행되지만, 일부러 에러를 발생시켜 본다.");

  console.log("미들웨어 실행됨");

  // const accessToken = request.cookies.get("accessToken")?.value;
  // const refreshToken = request.cookies.get("refreshToken")?.value;

  // console.log("accessToken: ", accessToken || "없음");
  // console.log("refreshToken: ", refreshToken || "없음");

  // if (!accessToken && !refreshToken && request.nextUrl.pathname !== "/login") {
  //   // return NextResponse.redirect(new URL("/login", request.url));
  // }

  // // const validateResponse = await validateToken(accessToken, refreshToken);

  return NextResponse.next();
}

const validateToken = async (
  accessToken: string | undefined,
  refreshToken: string | undefined,
) => {
  const BASE_URL = `${process.env.NEXT_PUBLIC_BACK_URL}/auth/validateToken`;

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
      return { isValid: false };
    }
    return { isValid: true };
  } catch (error) {
    console.error("Error during token validation or refresh:", error);
    return { isValid: false };
  }
};
/* 미들웨어 경로 설정해야 함
 */
export const config = {
  matcher: ["/login"],
};
