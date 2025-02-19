export const getRoomList = async (queryParams: string) => {
  console.log("query = ", queryParams);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/project/list?${queryParams}`,
      {
        cache: "no-store",
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    const data = await response.json();

    return { list: data.content, last: data.last };
  } catch (error) {
    console.error("더빙룸 리스트 조회 중 에러 발생 : ", error);
    return { list: [], last: false }; // 기본값 반환
  }
};
