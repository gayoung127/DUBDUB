import { Asset, AudioFile, Track } from "../_types/studio";

// 에셋 추가
export const postAsset = async (pid: string, blob: Blob) => {
  const formData = new FormData();
  console.log("pid = ", pid, ", blob = ", blob);
  formData.append("file", blob, "audio.wav");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${pid}/asset`,
      {
        cache: "no-store",
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    if (!response.ok) {
      console.log("에셋을 서버로 보내던 중 에러");
    }
    const data = await response.json();

    console.log("서버에 새로운 에셋 전송 응답 = ", data);
    return data.url;
  } catch (error) {
    console.error("error");
    return null; // 기본값 반환
  }
};

interface WorkSpaceData {
  assets: Asset[];
  tracks: Track[];
}

export const postProjectData = async (
  pid: string,
  workSpaceData: WorkSpaceData,
) => {
  console.log("저장할 프로젝트 데이터 : ", workSpaceData + " to ", pid);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/${pid}/workspace`,
      {
        cache: "no-store",
        method: "POST",
        credentials: "include",
        body: JSON.stringify(workSpaceData),
      },
    );

    if (response.ok) {
      console.log("workspace data 저장 완료");
    }
  } catch (error) {
    console.error("프로젝트 저장 중 에러 발생");
  }
};
