import React from "react";
import H2 from "@/app/_components/H2";
import Button from "@/app/_components/Button";

const Script = () => {
  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <H2 className="mb-4">SCRIPT</H2>
      <form className="space-y-12">
        <div className="w-full">
          <textarea
            className="min-h-[320px] w-full resize-none rounded-lg bg-gray-50 p-4 focus:outline-none"
            placeholder="대사를 입력해주세요."
          />
        </div>
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => console.log("생성하기 버튼 클릭됨")}
            outline={false}
            large={true}
          >
            생성하기
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Script;
