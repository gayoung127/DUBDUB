import Badge from "@/app/_components/Badge";

const Thumbnail = () => {
  return (
    <div className="relative w-[440px] rounded-lg">
      <img
        src="images/tmp/dducip.jpg"
        className="aspect-video w-full rounded-lg"
      />
      <div className="absolute right-2 top-2">
        <Badge title="대기중" />
      </div>
    </div>
  );
};
export default Thumbnail;
