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

    // ✅ 백엔드 로그인 요청
    const response = await fetch(`${BASE_URL}?code=${code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ 서버가 보낸 쿠키 포함
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Login failed", details: errorData },
        { status: response.status },
      );
    }

    // ✅ Next.js에서 쿠키 접근 (백엔드가 addCookie로 저장했을 경우)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "쿠키가 존재하지 않습니다." },
        { status: 400 },
      );
    }

    // ✅ 기존 쿠키를 다시 저장 (유효기간 연장 예제)
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1일
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    console.log("✅ 쿠키를 다시 설정 완료");
    return NextResponse.json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ 로그인 처리 중 오류 발생:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred during login.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
