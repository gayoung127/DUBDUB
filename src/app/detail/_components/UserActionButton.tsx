import Button from "@/app/_components/Button";
import React from "react";

const UserActionButton = () => {
  return (
    <div className="flex flex-row-reverse px-8 py-2">
      {/* <Button
        outline="true"
        onClick=""
        children="신청하기"
        className=""
      /> */}
      <button className="h-[54px] w-[196px] rounded-[16px] border border-brand-200 px-[5px] py-[15px] text-center text-xl leading-[20px] text-brand-200 hover:border-0 hover:shadow-[0_0_10px_rgba(0,0,0,0.8)] hover:shadow-brand-100">
        신청하기
      </button>
    </div>
  );
};

export default UserActionButton;
