import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { google } from "googleapis";

type ResponseData = {
  transcription?: string;
  error?: string;
};

export const config = {
  api: {
    bodyParser: false, // 파일 업로드를 처리하기 위해 bodyParser 비활성화
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Step 1: 파일 처리
    const filePath = await saveUploadedFile(req);

    // Step 2: Google Speech-to-Text API 호출
    const transcription = await transcribeAudio(filePath);

    // Step 3: 결과 반환
    res.status(200).json({ transcription });
  } catch (error) {
    console.error("Error during transcription:", error);
    res.status(500).json({ error: "Failed to process the audio file." });
  }
}

// 파일을 저장하는 함수
async function saveUploadedFile(req: NextApiRequest): Promise<string> {
  const chunks: any[] = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const filePath = path.join(process.cwd(), "temp", "uploaded-audio.wav");

      // 디렉토리가 없으면 생성
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      fs.writeFileSync(filePath, buffer);
      resolve(filePath);
    });
    req.on("error", (err) => reject(err));
  });
}

// Google Speech-to-Text API 호출 함수
async function transcribeAudio(filePath: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Google API Key is not configured.");
  }

  const audioBytes = fs.readFileSync(filePath).toString("base64");

  const requestPayload = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "ko-KR",
    },
    audio: {
      content: audioBytes,
    },
  };

  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
    },
  );

  if (!response.ok) {
    throw new Error(`Google Speech-to-Text API error: ${response.statusText}`);
  }

  const data = await response.json();

  // 결과에서 텍스트 추출
  return (
    data.results
      ?.map((result: any) => result.alternatives[0].transcript)
      .join("\n") || ""
  );
}
