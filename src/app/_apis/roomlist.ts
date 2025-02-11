export const getRoomList = async (queryParams: string) => {
  console.log("query = ", queryParams);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/recruitment/list/?${queryParams}`,
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

  // API ================================

  // const mock = {
  //   content: [
  //     {
  //       id: 1,
  //       title: "Mock Event 1",
  //       currentParticipants: 10,
  //       totalParticipants: 20,
  //       genres: [1, 2],
  //       categories: [1, 2],
  //     },
  //     {
  //       id: 2,
  //       title: "Mock Event 2",
  //       currentParticipants: 5,
  //       totalParticipants: 15,
  //       genres: [3],
  //       categories: [3, 4],
  //     },
  //     {
  //       id: 3,
  //       title: "Mock Event 3",
  //       currentParticipants: 7,
  //       totalParticipants: 10,
  //       genres: [4, 5],
  //       categories: [5, 6],
  //     },
  //   ],
  //   pageable: {
  //     sort: {
  //       sorted: true,
  //       unsorted: false,
  //       empty: false,
  //     },
  //     pageNumber: 0,
  //     pageSize: 3,
  //     offset: 0,
  //     paged: true,
  //   },
  //   totalPages: 2,
  //   totalElements: 6,
  //   last: true,
  //   size: 3,
  //   number: 0,
  //   first: true,
  //   numberOfElements: 3,
  //   empty: false,
  // };
};
