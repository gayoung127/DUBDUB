import Badge from "@/app/_components/Badge";

const FilteredArea = () => {
  return (
    <div className="flex flex-wrap gap-2 rounded-[12px] bg-white-300 p-4">
      <Badge title="다큐멘터리" />
      <Badge title="영화" />
      <Badge title="드라마" />
      <Badge title="액션" />
      <Badge title="스릴러" />
      <Badge title="공포" />
      <Badge title="SF" />
      <Badge title="로맨스" />
    </div>
  );
};

export default FilteredArea;
