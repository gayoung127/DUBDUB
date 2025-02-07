import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/member/profile`;

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "access 토큰이 존재하지 않습니다." },
        { status: 400 },
      );
    }

    // 백엔드 요청
    const response = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken};`,
      },
      credentials: "include",
    });

    const userData = await response.json();

    return NextResponse.json(userData);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json(
      { error: "유저 데이터 로드 실패" },
      { status: 500 },
    );
  }
}
