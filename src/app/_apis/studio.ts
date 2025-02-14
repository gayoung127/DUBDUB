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
    return data.url;
  } catch (error) {
    console.error("error");
    return null; // 기본값 반환
  }
};
