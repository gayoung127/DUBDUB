export const getRecruitment = async (formData: FormData) => {
  try {
    const response = await fetch("/api/createRoom", {
      method: "POST",
      body: formData,
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
