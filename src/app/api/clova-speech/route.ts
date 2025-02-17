import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const CLOVA_API_URL = `${process.env.CLOVA_API_URL}`;
  const CLOVA_API_KEY = process.env.CLOVA_API_KEY;

  if (!CLOVA_API_KEY) {
    return NextResponse.json({ error: "API Key가 없습니다." }, { status: 400 });
  }
  const formData = await req.formData();
  const media = formData.get("file") as File;

  if (!media) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  try {
    const apiFormData = new FormData();
    apiFormData.append("media", media);
    apiFormData.append(
      "params",
      JSON.stringify({
        language: "ko-KR",
        completion: "sync", // 동기 방식
      }),
    );

    const response = await fetch(`${CLOVA_API_URL}/recognizer/upload`, {
      method: "POST",
      headers: {
        "X-CLOVASPEECH-API-KEY": CLOVA_API_KEY,
      },
      body: apiFormData,
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ result: data }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: data.message },
        { status: response.status },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "API 요청 실패" }, { status: 500 });
  }
}
