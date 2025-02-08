import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      throw new Error("Backend URL is not defined.");
    }

    // 원시 데이터를 읽어와 FormData로 전달
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks);

    // 헤더 변환
    const headers: HeadersInit = Object.entries(req.headers).reduce(
      (acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value.join(", "); // 배열을 문자열로 변환
        } else if (value !== undefined) {
          acc[key] = value; // 문자열 값 그대로 사용
        }
        return acc;
      },
      {} as Record<string, string>,
    );

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
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
