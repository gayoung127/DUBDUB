import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("Backend URL is not defined.");
      return NextResponse.json(
        { error: "Backend URL is not defined." },
        { status: 500 },
      );
    }

    // 요청 본문을 읽어오기
    const rawBody = await request.text();

    // 헤더 변환
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 백엔드로 요청 전달
    const response = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: rawBody,
    });

    // 응답 처리
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
