interface RecruitmentResponse {
  id: string;
  message: string;
}

export const getRecruitment = async (recruitmentData: FormData) => {
  try {
    const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/recruitment`;

    if (!BASE_URL) {
      console.error("백엔드 Url 환경 변수에서 못 찾아옴.");
      return;
    }

    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      body: recruitmentData, // FormData 객체 전달
    });

    if (!response.ok) {
      throw new Error("Failed to create recruitment post");
    }

    const result = await response.json();
    console.log("Recruitment post created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating recruitment post:", error);
    throw error;
  }
};
