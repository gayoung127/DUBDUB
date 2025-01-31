import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // const validateResponse = await validateToken(accessToken, refreshToken);

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
  matcher: ["/:path*"],
};
