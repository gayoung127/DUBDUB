import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;

  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Missing `code` parameter" },
        { status: 400 },
      );
    }

    // 카카오 로그인 요청
    const response = await fetch(`${BASE_URL}?code=${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed:", errorData); // ❌ 오류 출력
      return NextResponse.json(
        { error: "Login failed", details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();

    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      const cookieStore = cookies();

      // 여러 쿠키가 있을 경우 각각 처리
      const cookieList = setCookieHeader.split(", ");
      for (const cookieString of cookieList) {
        const [cookiePart] = cookieString.split(";");
        const [name, value] = cookiePart.split("=");

        if (name && value) {
          let maxAge = undefined;

          if (name.trim() === "refreshToken") {
            maxAge = 604800;
          }

          // 쿠키 설정
          (await cookieStore).set(name.trim(), value.trim(), {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
            maxAge,
          });
        }
      }
    }

    return NextResponse.json({ memberId: data.memberId });
  } catch (error) {
    console.error("❌ 로그인 처리 중 오류 발생:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during login.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
