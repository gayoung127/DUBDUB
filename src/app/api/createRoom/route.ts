import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable"; // 파일 업로드 처리 라이브러리
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // formidable 사용 시 bodyParser 비활성화 필요
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      console.error("Backend URL is not defined.");
      return res.status(500).json({ error: "Backend URL is not defined." });
    }

    // formidable 설정
    const form = formidable({
      uploadDir: path.join(process.cwd(), "/public/uploads"), // 파일 저장 경로
      keepExtensions: true, // 확장자 유지
      maxFileSize: 100 * 1024 * 1024, // 최대 파일 크기 (100MB)
    });

    // form.parse를 Promise로 래핑하여 사용
    const parseForm = () =>
      new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
        (resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
          });
        },
      );

    const { fields, files } = await parseForm();

    // 업로드된 파일 확인
    if (!files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = file.filepath; // 업로드된 파일 경로

    // 파일 읽기 및 Blob으로 변환
    const fileBuffer = await fs.readFile(filePath);
    const fileBlob = new Blob([fileBuffer], {
      type: file.mimetype || "video/mp4",
    });

    // FormData 생성 및 데이터 추가
    const formData = new FormData();
    formData.append("file", fileBlob, file.originalFilename || "video.mp4");

    // 추가 필드도 FormData에 포함
    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value === "string") {
        formData.append(key, value);
      }
    });

    // Fetch 요청으로 백엔드에 전송
    const response = await fetch(`${backendUrl}/recruitment`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
}
