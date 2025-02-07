// 파일: /pages/api/loginUser.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

export async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Missing `code` parameter" });
  }

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!BASE_URL) {
      console.error("백엔드 URL 환경 변수에서 못 찾아옴.");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // 카카오 로그인 요청 보내기
    const response = await fetch(`${BASE_URL}/auth/login?code=${code}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("카카오 로그인 실패: ", errorData);
      return res
        .status(response.status)
        .json({ message: "Login failed", error: errorData });
    }

    const data = await response.json();

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

    return res.status(200).json({ memberId: data.memberId });
  } catch (error) {
    console.error("서버 에러: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
