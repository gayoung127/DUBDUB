import { pageDefault, pageSearch } from "../_temp/temp_lists";

export const getRoomList = async (
  queryParams: string,
  page: number,
  isSearch: boolean,
) => {
  // try {
  //   const response = await fetch(`/recruitments/list/${queryParams}`, {
  //     cache: "no-store",
  //   });
  //   console.log("response = ", response);
  // } catch (error) {
  //   console.error("더빙룸 리스트 조회 중 에러 발생 : ", error);
  // }

  // API ================================

  const data = isSearch ? pageSearch : pageDefault;
  const size = 16;

  const startIndex = page * size;
  const endIndex =
    startIndex + size < data.length ? startIndex + size : data.length;

  const ret = data.slice(startIndex, endIndex);

  return ret;
};
