const DubRoomArea = ({ isAll }: { isAll: boolean }) => {
  return (
    <div className="h-[700px] w-full px-5">
      {isAll ? (
        <div>전체 더빙룸 목록입니다.</div>
      ) : (
        <div>내 더빙 예정 목록입니다.</div>
      )}
    </div>
  );
};

export default DubRoomArea;
