import Badge from "@/app/_components/Badge";
import Button from "@/app/_components/Button";

const Profile = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-[700px] w-[80%] flex-col items-center justify-center rounded-[8px] border border-brand-200 p-5">
        <div className="flex flex-[8] flex-col justify-center gap-5">
          <div className="flex justify-center">
            <img src="https://picsum.photos/200/200" className="rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-5">
            <span>idkhm0728@naver.com</span>
            <Badge title="Pro" />
          </div>
        </div>
        <div className="flex-[2]">
          <Button outline onClick={() => {}}>
            프로필 수정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
