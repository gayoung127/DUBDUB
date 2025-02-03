import Badge from "@/app/_components/Badge";
import useFilterStore from "@/app/_store/FilterStore";

const FilteredArea = () => {
  const { timeFilter, categoryFilter, genreFilter } = useFilterStore();

  return (
    // 수정
    <div className="flex flex-wrap gap-2 rounded-[12px] bg-white-300 p-4">
      <div className="flex flex-wrap gap-2">
        {timeFilter.map((badge, index) => (
          <Badge key={index} title={badge} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {categoryFilter.map((badge, index) => (
          <Badge key={index} title={badge} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {genreFilter.map((badge, index) => (
          <Badge key={index} title={badge} />
        ))}
      </div>
    </div>
  );
};

export default FilteredArea;
