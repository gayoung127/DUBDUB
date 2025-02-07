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

    console.log("✅ 로그인 성공, 응답 데이터:", data); // ✅ data 출력

    // 쿠키 저장
    const cookieStore = await cookies();

    // accessToken 저장 (1일 유효기간)
    cookieStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1일
    });

    // refreshToken 저장 (7일 유효기간)
    cookieStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

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
