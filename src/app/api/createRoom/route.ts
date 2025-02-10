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

    // 백엔드 엔드포인트 URL 생성
    const fullUrl = `${backendUrl}/recruitment`;

    // 요청 본문 읽기 (multipart/form-data 처리)
    const formData = await request.formData();
    const body = new FormData();

    // formData를 복사하여 새로운 FormData 생성
    for (const [key, value] of formData.entries()) {
      body.append(key, value);
    }

    // 헤더 복사
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 백엔드로 요청 전달
    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: formData,
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
