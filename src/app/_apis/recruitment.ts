export const getRecruitment = async (recruitmentData: FormData) => {
  try {
    const response = await fetch("/api/createRoom", {
      // Next.js API 라우트를 호출
      method: "POST",
      body: recruitmentData,
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
