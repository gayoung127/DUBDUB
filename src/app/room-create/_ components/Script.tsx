import H2 from "@/app/_components/H2";
import React from "react";

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
          <button
            type="submit"
            className="rounded-full bg-brand-200 px-8 py-3 text-white-100"
          >
            생성하기
          </button>
        </div>
      </form>
    </section>
  );
};

export default Script;
